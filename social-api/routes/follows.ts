import express from "express";
export const router = express.Router();

import { prisma } from "../libs/prisma";
import { auth } from "../middlewares/auth";

// Toggle follow/unfollow a user
router.post("/follows", auth, async (req, res) => {
    const followerId = res.locals.user.id as number;
    const followingId = req.body?.followingId;

    if (!followingId) {
        return res.status(400).json({ msg: "followingId is required" });
    }

    // Prevent self-follow
    if (followerId === followingId) {
        return res.status(400).json({ msg: "Cannot follow yourself" });
    }

    try {
        // Check if user exists
        const userToFollow = await prisma.user.findUnique({
            where: { id: followingId }
        });

        if (!userToFollow) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Check if already following
        const existingFollow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId
                }
            }
        });

        if (existingFollow) {
            // Unfollow
            await prisma.follow.delete({
                where: {
                    followerId_followingId: {
                        followerId,
                        followingId
                    }
                }
            });
            res.json({ following: false, msg: "Unfollowed successfully" });
        } else {
            // Follow
            await prisma.follow.create({
                data: {
                    followerId,
                    followingId
                }
            });
            res.json({ following: true, msg: "Followed successfully" });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: "Failed to toggle follow status" });
    }
});

// Get follow status for a specific user
router.get("/follows/:userId", auth, async (req, res) => {
    const followerId = res.locals.user.id as number;
    const followingId = parseInt(req.params.userId);

    if (!followingId || isNaN(followingId)) {
        return res.status(400).json({ msg: "Invalid user ID" });
    }

    try {
        const follow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId
                }
            }
        });

        res.json({ following: !!follow });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: "Failed to get follow status" });
    }
});

// Get followers of a user
router.get("/follows/:userId/followers", async (req, res) => {
    const userId = parseInt(req.params.userId);

    if (!userId || isNaN(userId)) {
        return res.status(400).json({ msg: "Invalid user ID" });
    }

    try {
        const followers = await prisma.follow.findMany({
            where: { followingId: userId },
            include: {
                follower: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        bio: true
                    }
                }
            },
            orderBy: { createAt: "desc" }
        });

        res.json(followers.map(f => f.follower));
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: "Failed to get followers" });
    }
});

// Get following of a user
router.get("/follows/:userId/following", async (req, res) => {
    const userId = parseInt(req.params.userId);

    if (!userId || isNaN(userId)) {
        return res.status(400).json({ msg: "Invalid user ID" });
    }

    try {
        const following = await prisma.follow.findMany({
            where: { followerId: userId },
            include: {
                following: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        bio: true
                    }
                }
            },
            orderBy: { createAt: "desc" }
        });

        res.json(following.map(f => f.following));
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: "Failed to get following" });
    }
});