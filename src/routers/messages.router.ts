import express from "express";
import {Message} from "../models/messages.model"
import {Note} from "../models/notes.model"
import mongoose from "mongoose";
import { authenticate } from "../middleware/authenticate";


export const router = express.Router();

router.put("/",authenticate, async (req, res) => {
    const body = req.body;         
    console.log(body);
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

router.get("/:id",authenticate, async (req, res) => {
    const { id } = req.params;
    
    try{
        const messages = await Message.find({to: id}).populate("note");
        res.json(messages);
    } catch(error) {
        console.error(`Couldnt get messages for: ${id} in DB.`,error);
        res.status(500);
        res.send(`Couldnt get messages for: ${id} in DB.`);
    }
});