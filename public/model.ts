export type Note = {
    _id: string,
    createdAt: string,
    title: string,
    body?: string
};

type submittedNote = {
    _id: string,    
    title: string,
    body?: string
}
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

type returnedNotes = {
    _id: string,    
    title: string,
    createdAt: string
}
export async function getNotes(query : string) : Promise<returnedNotes[]>{
    try {
        const res = await fetch(`/api/notes${query}`);
        if (!res.ok) {
            throw new Error(`Failed to fetch notes. Status: ${res.status}`);
        }
        const notesRaw = await res.json();
        console.log("notesRaw:");
        console.log(notesRaw);
        const notes: returnedNotes[] = notesRaw;
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