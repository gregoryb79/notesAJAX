import express from "express";
import * as model from "../notes.model";

export const router = express.Router();

router.get("/", (req, res) => {
    const { search } = req.query;
    const result = model
        .getNotes()
        .filter(({ title, body }) =>
            typeof search !== "string" ||
            title.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
            body && body.toLowerCase().indexOf(search.toLowerCase()) > -1
        )
        .map(({ id, title, createdAt }) => ({
            id,
            title,
            createdAt
        }));

    res.json(result);
});