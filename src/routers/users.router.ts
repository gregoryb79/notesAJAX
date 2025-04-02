import express from "express";
import {User} from "../models/users.model"
import mongoose from "mongoose";
import { authenticate } from "../middleware/authenticate";

export const router = express.Router();

router.get("/",authenticate, async (req, res) => {
    const userId = req.signedCookies.userId;
    res.json(userId);
});

router.get("/",authenticate, async (req, res) => {
    const { email } = req.query;

    try{
        const user = await User.find(
            {email: new RegExp(email?.toString() ?? "", "gi")
            },
            { _id: true}
        );               
        res.json(user);
    }catch(error) {
        console.error(`Couldnt find the email: ${email} in users DB.`,error);
        res.status(500);
        res.send(`Couldnt find the email: ${email} in users DB.`);
    }   
});