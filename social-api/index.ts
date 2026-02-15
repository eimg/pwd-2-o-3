import express from "express";

const app = express();

app.get("/", (req, res) => {
    res.json({ msg: "Social API up and running..." });
});

app.listen(8800, () => {
    console.log("Social API running at 8800...");
});
