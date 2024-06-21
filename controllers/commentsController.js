import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const create = async (req, res) => {
	try {
		const createdComment = await prisma.comments.create({
			data: {
				content: req.body.content,
				creatorId: req.body.creatorId,
				postId: req.body.postId,
			},
		});

		res.status(200).json(createdComment);
	} catch (error) {
		console.log('error while create comment', error);
	}
};

export const remove = async (req, res) => {
	try {
		const deletedComment = await prisma.comments.delete({
			where: {
				id: req.body.commentId,
			},
		});

		res.status(200).json(deletedComment);
	} catch (error) {
		console.log('error while remove post', error);
	}
};
