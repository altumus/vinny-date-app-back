import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const create = async (req, res) => {
	try {
		const createdTag = await prisma.tags.create({
			data: {
				color: req.body.color,
				title: req.body.title,
				creatorId: req.body.creatorId,
			},
		});

		res.status(200).json(createdTag);
	} catch (error) {
		console.log('error while create tag', error);
	}
};

export const getUserTags = async (req, res) => {
	try {
		const userTags = await prisma.tags.findMany({
			where: {
				creatorId: req.body.creatorId,
			},
		});

		res.status(200).json(userTags);
	} catch (error) {
		console.log('error while get users tags', error);
	}
};

export const getAllTags = async (req, res) => {
	try {
		const userTags = await prisma.tags.findMany({
			where: {
				NOT: {
					creatorId: req.body.creatorId,
				},
			},
		});

		res.status(200).json(userTags);
	} catch (error) {
		console.log('error while get all tags', error);
	}
};

export const update = async (req, res) => {
	try {
		const updatedTag = await prisma.tags.update({
			where: {
				creatorId: req.body.creatorId,
			},
			data: {
				color: req.body.color,
				title: req.body.title,
			},
		});

		res.status(200).json(updatedTag);
	} catch (error) {
		console.log('error while update tag', error);
	}
};

export const remove = async (req, res) => {
	try {
		const removedTag = await prisma.tags.delete({
			where: {
				id: req.body.tagId,
			},
		});

		res.status(200).json(removedTag);
	} catch (error) {
		console.log('error while remove tag', error);
	}
};
