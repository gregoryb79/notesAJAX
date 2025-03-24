import express from "express";
import { router as notesRouter } from "./notes.router";

export const router = express.Router();

router.use("/notes", notesRouter);