import express from "express";
export const router = express.Router();

import { prisma } from "../libs/prisma";
import { auth } from "../middlewares/auth";

// Create a new comment
router.post("/comments", auth, async (req, res) => {
	const { content, postId } = req.body;
	
	if (!content || !postId) {
		return res.status(400).json({ msg: "content and postId are required" });
	}

	try {
		// Verify the post exists
		const post = await prisma.post.findUnique({
			where: { id: Number(postId) }
		});

		if (!post) {
			return res.status(404).json({ msg: "Post not found" });
		}

		const userId = res.locals.user.id;
		const comment = await prisma.comment.create({
			data: { 
				content, 
				postId: Number(postId), 
				userId 
			},
			include: { 
				user: true 
			}
		});

		res.status(201).json(comment);
	} catch (e) {
		console.error(e);
		res.status(500).json({ msg: "Failed to create comment" });
	}
});

// Delete a comment (only owner can delete)
router.delete("/comments/:id", auth, async (req, res) => {
	const commentId = Number(req.params.id);
	const userId = res.locals.user.id;

	try {
		// Find the comment and verify ownership
		const comment = await prisma.comment.findUnique({
			where: { id: commentId }
		});

		if (!comment) {
			return res.status(404).json({ msg: "Comment not found" });
		}

		if (comment.userId !== userId) {
			return res.status(403).json({ msg: "You can only delete your own comments" });
		}

		await prisma.comment.delete({
			where: { id: commentId }
		});

		res.json({ msg: "Comment deleted successfully" });
	} catch (e) {
		console.error(e);
		res.status(500).json({ msg: "Failed to delete comment" });
	}
});