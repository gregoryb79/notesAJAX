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

router.get("/:id", (req, res) => {
    const { id } = req.params;
    const note = model.getNote(id);    

    if (!note) {
        console.log(`Note id: ${id} not found.`);
        res.status(404);
        res.end();
        return; 
    }

    console.log(`Note id: ${note.id} with title ${note.title} is sent as json.`);
    res.json(note);
});

router.put("/:id", async (req, res) => {
    const body = req.body;
    const { id } = req.params;

    await model.createOrUpdate(id, body);

    res.status(201);
    res.end();
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await model.deleteNote(id);        
    } catch {
        console.log(`Couldnt delete note id: ${id}.`);
        res.status(404);
        res.end();
        return;
    }

    res.status(204);
    res.end();
});