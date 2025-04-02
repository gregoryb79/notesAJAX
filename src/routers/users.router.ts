import express from "express";
import {Note} from "../models/notes.model"
import mongoose from "mongoose";
import { authenticate } from "../middleware/authenticate";

export const router = express.Router();

router.get("/",authenticate, async (req, res) => {
    const userId = req.signedCookies.userId;
    res.json(userId);
});