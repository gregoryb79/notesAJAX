import express from "express";
import { router as notesRouter } from "./notes.router";
import { router as usersRouter } from "./users.router"
import { router as messagesRouter } from "./messages.router"

export const router = express.Router();

router.use("/notes", notesRouter);
router.use("/users", usersRouter);
router.use("/messages",messagesRouter);