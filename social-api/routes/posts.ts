import express from "express";
export const router = express.Router();

import { prisma } from "../libs/prisma";

import { auth } from "../middlewares/auth";

router.get("/posts", async (req, res) => {
	const posts = await prisma.post.findMany({
		take: 20,
		orderBy: { id: "desc" },
		include: { 
			user: true, 
			comments: true,
			likes: true
		},
	});

	res.json(posts);
});

router.get("/posts/:id", async (req, res) => {
	const id = req.params.id;

	const post = await prisma.post.findFirst({
		where: { id: Number(id) },
		include: { 
            user: true, 
            comments: { 
                include: { 
                    user: true,
                } 
            },
            likes: true
        },
	});

	res.json(post);
});

router.post("/posts", auth, async (req, res) => {
	const content = req.body?.content;
	if (!content) {
		return res.status(400).json({ msg: "content is required" });
	}

	try {
		const id = res.locals.user.id;
		const post = await prisma.post.create({
			data: { content, userId: id },
			include: { user: true, comments: true, likes: true }
		});

		res.status(201).json(post);
	} catch (e) {
		console.error(e);
		res.status(500).json({ msg: "Failed to create post" });
	}
});

// Delete a post (only owner can delete)
router.delete("/posts/:id", auth, async (req, res) => {
	const postId = Number(req.params.id);
	const userId = res.locals.user.id;

	try {
		// Find the post and verify ownership
		const post = await prisma.post.findUnique({
			where: { id: postId }
		});

		if (!post) {
			return res.status(404).json({ msg: "Post not found" });
		}

		if (post.userId !== userId) {
			return res.status(403).json({ msg: "You can only delete your own posts" });
		}

		// Delete the post (comments will be deleted automatically due to cascade)
		await prisma.post.delete({
			where: { id: postId }
		});

		res.json({ msg: "Post deleted successfully" });
	} catch (e) {
		console.error(e);
		res.status(500).json({ msg: "Failed to delete post" });
	}
});
