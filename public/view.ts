
import {getNote, getNotes} from "./model.js"
import {onNoteFormSubmit} from "./controller.js"

export function index(notesList : HTMLElement, noteForm : HTMLFormElement, searchForm : HTMLFormElement,
    newNote : HTMLElement, cancelButton : HTMLButtonElement, deleteButton : HTMLButtonElement,
    createdAt : HTMLElement){

    const dateFormatter = new Intl.DateTimeFormat("he");    

    let noteFormShown : "hidden" | "shown" | "editing";
    noteFormShown = "hidden";

    renderNotes("");     

    notesList.addEventListener("click", function(e){
        const target = (e.target as HTMLElement).closest("li");
        const noteId = target?.dataset.id;
        console.log("expensesList clicked");
        if (!noteId){
            return;
        }
        noteFormShown = "editing";
        console.log(`Note ${noteId} clicked, noteFormShown = ${noteFormShown}`);

                        
        showNotesForm(noteId);
        noteForm.classList.add("active");
        notesList.classList.add("disabled");
        noteFormShown = "shown";           
        console.log(`note form done, noteFormShown is: ${noteFormShown}`);                       
        
    });

    
    newNote.addEventListener("click", function(e){
        console.log(`"New Note" clicked, formShown is: ${noteFormShown}.`);
        if (noteFormShown == "shown") {
            noteForm.classList.remove("active");
            notesList.classList.remove("disabled");
            noteFormShown = "hidden";
        } else{                         
            noteForm.classList.add("active");
            notesList.classList.add("disabled");
            console.log("requesting 'showNotesForm' with 'new_note' as id");
            showNotesForm("new_note");
            noteFormShown = "shown"; 
            console.log(`note form done, noteFormShown is: ${noteFormShown}`);
        }
    });

    noteForm.addEventListener("submit", async function(e){
        e.preventDefault();         

        const formElement = e.target as HTMLFormElement;
        const formData = new FormData(formElement , e.submitter);     

        formElement
            .querySelectorAll("input, textarea, button")
            .forEach((element) => (element as HTMLInputElement | HTMLTextAreaElement | HTMLButtonElement).disabled = true);
        try{
            await onNoteFormSubmit(formData);
        }catch(error){
            console.error(error);
        }
        

        formElement
            .querySelectorAll("input, textarea, button")
            .forEach((element) => (element as HTMLInputElement | HTMLTextAreaElement | HTMLButtonElement).disabled = false);
        noteForm.reset();        
        createdAt.removeAttribute("datetime");
        createdAt.textContent = "";
        noteForm.classList.remove("active");
        notesList.classList.remove("disabled");
        noteFormShown = "hidden";  
        console.log(`note form hidden, noteFormShown is: ${noteFormShown}`);           
        renderNotes("");
    });

    searchForm.addEventListener("submit", async function(e){
        e.preventDefault();
        const formElement = e.target as HTMLFormElement;
        const formData = new FormData(formElement, e.submitter);
        const searchQuery = formData.get("search");
        console.log(`Search is submitted.\n
                    Search querry is: ${searchQuery}`);
            
        
        renderNotes(`?search=${searchQuery}`);
    });

    cancelButton.addEventListener("click", function(e){
        e.preventDefault();
        console.log("note form canceled");
        noteForm.reset();
        createdAt.removeAttribute("datetime");
        createdAt.textContent = "";
        noteForm.classList.remove("active");    
        notesList.classList.remove("disabled");        
        noteFormShown = "hidden";
        console.log(`note form hidden, noteFormShown is: ${noteFormShown}`);
    });                           

    async function renderNotes(query : string) {
        
        try{
            const notes = await getNotes(query);
            console.log(notes);
        
            notesList.innerHTML = notes
                .map((note) => `
                                <li data-id="${note._id}">
                                    ${(new Date(note.createdAt).toLocaleDateString("he"))} ${note.title}
                                </li>
                                `)
                .join("\n");
        }catch(error){
            console.error(error);
        }
        
    }  

    async function showNotesForm(noteId : string) {        
    

        if (noteId != "new_note"){

            const note = await getNote(noteId);
            if (!note){
                return;
            }

            console.log(`note title is: ${note.title}`);
            noteForm.reset();
    
            noteForm.noteId.value = note._id;
            const title = noteForm.elements.namedItem('title') as HTMLInputElement;
            title.value = note.title;            
            console.log(note.body);
            noteForm.body.value = note.body || "";
            createdAt.setAttribute("datetime", new Date(note.createdAt).toLocaleDateString("he"));
            createdAt.textContent = dateFormatter.format(new Date(note.createdAt));
        } else{
            console.log(`making empty form with noteId = ${noteId}`);
            noteForm.reset();
            noteForm.noteId.value = noteId;    
    
            createdAt.setAttribute("datetime", new Date().toLocaleDateString("he"));
            createdAt.textContent = dateFormatter.format(new Date());
        }                     
    }

}

