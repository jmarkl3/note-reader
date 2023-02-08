import React, { useState } from 'react'
import { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteNote, openNote, saveNote, setNoteData, setPage } from '../../Redux/AppSlice'
import "./Edit.css"

function Edit(props) {

    var titleInput = useRef()
    var contentInput = useRef()
    const [showConfirmWindow, setShowConfirmWindow] = useState(false)
    const noteData = useSelector(state => state.appSlice.noteData)
    const dispatcher = useDispatch()

    function saveAndClose(){
        console.log("in save an close function")
        // save and close
        dispatcher(saveNote({
            key: noteData.key,
            title: titleInput.current.value,
            content: contentInput.current.value,
        }))
        dispatcher(setPage("titles"))        
    }
    function saveAndView(){

        // save and close
        dispatcher(saveNote({
            key: noteData.key,
            title: titleInput.current.value,
            content: contentInput.current.value,
        }))
        dispatcher(setPage("view"))   
    }
    function revert(){
        
        titleInput.value = noteData.title
        contentInput.value = noteData.content

    }
    function askBeforeDelete(){
        setShowConfirmWindow(true)
    }

  return (
    <div className='edit'>        
        <input defaultValue={noteData.title} ref={titleInput}></input>
        <div className='buttonContainer'>
            <div onClick={()=>askBeforeDelete()} >Delete</div>
            <div onClick={revert}>Revert</div>
            <div onClick={() => dispatcher(setPage("titles"))}>Cancel</div>
            <div onClick={saveAndView}>Save/View</div>
            <div onClick={saveAndClose}>Save/Close</div>
        </div>
        <textarea defaultValue={noteData.content} ref={contentInput}></textarea>
        {showConfirmWindow && 
            <div className='confirmWindow'>
                <div className='confirmWindowTitle'>
                    Perminataly delete {noteData.title}?
                </div>
                <button onClick={() => dispatcher(deleteNote(noteData.key))} className={"confirmButton"}>Delete</button>
                <button onClick={()=>setShowConfirmWindow(false)} className="confirmButton">Cancle</button>

            </div>
        }
    </div>
  )
}

Edit.defaultProps = {
    noteData: {
        key: null,
        title: "Default Title",
        content: "Default Content",
    },
    delete: (_input) => {console.log("delete function"); console.log(_input);},     
    save: (_input) => {console.log("save function"); console.log(_input);},
    setPage: (_input) => {console.log("set page"); console.log(_input);},
}

export default Edit