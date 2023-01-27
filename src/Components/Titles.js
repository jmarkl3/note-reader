import React, { useRef, useState } from 'react'
import cubeField from '../Images/cubeField.gif'   

function Titles(props) {  
  const [filteredNoteArray, setFilteredNoteArray] = useState()
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [titleMatches, setTitleMatches] = useState()
  const [contentMatches, setContentMatches] = useState()
  const searchInput = useRef()

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
    props.noteArray.forEach(note => {
      if(note.title?.toLowerCase()?.includes(searchValue))
        titleMatches.push(note)
      if(note.content?.toLowerCase()?.includes(searchValue))
        contentMatches.push(note)
    })
    setTitleMatches(titleMatches)
    setContentMatches(contentMatches)
    setShowSearchResults(true)
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
              <div className='titleBox' onClick={() => props.openNote(noteData)}>
                <div className='titleBoxInner'>
                  {noteData.title}              
                </div>
                  <div className='editButton' onClick={(event) => props.editNote(noteData, event)}>
                    Edit
                  </div>
                </div>
              ))}
            </div>
            <div className='searchResults'>
              <div className='searchResultsTitle'>Content Matches</div>
              {contentMatches.map(noteData => (
              <div className='titleBox' onClick={() => props.openNote(noteData)}>
                <div className='titleBoxInner'>
                  {noteData.title}              
                </div>
                  <div className='editButton' onClick={(event) => props.editNote(noteData, event)}>
                    Edit
                  </div>
                </div>
              ))}
            </div>
          </div>
        :
        <div>
          <div className='titleBox' onClick={(event) => props.editNote(null, event)}>
            <div className='titleBoxInner newNoteBox'>
              <div>
                New Note
              </div>
            </div>
          </div>
          {props.noteArray.map(noteData => (
          <div className='titleBox' onClick={() => props.openNote(noteData)}>
            <div className='titleBoxInner'>
              {noteData.title}              
            </div>
              <div className='editButton' onClick={(event) => props.editNote(noteData, event)}>
                Edit
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