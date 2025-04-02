import { create } from "domain";
import { addAbortListener } from "events";
import { title } from "process";
import { json } from "stream/consumers";

export type Note = {
    _id: string,
    createdAt: string,
    title: string,
    body?: string
};
type User = {
    _id: string,
    email: string,
    password: string,
    name: string,
    createdAt: string
}

type Message = {
    _id : string,
    note: Note,
    to: User,
    from: User
}

let userId = "";
export async function getLoggedUser(): Promise<User|null> {
    try{
        const res = await fetch(`/api/users`);
    
        if (!res.ok){
            console.log('No one is logged in.');
            return null;       
        }
        const user = await res.json();  
        userId = user._id;  
        console.log(`User ${user._id} is logged in.`); 
        return user;  
    }catch(error){
        console.error(`Error cheking for login status`, error);
        return null;
    } 
}


type submittedNote = Omit<Note,"createdAt">;
export async function addEditNote(note : submittedNote) : Promise<string> {
    const body = JSON.stringify(note);
    console.log(body);
    try{
        const res = await fetch(`/api/notes/${note._id}`, {
                method: "put",
                body,
                headers: {
                    "content-type": "application/json"
                }
            });        
        if (!res.ok) {
            throw new Error(`Failed to add/edit note. Status: ${res.status}`);
        } 
        
        const noteId = await res.json();
        console.log(`Note added/edited, note id is ${noteId}`);
        return noteId;
        
    }catch (error) {
        console.error("Error adding/editing note:", error);
        throw error; 
    }
}

export async function deleteNote(id : string): Promise<void>{
    try { 
        const res = await fetch(`/api/notes/${id}`, {method: "delete"});    
        if (!res.ok) {
            throw new Error(`Failed to delete note. Status: ${res.status}`);
        }
    } catch (error) {
        console.error("Error deleting note:", error);
        throw error; 
    }
}

type returnedNotes = Omit<Note,"body">;
export async function getNotes(query : string) : Promise<returnedNotes[]>{
    try {
        const res = await fetch(`/api/notes${query}`);
        if (!res.ok) {
            const message = await res.text();             
            throw new Error(`Failed to fetch notes. Status: ${res.status}. Message: ${message}`);
        }       
        const notes: returnedNotes[] =  await res.json();
        return notes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }catch (error) {
        console.error("Error fetching notes:", error);
        throw error; 
    }    
}

export async function getNote(id : string) : Promise<Note|null>{
    
    try{
        const res = await fetch(`/api/notes/${id}`);
        if (res.status === 200){
            const note : Note = await res.json();
            return note;
        }else{
            return null;
        }
    }catch(error){
        console.error(`Error fetching note id: ${id}:`, error);
        return null;
    }    
}

export async function doLogIn(email : string, password: string): Promise<void> {
    
    const credantials = {
        email: email,
        password: password,
    };    

    const body = JSON.stringify(credantials);

    try{
        const res = await fetch(`/login`, {
            method: "post",
            body,
            headers: {
                "content-type": "application/json"
            }
        });
        if (!res.ok) {
            const message = await res.text();             
            throw new Error(`Failed to log in. Status: ${res.status}. Message: ${message}`);
        }
        console.log(`loged in with: ${email} - ${password}`);
        
    }catch(error){
        console.error(`Error logging in`, error);        
    }    
}

type submittedUser = Omit<User,"createdAt"|"_id">;
export async function doRegister(user: submittedUser): Promise<void> {   
      
    const body = JSON.stringify(user);

    try{
        const res = await fetch(`/register`, {
            method: "post",
            body,
            headers: {
                "content-type": "application/json"
            }
        });
        if (!res.ok) {
            const message = await res.text();             
            throw new Error(`Failed to register. Status: ${res.status}. Message: ${message}`);
        }
        console.log(`Registered with: ${user.email} - ${user.password}`);
        
    }catch(error){
        console.error(`Error logging in`, error);        
    }    
}

export async function logOut():Promise<void> {
    try{
        const res = await fetch(`/logout`);        
    }catch(error){
        console.error(`Error logging out`, error);              
    } 
}

export async function sendMessage(note: submittedNote, email : string): Promise<void>{
    
    let recepientId = "";
    try{
        const res = await fetch(`/api/users/${email}`);
        if (!res.ok) {
            const message = await res.text();             
            throw new Error(`No recepient found Status: ${res.status}. Message: ${message}`);
        }   
        const user = await res.json();
        console.log(user);
        recepientId = user[0]._id;

        console.log(`The ID of ${email} is ${recepientId}`);

    }catch (error) {
        console.error("Error sending note:", error);
        throw error; 
    }   
    
    const message = {
        note : note._id,
        to: recepientId,
        from: userId,
    }

    const body = JSON.stringify(message);
    console.log(body);
    try{
        const res = await fetch(`/api/messages`, {
                method: "put",
                body,
                headers: {
                    "content-type": "application/json"
                }
            });
        
        if (!res.ok) {
            throw new Error(`Failed to add message note. Status: ${res.status}`);
        }
    }catch (error) {
        console.error("Error adding message:", error);
        throw error; 
    }
    
}

type returnedMessage = Omit <Message,"to"|"from">;
export async function checkMessages() : Promise<returnedNotes[]> {
    
    const sentNotes: returnedNotes[] = [];

    if (!userId){
        throw new Error(`No user logged in - unable to check messages.`)
    }
    try{
        const res = await fetch(`/api/messages/${userId}`);
        const messages: returnedMessage[] =  await res.json();
        console.log(messages);
        for (const message of messages){
            const rawNote = message.note;           
            const note = {
                _id : rawNote._id,
                title : rawNote.title,
                createdAt : rawNote.createdAt};           

            sentNotes.push(note);
        }

        return sentNotes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
              
    }catch(error){
        console.error(`Error getting messages.`,error);
        throw error;
    }      
}
