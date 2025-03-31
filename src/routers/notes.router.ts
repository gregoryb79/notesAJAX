import express from "express";
// import * as model from "../models/notes.model";
import {Note} from "../models/notes.model"
import mongoose from "mongoose";

export const router = express.Router();

router.get("/", async (req, res) => {
    const { search } = req.query;

    try{
        const notes = await Note.find(
            {
                $or:[
                    {title: new RegExp(search?.toString() ?? "", "gi")},
                    {body: new RegExp(search?.toString() ?? "", "gi")}
                ],
            },
            { _id: true, title: true, createdAt: true},
        );
        res.json(notes);
    } catch(error) {
        console.error(`Couldnt do the query: ${search} in DB.`,error);
        res.status(500);
        res.send(`Couldnt do the query: ${search} in DB.`);
    }    
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;    

    try{
        console.log(`getting note id= ${id}`);
        const note = await Note.findById(id);        

        if (!note) {
            console.log(`note id : ${id} is not in DB.`);
            res.status(404);
            res.send(`note id : ${id} is not in DB.`);            
            return;
        }

        res.json(note);
    }catch (error) {
        console.error(`Couldnt look for note id: ${id} in DB.`,error);

        res.status(500);
        res.send(`Couldnt look for note id : ${id} in DB.`);
    }   
});

router.put("/:id", async (req, res) => {
    const body = req.body;
    const { id } = req.params;
    
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    console.log(`is the id = ${id} valid id? => ${isValidId}`);
    console.log(body);

    if (isValidId) {
        try{
            await Note.findOneAndReplace(
                {_id: id},
                {...body},
                { upsert: true }
            );
    
            res.status(201);
            res.end();
        } catch (error) {        
            console.error(`Couldnt put note id: ${id}.`,error);
            res.status(500);
            res.send(`Couldnt put note id: ${id}.`);
        }
    }else{
        const newNote = new Note({
            title: body.title,
            body: body.body,
            createdAt: new Date(),
        });
        console.log(newNote);
         try{
             await newNote.save();
             res.status(201);
             res.end();
         } catch (error) {        
             console.error(`Couldnt save new note.`,error);
             res.status(500);
             res.send(`Couldnt save new note.`);
         }
    }   
        
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await Note.findOneAndDelete({ _id: id });     
        res.status(204);
        res.end();  
    } catch {
        console.log(`Couldnt delete note id: ${id}.`);
        res.status(500);
        res.send(`Couldnt delete note id: ${id}.`);
        return;
    }

    res.status(204);
    res.end();
});