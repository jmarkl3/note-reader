import { useEffect, useRef, useState } from 'react';
import './App.css';
import Edit from './Components/Edit';
import Titles from './Components/Titles';
import { initializeApp } from 'firebase/app'
import { getDatabase, set, update, ref, push, onValue } from 'firebase/database'
import View from './Components/View';
import TopNav from './Components/TopNav/TopNav';
import {auth, dbRef} from "./Firebase.js"
import { onAuthStateChanged } from 'firebase/auth';
import AuthMenu from './Components/AuthMenu/AuthMenu';

/*

5:55 

planning
5:58 (3 minutes)

nap
6:05 (8 minutes)

create components
6:22 (17min)

import components
6:23 (1 minute)

display components based on clicks
6:31 (8 minutes)

style components
6:45 (14 minutes)

phone call
cuddled ash
found phone charge
walked maggie

7:05 (20 minutes)

save new note
7:15 (10 minutes)

load and display notes
7:22 (7 minutes)

open note when clicked
7:26 (4 minutes)

save existing note
7:27 (1 minutes)

delete a note
7:28 (1 minute)

total time:
1:30 - (25 miutes of break) = 1:05

*/

function App() {

  // Variables, Init, and Setup
  // #region
  const [page, setPage] = useState("titles")

  const [noteData, setNoteData] = useState(null)
  const [noteArray, setNoteArray] = useState([])
  const [uid, setUid] = useState(null)
  

  useEffect(() => {
    firebaseSetup()
    loadNotes()
  }, [uid])
  


  function firebaseSetup(){
    onAuthStateChanged(auth, userSnap => {
      setUid(userSnap?.uid)
    })
  }
  
  // #endregion

  // Display and Page Change
  // #region
  
  function displayPage(){
    if(page == "edit")
        return (        
          <Edit
            saveNote={saveNote}
            deleteNote={deleteNote}
            noteData={noteData}
            setPage={setPage}
          ></Edit>
        );
    if(page == "titles")
      return (        
        <Titles
          openNote={openNote}
          noteArray={noteArray}
          setPage={setPage}
          editNote={editNote}
        ></Titles>
      );
    if(page == "view")
      return (        
        <View
          setPage={setPage}
          noteData={noteData}
        ></View>
      );
  }

  function openNote(_noteData){
    
    if(!_noteData)
      return
        
    setNoteData(_noteData)

    setPage("view")

  }

  function editNote(_noteData, _event){

    _event.stopPropagation()

    if(!_noteData)
      setNoteData({
        key: null,
        title: "New Note",
        content: ""
      })
    else
      setNoteData(_noteData)

      setPage("edit")
  }
  
    // #endregion

  // Db Interaction
  // #region
  
  function loadNotes(){
    if(!uid)
      return
    onValue(ref(dbRef, "noteApp/" + uid + "/notes/"), snap => {
      var tempArray = []
      for(var index in snap.val()){
        var tempNoteData = snap.val()[index]
        
        tempArray.push({
          key: index,
          title: tempNoteData.title,
          content: tempNoteData.content,
        })
      }
      setNoteArray(tempArray)
    })
  }

  function transferNotes(){
    if(!noteArray || !Array.isArray(noteArray) || noteArray.length == 0)
      return
    console.log("transferring note array: ")
    console.log(noteArray)
    var tempDataObject = {}
    noteArray.forEach(item => {
      tempDataObject[item.key] = {
        title: item.title,
        content: item.content,
      }
    })
    console.log(tempDataObject)
    set(ref(dbRef, "noteApp/" + uid + "/notes/"), tempDataObject)
    
  }
  function saveNote(_noteData){    

    if(_noteData.key)
      updateNote(_noteData)
    else
      saveNewNote(_noteData)

  }
  function saveNewNote(_noteData){
    if(!uid)
      return

    var newRef = push(ref(dbRef, "noteApp/"+uid+"/notes/"))
    set(newRef, _noteData)

    // Put it in state in case user presses save and view
    var newNoteData = _noteData
    newNoteData.key = newRef.key
    setNoteData(newNoteData)

  }
  function updateNote(_noteData){
    if(!uid)
      return

    set(ref(dbRef, "noteApp/" + uid + "/notes/" + _noteData.key), _noteData)

    // Put it in state in case user presses save and view
    setNoteData(_noteData)

  }
  function deleteNote(_noteData){
    if(!uid)
      return

    set(ref(dbRef, "noteApp/" + uid + "/notes/" + _noteData.key), null)
    setPage("titles")
  }
  // #endregion  

  return (
    <div className="App">
      {uid ? 
        <div>
          <TopNav></TopNav>
          {displayPage()}
        </div>
        :  
        <div>
          <AuthMenu></AuthMenu>
        </div>
      }
    </div>
  );
}

export default App;
