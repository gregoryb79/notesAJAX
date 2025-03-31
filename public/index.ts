type Note = {
    id: string,
    createdAt: number,
    title: string,
    body?: string
};

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
            if (noteFormShown == "editing") {
                noteForm.classList.remove("active");
                notesList.classList.remove("disabled");
                noteFormShown = "hidden";
            } else{
                const id = crypto.randomUUID().replace(/-/g, "").slice(-8);               
                noteForm.classList.add("active");
                notesList.classList.add("disabled");
                showNotesForm(id);
                noteFormShown = "shown"; 
                console.log(`note form done, noteFormShown is: ${noteFormShown}`);
            }
        });

        noteForm.addEventListener("submit", async function(e){
            e.preventDefault();         

            const formElement = e.target as HTMLFormElement;
            const formData = new FormData(formElement , e.submitter);
            const rawNote = Object.fromEntries(formData);  
            console.log(`form submitted, id: ${rawNote.noteId}, title: ${rawNote.title}`);
            const note = {id : rawNote.noteId,
                        title: rawNote.title,
                        body: rawNote.body || undefined};

            const buttonClicked = e.submitter;
            if (buttonClicked?.id === "deleteButton"){
                console.log(`DELETE requested for note: ${note.id} - ${note.title}`);

                formElement
                .querySelectorAll("input, textarea, button")
                .forEach((element) => (element as HTMLInputElement | HTMLTextAreaElement | HTMLButtonElement).disabled = true);

                await fetch(`/api/notes/${note.id}`, {method: "delete"});

                formElement
                .querySelectorAll("input, textarea, button")
                .forEach((element) => (element as HTMLInputElement | HTMLTextAreaElement | HTMLButtonElement).disabled = false);

                console.log(`note: ${rawNote.noteId} - ${rawNote.title} is DELETED`);
                noteForm.reset();
                createdAt.removeAttribute("datetime");
                createdAt.textContent = "";
                noteForm.classList.remove("active"); 
                notesList.classList.remove("disabled");           
                noteFormShown = "hidden";                
                console.log(`note form hidden, noteFormShown is: ${noteFormShown}`);
                renderNotes("");
                return;
            }                      
                       
            const body = JSON.stringify(note);
            console.log(body);

            formElement
                .querySelectorAll("input, textarea, button")
                .forEach((element) => (element as HTMLInputElement | HTMLTextAreaElement | HTMLButtonElement).disabled = true);

            await fetch(`/api/notes/${note.id}`, {
                method: "put",
                body,
                headers: {
                    "content-type": "application/json"
                }
            });

            formElement
                .querySelectorAll("input, textarea, button")
                .forEach((element) => (element as HTMLInputElement | HTMLTextAreaElement | HTMLButtonElement).disabled = false);
            noteForm.reset();
            noteForm.classList.remove("active");
            notesList.classList.remove("disabled");
            noteFormShown = "hidden";             
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
            const res = await fetch(`/api/notes${query}`);
            const notes: Note[] = await res.json();
            
            notesList.innerHTML = notes
                .map((note) => `
                                <li data-id="${note.id}">
                                    ${(dateFormatter.format(note.createdAt))} ${note.title}
                                </li>
                                `)
                .join("\n");
        }  
    
        async function showNotesForm(noteId : string) {
            const res = await fetch(`/api/notes/${noteId}`);
        
            if (res.status === 200){
                const note = await res.json();
                console.log(`note title is: ${note.title}`);
                noteForm.reset();
        
                noteForm.noteId.value = note.id;
                const title = noteForm.elements.namedItem('title') as HTMLInputElement;
                title.value = note.title;            
                console.log(note.body);
                noteForm.body.value = note.body || "";
        
                                createdAt.setAttribute("datetime", new Date(note.createdAt).toISOString());
                createdAt.textContent = dateFormatter.format(new Date(note.createdAt));
            } else{
                noteForm.reset();
                noteForm.noteId.value = noteId;    
        
                createdAt.setAttribute("datetime", new Date().toISOString());
                createdAt.textContent = dateFormatter.format(new Date());
            }                     
        }

}

