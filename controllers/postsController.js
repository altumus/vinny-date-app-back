import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const create = async (req, res) => {
	try {
		const createdPost = await prisma.posts.create({
			data: {
				content: req.body.content,
				title: req.body.title,
				creatorId: req.body.creatorId,
				cover: req.body.cover,
			},
			include: {
				creator: {
					select: {
						avatar: true,
						name: true,
					},
				},
			},
		});

		res.status(200).json(createdPost);
	} catch (error) {
		console.log('req.body is', req.body);
		console.log('error while create post', error);
	}
};

export const getAllPosts = async (req, res) => {
	try {
		const allPosts = await prisma.posts.findMany({
			orderBy: {
				createdAt: 'desc',
			},
			include: {
				PostsTags: {
					include: {
						tags: {
							select: {
								id: true,
								color: true,
								title: true,
							},
						},
					},
				},
				creator: {
					select: {
						id: true,
						avatar: true,
						name: true,
					},
				},
			},
		});

		res.status(200).json(allPosts);
	} catch (error) {
		console.log('error while get all posts');
	}
};

export const getPostById = async (req, res) => {
	try {
		const postDetails = await prisma.posts.findFirst({
			where: {
				id: Number(req.query.postId),
			},
			include: {
				PostsComments: {
					include: {
						comment: {
							select: {
								id: true,
								content: true,
								creator: true,
								dislikes: true,
								likes: true,
								createdAt: true,
							},
						},
					},
				},
				creator: {
					select: {
						name: true,
						avatar: true,
						id: true,
					},
				},
			},
		});

		await prisma.posts.update({
			where: {
				id: postDetails.id,
			},
			data: {
				postViewes: postDetails.postViewes + 1,
			},
		});

		res.status(200).json(postDetails);
	} catch (error) {
		console.log('error whilte get post by id', error);
	}
};

export const getPostsByTag = async (req, res) => {
	try {
		const postsByTag = await prisma.posts.findMany({
			where: {
				PostTag: {
					every: {
						tagId: req.body.tagId,
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
			include: {
				PostTag: {
					select: {
						tag: {
							select: {
								id: true,
								color: true,
							},
						},
					},
				},
				creator: {
					select: {
						avatar: true,
						email: true,
					},
				},
			},
		});

		res.status(200).json(postsByTag);
	} catch (error) {
		console.log('error while get posts by tag', error);
	}
};

export const remove = async (req, res) => {
	try {
		const deletedPost = await prisma.posts.delete({
			where: {
				id: req.body.id,
			},
		});

		res.status(200).json(deletedPost);
	} catch (error) {
		console.log('error while remove post', error);
	}
};

export const update = async (req, res) => {
	try {
		const updatedPost = await prisma.posts.update({
			where: {
				id: Number(req.body.id),
			},
			data: {
				content: req.body.content,
				dislikes: req.body.dislikes,
				likes: req.body.likes,
				title: req.body.title,
				cover: req.body.cover,
			},
			include: {
				creator: {
					select: {
						avatar: true,
						name: true,
					},
				},
			},
		});

		res.status(200).json(updatedPost);
	} catch (error) {
		console.log('error while update post', error);
	}
};
