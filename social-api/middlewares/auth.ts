import express from "express";
import jwt from "jsonwebtoken";

export function auth(
	req: express.Request,
	res: express.Response,
	next: express.NextFunction,
) {
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) {
		return res.status(401).json({ msg: "access token required" });
	}

	try {
		const user = jwt.verify(token, process.env.JWT_SECRET as string) as {
			id: number;
		};

        res.locals.user = user;
        next();
	} catch (e) {
		res.status(401).json({ msg: "invalid token" });
	}
}
