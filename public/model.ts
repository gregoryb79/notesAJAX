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


type submittedNote = Omit<Note,"createdAt">;
export async function addEditNote(note : submittedNote) : Promise<void> {
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
            // console.error(`Error: ${message}`);;
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

export async function isLoggedIn():Promise<boolean> {
    try{
        const res = await fetch(`/api/users`);

        if (!res.ok){
            console.log('No one is logged in.');
            return false;
        }
        const userId = await res.json();
        console.log(`User ${userId} is logged in.`);
        return true;
    }catch(error){
        console.error(`Error cheking for login status`, error);  
        return false;      
    } 
}

export async function logOut():Promise<void> {
    try{
        const res = await fetch(`/logout`);        
    }catch(error){
        console.error(`Error logging out`, error);              
    } 
}
