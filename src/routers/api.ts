import express from "express";
import { router as notesRouter } from "./notes.router";
import { router as usersRouter } from "./users.router"

export const router = express.Router();

router.use("/notes", notesRouter);
router.use("/users", usersRouter);