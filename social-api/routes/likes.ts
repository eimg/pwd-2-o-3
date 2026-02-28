import express from "express";
export const router = express.Router();

import { prisma } from "../libs/prisma";
import { auth } from "../middlewares/auth";

// Toggle like/unlike for a post
router.post("/likes", auth, async (req, res) => {
	const { postId } = req.body;
	
	if (!postId) {
		return res.status(400).json({ msg: "postId is required" });
	}

	try {
		const userId = res.locals.user.id;
		const postIdNum = Number(postId);

		// Verify the post exists
		const post = await prisma.post.findUnique({
			where: { id: postIdNum }
		});

		if (!post) {
			return res.status(404).json({ msg: "Post not found" });
		}

		// Check if the user has already liked this post
		const existingLike = await prisma.like.findUnique({
			where: {
				userId_postId: {
					userId: userId,
					postId: postIdNum
				}
			}
		});

		if (existingLike) {
			// Unlike: remove the existing like
			await prisma.like.delete({
				where: { id: existingLike.id }
			});

			res.json({ 
				msg: "Post unliked successfully", 
				liked: false 
			});
		} else {
			// Like: create a new like
			const like = await prisma.like.create({
				data: { 
					userId: userId, 
					postId: postIdNum 
				}
			});

			res.status(201).json({ 
				msg: "Post liked successfully", 
				liked: true,
				like 
			});
		}
	} catch (e) {
		console.error(e);
		res.status(500).json({ msg: "Failed to toggle like" });
	}
});

// Get like status for a post by the current user
router.get("/likes/:postId", auth, async (req, res) => {
	const postId = Number(req.params.postId);
	const userId = res.locals.user.id;

	try {
		const like = await prisma.like.findUnique({
			where: {
				userId_postId: {
					userId: userId,
					postId: postId
				}
			}
		});

		res.json({ 
			liked: !!like,
			likeId: like?.id || null
		});
	} catch (e) {
		console.error(e);
		res.status(500).json({ msg: "Failed to get like status" });
	}
});