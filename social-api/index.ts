import express from "express";
const app = express();

app.use(express.json());
app.use(express.urlencoded());

import cors from "cors";
app.use(cors());

import { router as postsRouter } from "./routes/posts";
app.use(postsRouter);

import { router as usersRouter } from "./routes/users";
app.use(usersRouter);

import { router as commentsRouter } from "./routes/comments";
app.use(commentsRouter);

import { router as likesRouter } from "./routes/likes";
app.use(likesRouter);

import { router as followsRouter } from "./routes/follows";
app.use(followsRouter);

app.get("/", (req, res) => {
    res.json({ msg: "Social API up and running..." });
});

app.listen(8800, () => {
    console.log("Social API running at 8800...");
});
