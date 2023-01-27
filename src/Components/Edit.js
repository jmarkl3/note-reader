import React, { useState } from 'react'
import { useRef } from 'react'

function Edit(props) {

    var titleInput = useRef()
    var contentInput = useRef()
    const [showConfirmWindow, setShowConfirmWindow] = useState(false)

    function saveAndClose(){

        // save and close
        props.saveNote({
            key: props.noteData.key,
            title: titleInput.current.value,
            content: contentInput.current.value,
        })
        props.setPage("titles")

    }
    function saveAndView(){

        // save and close
        props.saveNote({
            key: props.noteData.key,
            title: titleInput.current.value,
            content: contentInput.current.value,
        })
        props.setPage("view")

    }
    function revert(){
        
        titleInput.value = props.noteData.title
        contentInput.value = props.noteData.content

    }
    function askBeforeDelete(){
        setShowConfirmWindow(true)
    }

  return (
    <div className='edit'>        
        <input defaultValue={props.noteData.title} ref={titleInput}></input>
        <div className='buttonContainer'>
            <div onClick={()=>askBeforeDelete()} >Delete</div>
            <div onClick={revert}>Revert</div>
            <div onClick={() => props.setPage("titles")}>Cancel</div>
            <div onClick={saveAndView}>Save/View</div>
            <div onClick={saveAndClose}>Save/Close</div>
        </div>
        <textarea defaultValue={props.noteData.content} ref={contentInput}></textarea>
        {showConfirmWindow && 
            <div className='confirmWindow'>
                <div className='confirmWindowTitle'>
                    Perminataly delete {props.noteData.title}?
                </div>
                <button onClick={() => props.deleteNote(props.noteData)} className={"confirmButton"}>Delete</button>
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