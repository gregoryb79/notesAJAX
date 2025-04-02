import express from "express";
import {User} from "../models/users.model"
import mongoose from "mongoose";
import { authenticate } from "../middleware/authenticate";

export const router = express.Router();

router.get("/",authenticate, async (req, res) => {
    const userId = req.signedCookies.userId;
    console.log("returning user routing");
    try{
        const user = await User.findById(userId);
        res.json(user);
    }catch (error) {
        console.error(`Couldnt find user: ${userId} in DB.`,error);

        res.status(500);
        res.send(`Couldnt find user: ${userId} in DB.`);
    }   
   
});

router.get("/:email",authenticate, async (req, res) => {
    const { email } = req.params;
    console.log("returning user ID from email routing");
    try{
        const user = await User.find(
            {email: new RegExp(email?.toString() ?? "", "gi")
            },
            { _id: true}
        );               
        console.log(`the id for ${email} is ${user}`)
        res.json(user);
    }catch(error) {
        console.error(`Couldnt find the email: ${email} in users DB.`,error);
        res.status(500);
        res.send(`Couldnt find the email: ${email} in users DB.`);
    }   
});