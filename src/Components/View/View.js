import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {nouns} from "../../Nouns.js"
import { setPage } from '../../Redux/AppSlice.js'
import "./View.css"

function View(props) {
  
    const [noteArray, setNoteArray] = useState([])
    
    const noteArrayRef = useRef([])
    const lineRef = useRef(0)
    const [lineState, setLineState] = useState(0)
    const [showVideo, setShowVideo] = useState(false)
    const [timeBetweenLines, setTimeBetweenLines] = useState(4000)
    const noteData = useSelector(state => state.appSlice.noteData)
    
    const timeoutRef = useRef()
    const justPaused = useRef()
    const customTime = useRef()
    const wordArray = useRef([])
    const numberArray = useRef([])
    const nounsArray = useRef([])
    
    const dispatcher = useDispatch()

    // git commit -a -m "updated package.json for correct homepage, updated word array functionality"

    const playOnLoad = useSelector(state => state.appSlice.playOnLoad)

    useEffect(()=>{
        
        if(!noteData)
            return
        // Create and set the array of lines to be read based on the note content
        noteArrayRef.current = noteData.content.split("\n")
        setNoteArray(noteArrayRef.current)                 
        // Make an array of nouns for random word generation
        nounsArray.current = nouns.split("\n")

        // window.speechSynthesis.addEventListener("onend",(event)=>{
        //     console.log(event)
        // })

        lineRef.current = 0
        if(playOnLoad)
            readNextLine()                        

    },[playOnLoad, noteData])
        
    function parseLine(_line){
        
        // # denotes a comment, at the beginning means the whole line is a comment
        if(!_line || _line[0] === "#")
            return " "

        var tempLine = _line
        // Inline comments
        if(tempLine.includes("#")){
            tempLine = tempLine.subString(0, tempLine.indexOf("#")) 
        }
        if(tempLine.includes("//")){
            tempLine = tempLine.subString(0, tempLine.indexOf("//")) 
        }
        while(tempLine.includes("=>")){        
            // console.log("templine includes word")    
            tempLine = tempLine.replace("=>", " arrow ")            
            c++
        }
        while(tempLine.includes("{")){        
            // console.log("templine includes word")    
            tempLine = tempLine.replace("{", " curley ")            
            c++
        }
        while(tempLine.includes("(")){        
            // console.log("templine includes word")    
            tempLine = tempLine.replace("(", " round ")            
            c++
        }   
        while(tempLine.includes("[")){        
            // console.log("templine includes word")    
            tempLine = tempLine.replace("[", " square ")            
            c++
        }                
        while(tempLine.includes(",")){        
            // console.log("templine includes word")    
            tempLine = tempLine.replace(",", " comma ")            
            c++
        }        
        while(tempLine.includes("'")){        
            // console.log("templine includes word")    
            tempLine = tempLine.replace("'", " quote ")            
            c++
        }
        while(tempLine.includes('"')){        
            // console.log("templine includes word")    
            tempLine = tempLine.replace('"', " quote ")            
            c++
        }        
        while(tempLine.includes('.')){        
            // console.log("templine includes word")    
            tempLine = tempLine.replace('.', " dot ")            
            c++
        }  
        while(tempLine.includes('_')){        
            // console.log("templine includes word")    
            tempLine = tempLine.replace('_', " ")            
            c++
        }  
        while(tempLine.includes('/')){        
            // console.log("templine includes word")    
            tempLine = tempLine.replace('/', " slash ")            
            c++
        } 
        while(tempLine.includes('numpy')){        
            // console.log("templine includes word")    
            tempLine = tempLine.replace('numpy', " num pie ")            
            c++
        }
        while(tempLine.includes(',')){        
            // console.log("templine includes word")    
            tempLine = tempLine.replace(',', " comma ")            
            c++
        }
        while(tempLine.includes('utils')){        
            // console.log("templine includes word")    
            tempLine = tempLine.replace('utils', " utills ")            
            c++
        }
        while(tempLine.includes('epochs')){        
            // console.log("templine includes word")    
            tempLine = tempLine.replace('epochs', " epocks ")            
            c++
        }

        // Add up to 100 random words to a line
        while(tempLine.includes("<word>")){        
            // console.log("templine includes word")    
            tempLine = tempLine.replace("<word>", randomWord())            
        }
        // Add up to 100 random numbers to a line
        while(tempLine.includes("<number>")){            
            tempLine = tempLine.replace("<number>", randomNumber())                
        }
               
        // Read words from the array of chosen words if the line calls for it
        if(Array.isArray(wordArray.current)){
            // Support reading up to 100 words back
            for(var c = 0; c < 100; c++){
                if(wordArray.current.length > (c)){                    
                    tempLine = tempLine.replace("<word-" + (c+1) + ">", wordArray.current[c])    
                }
            }        
        }

        // Read numbers from the array of chosen numbers if the line calls for it
        if(Array.isArray(numberArray.current)){
            // Support reading up to 100 words back
            for(var c = 0; c < 100; c++){
                if(numberArray.current.length > (c)){                    
                    tempLine = tempLine.replace("<word-" + (c+1) + ">", numberArray.current[c])    
                }
            }        
        }        



        // Custom time tag. For some reason it affects the time after the line after this one
        if (tempLine.includes("<t:")){
            var timeSubstring = ""
            var customTimeParsed = timeBetweenLines
            // Get the substring after the <t: tag beginning
            var beginingIndex = tempLine.indexOf("<t:") + 3
            timeSubstring = tempLine.substring(beginingIndex, tempLine.length)
            // Get the portion of the tag that has the number in it
            timeSubstring = timeSubstring.substring(0, timeSubstring.indexOf(">"))
            // Try to parse the number string into a integer that will represent miliseconds
            try{customTimeParsed = Number.parseInt(timeSubstring)}catch{}
            // Put it into a ref to be used by the speaking function
            customTime.current = customTimeParsed
            // Remove the time specification text
            tempLine = tempLine.substring(0, beginingIndex - 3)
        }
        // If there is no time tag set the ref to null so the default pause time is used
        else{
            customTime.current = null
        }

        return tempLine
    }
    function randomWord(){

        // Generate a new word
        const wordIndex = Math.floor(Math.random() * nounsArray.current.length)

        // 100 is the number of words in the array newWord = wordArray[wordIndex]
        //const newWord = "duck"
        const newWord = nounsArray.current[wordIndex]

        // Put it a array so it can be accessed later        
        wordArray.current = [newWord, ...wordArray.current]        

        // Return it to be used
        return newWord
    }
    function randomNumber(){
        // Generate a new random number between 1 and 100
        const newNumber = Math.floor((Math.random() * 100) + 1)

        // Put it a array so it can be accessed later               
        numberArray.current = [newNumber, ...numberArray.current]

        // Return it to be used
        return newNumber
    }
    function randomNumber10(){
        // Generate a new random number between 1 and 10
        const newNumber = Math.floor((Math.random() * 10) + 1)

        // Put it a register array so it can be accessed later
        numberArray.current.push(newNumber)

        // Return it to be used
        return newNumber
    }
    function readNextLine(){

        // If there is no note array return
        if(!Array.isArray(noteArrayRef.current) || noteArrayRef.current.length == 0)
            return

        // If the note was paused this will resume it
        if(justPaused.current){
        
            // Unpauses the paused speech synthesis
            window.speechSynthesis.resume()  
            
            // Set flat so this only happens once per resume
            justPaused.current = false              

        }
        else{

            // Parse the line for diferences in written and spoken content
            var parsedLine = parseLine(noteArrayRef.current[lineRef.current])
            console.log("reading line " +lineRef.current+": "+ parsedLine)

            // If there is a custom pause time
            var pauseTime = timeBetweenLines
            if(customTime.current)
                pauseTime = customTime.current

            // Speak the current line after a pause
            speak(parsedLine).then(()=>{
                setTimeout(() => {
                    readNextLine()
                }, pauseTime); 
            })
    
            console.log("increacing counter ")
            // Increace the counter
            lineRef.current = lineRef.current + 1
            setLineState(lineRef.current - 1)
            if(lineRef.current >= noteArrayRef.current.length)
                lineRef.current = 0

            console.log("counter: "+lineRef.current)
        }

    }    

    async function speak(_toSpeak){
        
        // Create an utterance with the desired text
        const newUtternace = new window.SpeechSynthesisUtterance()
        //newUtternace.onend = endOfSpeechSynthesisUtteranc()
        newUtternace.text = _toSpeak        
        
        // If theres already something giong on cancel it
        window.speechSynthesis.cancel()        

        // Speak the utterance
        window.speechSynthesis.speak(newUtternace)    

        return new Promise(resolve => {
            newUtternace.onend = resolve;
          });    
    }    

    function pause(){

        // Pause the next timeout loop
        clearTimeout(timeoutRef.current)        

        // Pause the speech (with a slight delay)
        window.speechSynthesis.pause()

        // Flag so pressing start will just resume
        justPaused.current = true

    }

    function restart(){
        
        // Put the counter to the start
        lineRef.current = 0
        setLineState(0)

        // Pause what is currently being spoken
        pause()

        // Start reading from the start
        //readNextLine() user can press start again if they want it to start

    }

    function setPosition(_newPosition){
        
        // Set the position variables to the new position
        lineRef.current = _newPosition
        setLineState(_newPosition)
        
        // Cancel any lingering text
        window.speechSynthesis.cancel()
        
    }
    function back(){
        pause()
        dispatcher(setPage("titles"))        
    }
    function edit(){
        pause()
        dispatcher(setPage("edit"))        
    }
    function toggleVideo(){
        setShowVideo(!showVideo)
    }
    return (
        <div>
            <div className='noteViewTitle'>                
                {noteData.title}
            </div>
            <div className='buttonContainer'>
                <div onClick={back}>Back</div>
                <div onClick={toggleVideo}>Video</div>
                <div onClick={edit}>Edit</div>
                <div onClick={pause}>Pause</div>
                <div onClick={readNextLine}>Start</div>
            </div>
            <div className='noteLineContainer'>
                {showVideo && 
                    <div>
                        <iframe 
                            width="100%" 
                            height="400px" 
                            src="https://www.youtube.com/embed/wELOA2U7FPQ" 
                            title="YouTube video player" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                            allowfullscreen
                        >
                        </iframe>
                    </div>
                }
                {
                    noteArray.map((noteLine, index) => (
                        <div className={'noteLine ' + (index == lineState ? "selectedLine" : "")} onClick={() => setPosition(index)}>
                            {noteLine}
                        </div>
                    ))
                }
                
            </div>
        </div>
    )
}

export default View