import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const create = async (req, res) => {
	try {
		const isUserExists = await prisma.users.findUnique({
			where: {
				email: req.body.email,
			},
		});

		if (isUserExists) {
			return res.status(200).json({ message: 'user already exists' });
		}

		const createdUser = await prisma.users.create({
			data: {
				email: req.body.email,
				name: req.body,
				avatar: req.body?.avatar || null,
				hash: req.body.hash,
			},
		});

		res.status(200).json(createdUser);
	} catch (error) {
		console.log('error while create user', error);
	}
};

export const login = async (req, res) => {
	try {
		const loggedUser = await prisma.users.findUnique({
			where: {
				email: req.body.email,
				hash: req.body.hash,
			},
		});

		if (!loggedUser) {
			return res.status(404).json({ message: 'user not exists' });
		}

		res.status(200).json(loggedUser);
	} catch (error) {
		console.log('error while login', error);
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
		const updatedUser = await prisma.users.update({
			where: {
				id: req.body.id,
			},
			data: {
				avatar: req.body.avatar,
				email: req.body.email,
				hash: req.body.hash,
				name: req.body.name,
			},
		});

		res.status(200).json(updatedUser);
	} catch (error) {
		console.log('error while updateUser', error);
	}
};
