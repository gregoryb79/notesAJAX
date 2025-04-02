
import {getNote, getNotes, getLoggedUser, logOut, checkMessages} from "./model.js"
import {onNoteFormSubmit, onLoginFormSubmit, onRegisterFormSubmit} from "./controller.js"

let isUserLoggedIn = false;
const user = await getLoggedUser();
if (user){
    isUserLoggedIn = true;
}




export function index(notesList : HTMLElement, noteForm : HTMLFormElement, searchForm : HTMLFormElement,
    newNote : HTMLElement, cancelButton : HTMLButtonElement, createdAt : HTMLElement, 
    loginButton : HTMLButtonElement, loginCancel : HTMLButtonElement, 
    loginForm : HTMLFormElement, registerCancel : HTMLButtonElement,
    registerForm : HTMLFormElement, registerLine : HTMLElement, 
    shareButton: HTMLButtonElement, emailField : HTMLElement, helloUsername : HTMLElement,
    sharedNotesList : HTMLElement){

    const dateFormatter = new Intl.DateTimeFormat("he");    

    let noteFormShown : "hidden" | "shown" | "editing";
    let loginFormShown : "hidden" | "shown";
    let registerFormShown : "hidden" | "shown";
    noteFormShown = "hidden";
    loginFormShown = "hidden";
    registerFormShown = "hidden"; 

    if (isUserLoggedIn){
        loginButton.textContent = "Log Out";
        helloUsername.textContent = `Hello, ${user?.name}`;
        helloUsername.classList.add("active");
    }else{
        loginButton.textContent = "Log In"; 
    }
    
    renderNotes("");     

    notesList.addEventListener("click", function(e){
        const target = (e.target as HTMLElement).closest("li");
        const noteId = target?.dataset.id;
        console.log("expensesList clicked");
        if (!noteId){
            return;
        }
        
        console.log(`Note ${noteId} clicked, noteFormShown = ${noteFormShown}`);
                        
        showNotesForm(noteId);
        noteForm.classList.add("active");
        notesList.classList.add("disabled");
        noteFormShown = "editing";          
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
        emailField.classList.remove("active")
        emailField.removeAttribute("required");
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
        emailField.classList.remove("active")
        emailField.removeAttribute("required");
        console.log(`note form hidden, noteFormShown is: ${noteFormShown}`);
    });  
    
    shareButton.addEventListener("click", function(e) {
        emailField.classList.add("active");
        emailField.setAttribute("required", "true");
    });
    
    loginButton.addEventListener("click", async function(e){
        if (!isUserLoggedIn){
            console.log(`"Login" clicked, loginFormShown is ${loginFormShown}.`);
            if (loginFormShown == "shown") {
                loginForm.classList.remove("active");
                notesList.classList.remove("disabled");
                newNote.classList.remove("disabled");
                loginFormShown = "hidden";
                console.log(`login form hidden, loginFormShown is: ${loginFormShown}`);
            } else{                         
                loginForm.classList.add("active");
                notesList.classList.add("disabled");
                newNote.classList.add("disabled");
                console.log("Displaying LoginForm");            
                loginFormShown = "shown";             
                console.log(`Login form done, loginFormShown is: ${loginFormShown}`);
            }
        }else{
            try{
                await logOut();
                renderNotes(""); 
                isUserLoggedIn = false;
                loginButton.textContent = "Log In";
                helloUsername.classList.remove("active");
                helloUsername.textContent = "";
            }catch(error){
                console.error(`Error logging out`,error);
            }
        }
       
    });
    loginCancel.addEventListener("click", function(e){
        e.preventDefault();
        console.log("login form canceled");
        loginForm.reset();        
        loginForm.classList.remove("active");    
        notesList.classList.remove("disabled");
        newNote.classList.remove("disabled");        
        loginFormShown = "hidden";
        console.log(`login form hidden, loginFormShown is: ${loginFormShown}`);
    });  
    loginForm.addEventListener("submit", async function(e){
        e.preventDefault();         

        const formElement = e.target as HTMLFormElement;
        const formData = new FormData(formElement , e.submitter);              

        formElement
            .querySelectorAll("input, button")
            .forEach((element) => (element as HTMLInputElement | HTMLTextAreaElement | HTMLButtonElement).disabled = true);
        try{
            await onLoginFormSubmit(formData);
            const user = await getLoggedUser();
            if (user){
                isUserLoggedIn = true;
            }
            if (isUserLoggedIn){
                loginButton.textContent = "Log Out";
                helloUsername.classList.add("active");
                helloUsername.textContent = `Hello, ${user?.name}`;
            }
        }catch(error){
            console.error(error);
        }       
        formElement
            .querySelectorAll("input, button")
            .forEach((element) => (element as HTMLInputElement | HTMLTextAreaElement | HTMLButtonElement).disabled = false);

        loginForm.reset();                
        loginForm.classList.remove("active");
        notesList.classList.remove("disabled");
        newNote.classList.remove("disabled");
        loginFormShown = "hidden";           
        console.log(`Login form hidden, loginFormShown is: ${loginFormShown}`);           
        renderNotes("");
    });

    registerLine.addEventListener("click", function(e){               
       
        console.log("Register clicked.");
        console.log(`registerFormShown is: ${registerFormShown}`);
        loginForm.reset();                
        loginForm.classList.remove("active");        
        loginFormShown = "hidden";           
        console.log(`Login form hidden, loginFormShown is: ${loginFormShown}`);
        registerForm.classList.add("active");
        registerFormShown = "shown";
        console.log(`Register form shown, registerFormShown is: ${registerFormShown}`);                      
    });

    registerCancel.addEventListener("click", function(e){
        console.log("Cancel register clicked.");
        console.log(`registerFormShown is: ${registerFormShown}`);
        registerForm.reset();                
        registerForm.classList.remove("active");
        notesList.classList.remove("disabled");
        newNote.classList.remove("disabled");
        registerFormShown = "hidden";
        console.log(`Register form hidden, registerFormShown is: ${registerFormShown}`);                      
    });

    registerForm.addEventListener("submit", async function (e) {
        e.preventDefault();         

        const formElement = e.target as HTMLFormElement;
        const formData = new FormData(formElement , e.submitter);              

        formElement
            .querySelectorAll("input, button")
            .forEach((element) => (element as HTMLInputElement | HTMLTextAreaElement | HTMLButtonElement).disabled = true);
        try{
            await onRegisterFormSubmit(formData);
            const user = await getLoggedUser();
            if (user){
                isUserLoggedIn = true;
            }
            if (isUserLoggedIn){
                loginButton.textContent = "Log Out";
                helloUsername.classList.add("active");
                helloUsername.textContent = `Hello, ${user?.name}`;
            }
        }catch(error){
            console.error(error);
        }       
        formElement
            .querySelectorAll("input, button")
            .forEach((element) => (element as HTMLInputElement | HTMLTextAreaElement | HTMLButtonElement).disabled = false);

        registerForm.reset();                
        registerForm.classList.remove("active");
        notesList.classList.remove("disabled");
        newNote.classList.remove("disabled");
        registerFormShown = "hidden";           
        console.log(`Register form hidden, registerFormShown is: ${registerFormShown}`);                   
        renderNotes("");
    });

    async function renderNotes(query : string) {
        
        try{
            const notes = await getNotes(query);
            console.log(notes);
            const sentNotes = await checkMessages();
            console.log(sentNotes);
            if(notes.length > 0) {
                sharedNotesList.innerHTML = sentNotes
                    .map((note) => `
                                    <li data-id="${note._id}">
                                        ${(new Date(note.createdAt).toLocaleDateString("he"))} ${note.title}
                                    </li>
                                    `)
                    .join("\n");
            }else{
                notesList.innerHTML = "<p>No notes shared with you...</p>"
            }

            if(notes.length > 0) {
                notesList.innerHTML = notes
                    .map((note) => `
                                    <li data-id="${note._id}">
                                        ${(new Date(note.createdAt).toLocaleDateString("he"))} ${note.title}
                                    </li>
                                    `)
                    .join("\n");
            }else if (query != ""){
                notesList.innerHTML = "<h3>No results for your search...</h3>"
            }else{
                notesList.innerHTML = "<h3>Add some notes...</h3>"
            }
        }catch(error){
            console.error(error);           
            if (String(error).includes("Login required")){
                notesList.innerHTML = "<h3>Please log in.</h3>"
                sharedNotesList.innerHTML = "";
            }else{
                notesList.innerHTML = "<h3>Ooops, something whent wrong... Try again.</h3>"
            }
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

