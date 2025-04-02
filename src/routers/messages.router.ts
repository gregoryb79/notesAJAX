import express from "express";
import {Message} from "../models/messages.model"
import mongoose from "mongoose";
import { authenticate } from "../middleware/authenticate";

export const router = express.Router();

router.put("/",authenticate, async (req, res) => {
    const body = req.body;         
   
    const newMessage = new Message({
        note: body.note,
        to: body.to,
        from: body.from,
    });
    console.log(newMessage);
    try{
        await newMessage.save();
        res.status(201);
        res.end();
    } catch (error) {        
        console.error(`Couldnt save new message.`,error);
        res.status(500);
        res.send(`Couldnt save message note.`);
    }
      
        
});