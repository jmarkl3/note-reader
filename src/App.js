import { useEffect, useRef, useState } from 'react';
import './App.css';
import Edit from './Components/Edit/Edit';
import Titles from './Components/Titles/Titles';
import { initializeApp } from 'firebase/app'
import { getDatabase, set, update, ref, push, onValue } from 'firebase/database'
import View from './Components/View/View';
import TopNav from './Components/TopNav/TopNav';
import { onAuthStateChanged } from 'firebase/auth';
import AuthMenu from './Components/AuthMenu/AuthMenu';
import { useDispatch, useSelector } from 'react-redux';
import { setFolderArray, setNoteArray, setNoteData, setPage, initializeAppSlice, updateUid, updateFolderName } from './Redux/AppSlice';
import { cosineWindow } from '@tensorflow/tfjs';

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
  // const [page, setPage] = useState("titles")
  // const [noteData, setNoteData] = useState(null)  
  const [folderArray, setFolderArrayState] = useState([])
  const [editingFolder, setEditingFolder] = useState()

  const dispatcher = useDispatch()
  const noteData = useSelector(state => state.appSlice.noteData)
  const page = useSelector(state => state.appSlice.page)
  const auth = useSelector(state => state.appSlice.auth)
  const dbRef = useSelector(state => state.appSlice.dbRef)
  const uid = useSelector(state => state.appSlice.uid)
  
  // This runs on start and initializes the firebase setup in appSlice
  useEffect(()=>{
    dispatcher(initializeAppSlice())  
    keyPressEventSetup()
  },[])

  // Rhis will run when the firebase setup action gets an auth object
  useEffect(() => {      
    if(!auth)
      return
    authListenerSetup()

  }, [auth])

  // This will run when/if the auth listener gets a user id
  useEffect(()=>{
    if(!uid)
      return
    loadNotes()
    loadFolders()

  },[uid])

  function keyPressEventSetup(){
    window.addEventListener("keydown", e => {
      if(e.key == "Enter")
        dispatcher(updateFolderName())
    })
  }

  function authListenerSetup(){
    onAuthStateChanged(auth, userSnap => {
      dispatcher(updateUid(userSnap?.uid))
    })

  }
  
  // #endregion

  // Display and Page Change
  // #region
  
  function displayPage(){
    if(page == "edit")
        return (        
          <Edit></Edit>
        );
    if(page == "titles")
      return (        
        <Titles></Titles>
      );
    if(page == "view")
      return (        
        <View></View>
      );
  }

  // function playNote(_noteData, event){
  //   event.stopPropagation()
  //   openNote(_noteData, true)
  // }
  // function openNote(_noteData, _playOnOpen){

  //   if(!_noteData)
  //     return
        
  //   // playOnOpen.current = _playOnOpen
    
  //   dispatcher(setNoteData(_noteData))
  //   dispatcher(setPage("view"))
    
  // }

  // function editNote(_noteData, _event){

  //   _event.stopPropagation()

  //   if(!_noteData)
  //     dispatcher(setNoteData({
  //       key: null,
  //       title: "New Note",
  //       content: ""
  //     }))
  //   else
  //     dispatcher(setNoteData(_noteData))
  //     dispatcher(setPage("edit"))
  // }
  
    // #endregion

  // Db Interaction
  // #region
  
  function loadNotes(){
    if(!uid)
      return
    onValue(ref(dbRef, "noteApp/" + uid + "/notes/"), snap => {
      var tempArray = []
      snap.forEach(snapChild => {
        tempArray.push({
          key: snapChild.key,
          title: snapChild.val().title,
          content: snapChild.val().content,
        })
      })      
      setTimeout(() => {
        dispatcher(setNoteArray(tempArray))        
      }, (100));
    })
  }
  function loadUserSettings(){
    if(!uid)
      return
    onValue(ref(dbRef, "noteApp/" + uid + "/userSettings/"), snap => {
      
       //"noteApp/<uid>/userSettings/wordPairs/"
       // {key: {from: "(", to: " round "}, ...}

      var wordPairs = snap.child("wordPairs").val()
      // [{from:"(", to: " round "}, ...]
      var wordPairArray = []
      wordPairs.forEach(wordPair => {
        wordPairArray.push(wordPair)
      })
      // dispatcher(setWordPairs(wordPairArray))

      var name = snap.child("name").val()

      var theme = snap.child("theme").val()

    })
  }

  // function transferNotes(){
  //   // if(!noteArray || !Array.isArray(noteArray) || noteArray.length == 0)
  //   //   return
  //   // console.log("transferring note array: ")
  //   // console.log(noteArray)
  //   // var tempDataObject = {}
  //   // noteArray.forEach(item => {
  //   //   tempDataObject[item.key] = {
  //   //     title: item.title,
  //   //     content: item.content,
  //   //   }
  //   // })
  //   // console.log(tempDataObject)
  //   // set(ref(dbRef, "noteApp/" + uid + "/notes/"), tempDataObject)
    
  // }
  // function saveNote(_noteData){    

  //   if(_noteData.key)
  //     updateNote(_noteData)
  //   else
  //     saveNewNote(_noteData)

  // }
  // function saveNewNote(_noteData){
  //   if(!uid)
  //     return

  //   var newRef = push(ref(dbRef, "noteApp/"+uid+"/notes/"))
  //   set(newRef, _noteData)

  //   // Put it in state in case user presses save and view
  //   var newNoteData = _noteData
  //   newNoteData.key = newRef.key
  //   dispatcher(setNoteData(newNoteData))    

  // }
  // function updateNote(_noteData){
  //   if(!uid)
  //     return

  //   set(ref(dbRef, "noteApp/" + uid + "/notes/" + _noteData.key), _noteData)

  //   // Put it in state in case user presses save and view
  //   dispatcher(setNoteData(_noteData))
    

  // }
  // function deleteNote(_noteData){
  //   if(!uid)
  //     return

  //   set(ref(dbRef, "noteApp/" + uid + "/notes/" + _noteData.key), null)
  //   dispatcher(setPage("titles"))
  // }

  // Folders
  function loadFolders(){
    if(!uid)
      return
    onValue(ref(dbRef, "noteApp/" + uid + "/folders/"), snap => {
      var tempArray = []
      snap.forEach(snapChild => {
        let folderValues = snapChild.val()
        tempArray.push({
          key: snapChild.key,
          name: folderValues.name,
          items: folderValues.items,
        })
      })      
      console.log("Folder Array")
      console.log(tempArray)
      setTimeout(()=>{
        dispatcher(setFolderArray(tempArray))
      }, 100)
    })
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
