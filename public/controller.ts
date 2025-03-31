import {Note, addEditNote, deleteNote} from "./model.js"

export async function onNoteFormSubmit(formData: FormData){

    const rawNote = Object.fromEntries(formData);  
    console.log(`form submitted, id: ${rawNote.noteId}, title: ${rawNote.title}`);

    if(!rawNote.noteId){
        throw new Error("ID can't be empty"); 
    }
    if (typeof rawNote.noteId !== "string"){
        throw new Error("ID must be a string");
    }
    if(!rawNote.title){
        throw new Error("Title can't be empty"); 
    }
    if (typeof rawNote.title !== "string"){
        throw new Error("Title must be a string");
    }
    if (typeof rawNote.body !== "string"){
        throw new Error("Note content must be a string");
    }

    const note = {id : rawNote.noteId,
        title: rawNote.title,
        body: rawNote.body || undefined};

    const buttonClicked = formData.get("action");  

    if (buttonClicked == "delete"){
        
        try{
            await deleteNote(note.id);
        } catch (error){
            console.error(`failed to delete note: ${note.id} - ${note.title}, error: ${error}`);
        }        
        console.log(`note: ${note.id} - ${note.title} is DELETED`);

    }else if (buttonClicked == "apply"){
        
        try{
            await addEditNote(note);
        } catch (error){
            console.error(`failed to apply note: ${note.id} - ${note.title}, error: ${error}`);
        }        
        console.log(`note: ${note.id} - ${note.title} is added/edited`);
    }

    
}