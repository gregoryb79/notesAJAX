import {doLogIn, addEditNote, deleteNote, doRegister} from "./model.js"

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
    const note = {_id : rawNote.noteId,
        title: rawNote.title,
        body: rawNote.body || undefined,
    };

    const buttonClicked = formData.get("action");  

    if (buttonClicked == "delete"){
        
        try{
            await deleteNote(note._id);           
        } catch (error){
            console.error(`failed to delete note: ${note._id} - ${note.title}, error: ${error}`);
        }        
        

    }else if (buttonClicked == "apply"){
        
        try{
            await addEditNote(note);           
        } catch (error){
            console.error(`failed to apply note: ${note._id} - ${note.title}, error: ${error}`);
        }        
        
    }

    
}

export async function onLoginFormSubmit(formData: FormData){

    const rawData = Object.fromEntries(formData);  
    console.log(`login form submitted, email: ${rawData.username}, password: ${rawData.password}`);

    if(!rawData.username){
        throw new Error("username can't be empty"); 
    }
    if (typeof rawData.username !== "string"){
        throw new Error("username must be a string");
    }
    if(!rawData.password){
        throw new Error("Password can't be empty"); 
    }
    if (typeof rawData.password !== "string"){
        throw new Error("Password must be a string");
    }
     
    const email = rawData.username;
    const password = rawData.password; 
        
    try{
        await doLogIn(email,password);        
    } catch (error){
        console.error(`failed to log in with: ${email} - ${password}, error: ${error}`);
    }        
     
   
}

export async function onRegisterFormSubmit(formData: FormData){

    const rawData = Object.fromEntries(formData);  
    console.log(`register form submitted, email: ${rawData.username},\n
                 password: ${rawData.password},\n
                 name: ${rawData.name}`);

    if(!rawData.username){
        throw new Error("username can't be empty"); 
    }
    if (typeof rawData.username !== "string"){
        throw new Error("username must be a string");
    }
    if(!rawData.password){
        throw new Error("Password can't be empty"); 
    }
    if (typeof rawData.password !== "string"){
        throw new Error("Password must be a string");
    }

    if(!rawData.name){
        throw new Error("Name can't be empty"); 
    }
    if (typeof rawData.name !== "string"){
        throw new Error("Name must be a string");
    }
     
    const user = {
        email: rawData.username,
        password: rawData.password,
        name: rawData.name
    };
        
    try{
        await doRegister(user);         
    } catch (error){
        console.error(`failed to register with: ${user.email}, error: ${error}`);
    }        
     
   
}