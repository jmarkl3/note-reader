import React, { useEffect, useRef, useState } from 'react'
import "./Titles.css"
import playIcon from "../../Images/playIconS.png"
import editIcon from "../../Images/editIconS.png"
import folderIcon from "../../Images/folderIcon2.png"
import backIcon from "../../Images/backIconS.png"
import settingsIcon from "../../Images/settingsIconS.png"
import Folder from './Folder/Folder'
import { useDispatch, useSelector } from 'react-redux'
import { createNewFolder, editNote, openNote, removeItemFromFolder, setEditingFolder, setFolderToDisplayId, setItemToAdd, setNoteData, setPage, startAutoPlay } from '../../Redux/AppSlice'

function Titles() {  
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [titleMatches, setTitleMatches] = useState()
  const [contentMatches, setContentMatches] = useState()
  const searchInput = useRef()

  const folderArray = useSelector(state => state.appSlice.folderArray)
  const noteArray = useSelector(state => state.appSlice.noteArray)
  const folderToDisplayId = useSelector(state => state.appSlice.folderToDisplayId)  
  const [parsedFolderArray, setParsedFolderArray] = useState([])
  const [parsedNoteArray, setParsedNoteArray] = useState([])
  // const [folderToDisplay, setFolderToDisplay] = useState()

  const dispatcher = useDispatch()

  useEffect(()=>{
    placeNotesInFolders()
  },[folderArray, noteArray])

  function placeNotesInFolders(){
    // This array will have items removed when they are found to be contained in a folder
    let tempNotesArray = [...noteArray]
    // This will contain folders with the items attribute filled with note json objecs instead of just indicies
    let newFolderArray = []
    // Go through the folders
    folderArray.forEach(folder => {
      // This will contain the indicies of the notes that belong in this folder
      let indexArray = []
      // Go through the indicies in the folder items indicies array
      if(!folder.items)
        return
      folder.items.forEach(itemKey => {
        // Look for a note with the corresponding id
        for(var i = 0; i<tempNotesArray.length; i++){
          // If the note has the index that matches the item index take note of its index in teh tempNoteArray
          if(tempNotesArray[i].key == itemKey){
            indexArray.push(i)
          }
        }
      })
      // Sort backwards to the pop operation does not change the position of the notes that still need to be put in the folder item array
      indexArray.sort((a, b) => b - a)
      // This is the array of notes that will go into the folder
      let notesInFolderArray = []
      // Put each one into the array
      indexArray.forEach(index => {
        notesInFolderArray.push(tempNotesArray[index])
      })
      // Remove the ones that were added to the folder from the note array
      indexArray.forEach(index => {
        tempNotesArray.splice(index, 1)
      })
      // Push the folder into the new folder array with the array of note objects it contains
      newFolderArray.push({
        key: folder.key,
        name: folder.name,
        items: notesInFolderArray
      })
    })
    // Put the array of folders that contains arrays of note objects in state
    setParsedFolderArray(newFolderArray)
    // The notes that were not placed into folders go in this array
    setParsedNoteArray(tempNotesArray)
  }

  function filterNotesForSearch(){
    var searchValue = searchInput.current.value
    searchValue = searchValue.toLowerCase()

    // If there is a non empty search value search for matches
    if(!searchValue || searchValue.replace(" ","") === ""){
      setShowSearchResults(false)
      return
    }    

    var titleMatches = []
    var contentMatches = []
    noteArray.forEach(note => {
      if(note.title?.toLowerCase()?.includes(searchValue))
        titleMatches.push(note)
      if(note.content?.toLowerCase()?.includes(searchValue))
        contentMatches.push(note)
    })
    setTitleMatches(titleMatches)
    setContentMatches(contentMatches)
    setShowSearchResults(true)
  }
  function openAndPlay(noteData, event){
    dispatcher(openNote({noteData: noteData, playOnLoad: true, event: event}))
  }
  // This runs once when the note is first dragged
  function dragStart(_noteId, e){
    dispatcher(setItemToAdd(_noteId))
    
  }
  function notesFromFolder(){
    if(!folderToDisplayId)
      return parsedNoteArray
    else{
      let notesToReturn = []
      parsedFolderArray.forEach(folder => {
        if(folder.key === folderToDisplayId)
          notesToReturn = folder.items
      })
      return notesToReturn
    }
  }
  function foldersFromFolder(){    
    if(!folderToDisplayId)
      return folderArray
    else
      return []
  }
  return (
    <div className='titlesContainer'>
        <div className='searchInput'>
          <input ref={searchInput} onChange={filterNotesForSearch} placeholder="Search"></input>
        </div>
        {showSearchResults?
          <div>
            <div className='searchResults'>
              <div className='searchResultsTitle'>Title Matches</div>
              {titleMatches.map(noteData => (
              <div className='titleBox' onClick={() => openNote({noteData: noteData})}>
                <div className='titleBoxInner'>
                  {noteData.title}              
                </div>
                  <div className='editButton' onClick={(event) => dispatcher(editNote({noteData: noteData, event: event}))}>
                    Edit
                  </div>
                </div>
              ))}
            </div>
            <div className='searchResults'>
              <div className='searchResultsTitle'>Content Matches</div>
              {contentMatches.map(noteData => (
                <div className='titleBox' onClick={() =>dispatcher(openNote({noteData: noteData}))}>
                  <div className='titleBoxInner'>
                    {noteData.title}              
                  </div>
                  <div className='editButton' onClick={(event) => dispatcher(editNote({noteData: noteData, event: event}))}>
                    Edit
                  </div>
                </div>
              ))}
            </div>
          </div>
        :
        <div>
          {!folderToDisplayId ?
          <div style={{display: "inline-block"}}>
            <div className='titleBox' onClick={(event) => dispatcher(editNote({noteData: null, event: event}))}>
              <div className='titleBoxInner newNoteBox'>
                <div>
                  New Note
                </div>
              </div>
            </div>
            <div className='titleBox newFolder' onClick={(event) => dispatcher(createNewFolder())}>
                <div className='newFolderInner'>
                  New Folder
                </div>
                <img src={folderIcon}></img>            
            </div>
          </div>
          :
          <div className='tileButtons'>
            <div onClick={()=>dispatcher(setFolderToDisplayId(null))} className='titleBox backBox'>
              <img src={backIcon}></img>
              <div className='tileButtonText'>Back</div>
            </div>
            <div onClick={()=>dispatcher(startAutoPlay())} className='titleBox backBox'>
              <div className='playAllButtonContainer'>
                <img src={playIcon} className="playAllButton"></img>
              </div>
              <div className='tileButtonText'>Play All</div>
            </div>
          </div>
          }
          {foldersFromFolder().map(folderData => (
            <Folder folderData={folderData}></Folder>
          ))}
          {notesFromFolder().map(noteData => (
            <div className='titleBox' onClick={() => dispatcher(editNote({noteData  : noteData}))} draggable={true} key={noteData.key} id={"note_" + noteData.key} onDragStart={e=>dragStart(noteData.key, e)}>
              <div className='titleBoxInner'>
                {noteData.title}              
              </div>
              <div className='titleButtonContainer'>
                <div className='titleButton'>
                  <img src={settingsIcon}></img>
                  <div className='titleSettings'>
                    {/* <div className='titleSettingsButton'>Rename</div>
                    <div className='titleSettingsButton'>Delete</div>
                    <div className='titleSettingsButton' onClick={(e)=>{dispatcher(openNote({noteData: noteData, event: e}))}}>view Lines</div> */}
                    <div className='titleSettingsButton' onClick={(e)=>dispatcher(removeItemFromFolder({itemKey: noteData.key, folderKey: folderToDisplayId, event: e}))}>Move out of Folder</div>
                  </div>
                </div>
                <div className='titleButton' onClick={(e)=>{dispatcher(openNote({noteData: noteData, event: e, playOnLoad: true}))}}>
                <img src={playIcon}></img>
                </div>
              </div>
            </div>
          ))}
        </div>
        }
    </div>
  )
}

Titles.defaultProps = {
    noteArray: [],
    openNote: (_input) => {console.log("opening note"); console.log(_input);}
}

export default Titles