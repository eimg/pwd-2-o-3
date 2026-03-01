import express from "express";
export const router = express.Router();

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { prisma } from "../libs/prisma";

import { auth } from "../middlewares/auth";

router.get("/users/verify", auth, async (req, res) => {
    const id = res.locals.user.id as number;
    const user = await prisma.user.findFirst({
        where: { id }
    });

    res.json(user);
})

// Get user profile by username
router.get("/users/:username", async (req, res) => {
    const username = req.params.username;

    try {
        const user = await prisma.user.findUnique({
            where: { username },
            include: {
                posts: {
                    orderBy: { id: "desc" },
                    include: {
                        user: true,
                        comments: true,
                        likes: true
                    }
                },
                _count: {
                    select: {
                        posts: true,
                        comments: true,
                        likes: true,
                        followers: true,
                        following: true
                    }
                }
            }
        });

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Remove password from response
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: "Failed to get user profile" });
    }
})

router.post("/users", async (req, res) => {
	const name = req.body?.name;
	const username = req.body?.username;
	const bio = req.body?.bio;
	const password = req.body?.password;

	if (!name || !username || !bio || !password) {
		return res
			.status(400)
			.json({ msg: "name, username, bio, password: all required" });
	}

	try {
		const hash = await bcrypt.hash(password, 10);

		const user = await prisma.user.create({
			data: { name, username, bio, password: hash },
		});

		res.status(201).json(user);
	} catch (e) {
		res.status(500).json({ msg: e });
	}
});

router.post("/users/login", async (req, res) => {
	const username = req.body?.username;
	const password = req.body?.password;

	if (!username || !password) {
		return res.status(400).json({ msg: "username and password required" });
	}

	try {
		const user = await prisma.user.findFirst({
			where: { username },
		});

		if (user) {
			if (await bcrypt.compare(password, user.password)) {
				const token = jwt.sign(
					{ id: user.id },
					process.env.JWT_SECRET as string,
				);

				return res.json({ user, token });
			}
		}

		res.status(401).json({ msg: "username or password incorrect" });
	} catch (e) {
		res.status(500).json({ msg: e });
	}
});
