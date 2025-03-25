import * as path from "path";
import { readFileSync } from "fs";
import { writeFile } from "fs/promises";

type Note = {
    id: string,
    createdAt: number,
    title: string,
    body?: string
};

const dataPath = path.join(__dirname, "..", "data", "notes.json");

let notes: Map<string,Note> = loadNotes();

function loadNotes() : Map<string,Note> {
    try {
        const fileData = readFileSync(dataPath, "utf8");
        console.log((new Date()).toLocaleString(),`Notes loaded from ${dataPath}`);
        const notesArray: [string, Note][] = Object.entries(JSON.parse(fileData));
        const notes = new Map<string, Note>(notesArray);
        // for (const id of notes.keys()){
        //     console.log(`${id} - ${notes.get(id)?.id} ${notes.get(id)?.title}`);
        // }
        return notes;
    } catch (error) {
        console.error(error);
        return new Map<string, Note>();
    }

     
}

export function getNotes(){    
    return Array.from(notes.values()).sort((a,b) => b.createdAt - a.createdAt);
}

export function getNote(id : string) : Note | undefined{
    const note = notes.get(id);
    return note;
}

function saveNotes() {
    return writeFile(dataPath, JSON.stringify(notes));
}

type UpdateNotegData = Omit<Note, "id" | "createdAt">;

export function createOrUpdate(id: string, data: UpdateNotegData) {
    const existingNote = notes.get(id);

    if (existingNote) {
        existingNote.title = data.title;
        existingNote.body = data.body;        
    } else {
        notes.set(id,{
            id,
            createdAt: Date.now(),
            ...data
        });
    }

    return saveNotes();
}

export function deleteNote(id: string) {
    
    if (!notes.get(id)) {
        console.error((new Date()).toLocaleString(),`No such note with id: ${id}`);
        throw new Error();
    }

    notes.delete(id);

    return saveNotes();
}