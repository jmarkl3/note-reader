import { createSlice } from "@reduxjs/toolkit";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, push, ref, set, update } from "firebase/database";

// import { store } from "./Store";

export const appSlice = createSlice({
    name: "appSlice",
    initialState: {
        noteArray: [],
        folderArray: [],
        editingFolderId: null,
        folderToDisplayId: null,
        noteData: null,
        page: "titles", 
        playOnLoad: false,
        uid: null,
        dbRef: null,
        app: null,
        auth: null,
        itemToAdd: null,
    }, 
    reducers: {
        setNoteArray: (state, action)=>{
            state.noteArray = action.payload
        },
        setNoteData: (state, action)=>{
            console.log("==================================================")
            console.log("setting note data for note: "+action.payload.title)
            console.log(action.payload.content)
            console.log(action.payload.key)
            state.noteData = action.payload
            console.log(state.noteData.title)
            // state.playOnLoad = !state.playOnLoad
        },
        setFolderArray: (state, action)=>{
            state.folderArray = action.payload
        }, 
        setEditingFolder: (state, action)=>{            
            state.editingFolderId = action.payload
        },
        setPage: (state, action) => {
            state.page = action.payload
        },
        openNote: (state, action) => { 
            console.log("opening note")
            if(action.payload?.event)
            action.payload?.event.stopPropagation()
            if(action.payload.event)    
                action.payload.event.stopPropagation()       
            state.playOnLoad = action.payload.playOnLoad
            state.noteData = action.payload.noteData
            state.page = "view"
            // console.log("store.dbSlice.uid")
            // console.log( store.dbSlice.uid)
        },
        editNote: (state, action) => {
            if(action.payload.event)    
                action.payload.event.stopPropagation() 
            
            if(action.payload.noteData){
                state.noteData = action.payload.noteData
            }else{
                state.noteData = {
                    title: "New Note",
                    content: ""
                }
            }

            state.page = "edit"

        },
        initializeAppSlice: (state, action) => {
            
            var firebaseConfig = {
                apiKey: "AIzaSyDCrQSCE91lh7GYlr7eTFbX--e1NnvF7Uw",
                authDomain: "practice-79227.firebaseapp.com",
                databaseURL: "https://practice-79227-default-rtdb.firebaseio.com",
                projectId: "practice-79227",
                  storageBucket: "practice-79227.appspot.com",
                  messagingSenderId: "283438782315",
                  appId: "1:283438782315:web:d913f1ed9d87b5401a1e2e"     
            }
            const app = initializeApp(firebaseConfig)
            state.app = app
            state.dbRef = getDatabase(app)            
            state.auth = getAuth(app)
        },
        updateUid: (state, action)=>{
            console.log("updating uid to "+action.payload)
            state.uid = action.payload
        },
        updateDbRef: (state, action)=>{
            state.dbRef = action.payload
        },
        updateNote: (state, action) => {
            console.log("in update note")
            if(!state.uid || !action.payload.key)
                return

            set(ref(state.dbRef, "noteApp/" + state.uid + "/notes/" + action.payload.key), action.payload)

            state.noteData = action.payload
        },
        saveNewNote: (state, action) => {
            console.log("in save new note")
            console.log("state.uid: ")
            console.log(state.uid)
            if(!state.uid)
                return
            console.log("creating a new note")
            console.log(action.payload)
            console.log(action)
            var newRef = push(ref(state.dbRef, "noteApp/" + state.uid + "/notes/"))
            let newNotData = {title: action.payload.title, content: action.payload.content}
            set(newRef, newNotData)
            
            state.noteData = action.payload
        },
        saveNote: (state, action) => {
            appSlice.caseReducers.test(state, action)
            console.log("in save note")
            console.log("action.payload")
            console.log(action.payload)
            const newNote = action.payload
            if(action.payload.key){
                console.log("calling update note")
                appSlice.caseReducers.updateNote(state, {payload: newNote})
            }
            else{
                console.log("calling save new note")
                appSlice.caseReducers.saveNewNote(state, {payload: newNote})
            }
        }, 
        test: (state, action)=>{
            console.log("test")
            console.log("state.uid: ")
            console.log(state.uid)
        },
        deleteNote: (state, action) => {
            if(!state.uid || !action.payload)
                return

            set(ref(state.dbRef, "noteApp/" + state.uid + "/notes/" + action.payload), null)
            state.page = "titles"
        },
        createNewFolder: (state, action) => {
            if(!state.uid)
                return
      
            let newRef = push(ref(state.dbRef, "noteApp/" + state.uid + "/folders/"))
            set(newRef, {name: "", items: []})
            
            // When there is an id in here that folder will show edit name input field
            state.editingFolderId = newRef.key            

        },        
        updateFolderName: (state, action) => {
            if(!state.uid || !state.editingFolderId)
                return        

            if(action.payload?.event)
                action.payload.event.stopPropagation()

            let inputElement = document.getElementById(state.editingFolderId+"nameInput")
            let newName = "New Folder"            
            if(inputElement)
                newName = inputElement.value
            if(!newName || newName === "")        
                newName = "New Folder"            
            
            update(ref(state.dbRef, "noteApp/" + state.uid + "/folders/" + state.editingFolderId), {name: newName})
            state.editingFolderId = null

        },
        deleteFolder: (state, action) => {
            if(!state.uid)
                return

            set(ref(state.dbRef, "noteApp/" + state.uid + "/folders/" + action.payload), null)

        },
        setItemToAdd: (state, action) => {
            state.itemToAdd = action.payload
        },
        addItemToFolder: (state, action) => {
            // action.payload is the folder key. state.itemToAdd was set when the note was dragged and will be put in the items array if its not already there
            if(!action.payload || !state.itemToAdd)
                return
            // Get the items already in the folders item array
            let tempArray = []
            state.folderArray.forEach(folder => {
                if(folder.key == action.payload)
                    if(folder.items)
                        tempArray = folder.items
            })

             // Add the new id to the array (if its not already in there)
            if(!tempArray.includes(state.itemToAdd)){
                tempArray.push(state.itemToAdd)
                tempArray.forEach(key => {
                    console.log(key)
                })
                // Update the array in the db
                update(ref(state.dbRef, "noteApp/" + state.uid + "/folders/" + action.payload), {items: tempArray})
            }
            else{
                // This should never happen but just in case it will log it
                console.log(state.itemToAdd + " is already in the folder")
            }               
        },
        removeItemFromFolder: (state, action) => {
            
            if(action.payload?.event)
                action.payload.event.stopPropagation()

            // This takes in action: {itemnKey: itemnKey, folderKey: folderKey}            
            if(!action.payload || !action.payload.folderKey || !action.payload.itemKey)
                return
            

            let tempItemArray = []
            // Go to the folder the user is currently in
            state.folderArray.forEach(folder => {
                if(folder.key === action.payload.folderKey){
                    console.log("found folder: " + folder.name+" "+folder.key)
                    // Look through the items in that folder
                    for(var i=0; i<folder.items.length; i++){
                        // If the item id is found remove it from the folder it was found in
                        if(action.payload.itemKey === folder.items[i]){
                            tempItemArray = [...folder.items]
                            tempItemArray.splice(i, 1)
                            console.log( action.payload.itemKey +" was found in "+folder.name)
                            console.log("New folder item array:")
                            console.log(tempItemArray)
                            update(ref(state.dbRef, "noteApp/" + state.uid + "/folders/" + folder.key), {items: tempItemArray})
                        }
                    }
                }
            })               
        },
        clearFolder: (state, action) => {
            update(ref(state.dbRef, "noteApp/" + state.uid + "/folders/" + action.payload), {items: []})            
        },
        // When the user is in a folder this will load the next note in that folder
        loadNextNote: (state, action) => {
            // Find the folder
            let folderOfInterest = state.folderArray.find(folder => folder.key === state.folderToDisplayId)
            let currentIndex = folderOfInterest.items.findIndex(itemId => itemId === state.noteData.key)
            if(currentIndex < folderOfInterest.items.length - 1)
                currentIndex+=1
            else
                currentIndex=0
            const idOfInterest = folderOfInterest.items[currentIndex]
            const foundNote = state.noteArray.find(note => note.key === idOfInterest)
            appSlice.caseReducers.setNoteData(state, {payload: foundNote})   
        },
        setFolderToDisplayId: (state, action) => {
            state.folderToDisplayId = action.payload
        }
    },
})

export const {setEditingFolder,setFolderArray, setNoteArray, setNoteData, setPage, openNote, editNote, initializeAppSlice, updateUid, updateDbRef, saveNote, updateNote, saveNewNote, deleteNote, createNewFolder, updateFolderName, deleteFolder, setItemToAdd, addItemToFolder, clearFolder, removeItemFromFolder, loadNextNote, setFolderToDisplayId} = appSlice.actions
export default appSlice.reducer