import { PrismaClient } from '@prisma/client';
import md5 from 'md5';

const prisma = new PrismaClient();

export const create = async (req, res) => {
	try {
		const isUserExists = await prisma.users.findFirst({
			where: {
				email: req.body.email,
			},
		});

		if (isUserExists) {
			return res.status(200).json({ message: 'user already exists' });
		}

		console.log('hash is', req.body);

		const createdUser = await prisma.users.create({
			data: {
				email: req.body.email,
				name: req.body.name,
				avatar: req.body?.avatar || null,
				hash: md5(req.body.hash).toString(),
			},
		});

		res.status(200).json(createdUser);
	} catch (error) {
		console.log('error while create user', error);
	}
};

export const login = async (req, res) => {
	try {
		let loggedUser = await prisma.users.findFirst({
			where: {
				email: req.body.email,
				hash: req.body.hash,
			},
		});

		if (!loggedUser) {
			console.log('hashed');
			loggedUser = await prisma.users.findFirst({
				where: {
					email: req.body.email,
					hash: md5(req.body.hash),
				},
			});
		}

		console.log(
			'req user',
			req.body.email,
			'req.hash',
			req.body.hash,
			'findeduesr',
			loggedUser
		);

		if (!loggedUser) {
			return res.status(404).json({ message: 'user not exists' });
		}

		res.status(200).json(loggedUser);
	} catch (error) {
		res.status(500).json({ message: error });
		console.log(`error while login`, error);
	}
};

export const remove = async (req, res) => {
	try {
		const deletedUser = await prisma.users.delete({
			where: {
				id: req.body.id,
			},
		});

		res.status(200).json(deletedUser);
	} catch (error) {
		console.log('error while remove user', error);
	}
};

export const update = async (req, res) => {
	try {
		if (req.body?.hash) {
			const updatedUser = await prisma.users.update({
				where: {
					id: req.body.id,
					email: req.body.email,
				},
				data: {
					avatar: req.body.avatar,
					email: req.body.email,
					hash: md5(req.body.hash).toString(),
					name: req.body.name,
				},
			});

			res.status(200).json(updatedUser);
		} else {
			const updatedUser = await prisma.users.update({
				where: {
					id: req.body.id,
					email: req.body.email,
				},
				data: {
					avatar: req.body.avatar,
					email: req.body.email,
					name: req.body.name,
				},
			});

			res.status(200).json(updatedUser);
		}
	} catch (error) {
		console.log('error while updateUser', error);
		console.log('req', req.body);
	}
};
