import React, { useEffect, useRef, useState } from 'react'
import {nouns} from "../Nouns.js"

function View(props) {
  
    const [noteArray, setNoteArray] = useState([])
    
    const lineRef = useRef(0)
    const [lineState, setLineState] = useState(0)
    const [showVideo, setShowVideo] = useState(false)
    const timeoutRef = useRef()
    const justPaused = useRef()
    const wordArray = useRef([])
    const numberArray = useRef([])
    const nounsArray = useRef([])

    // git commit -a -m "updated package.json for correct homepage, updated word array functionality"

    useEffect(()=>{
        
        // Create and set the array of lines to be read based on the note content
        setNoteArray(props.noteData.content.split("\n"))                 
        
        // Make an array of nouns for random word generation
        nounsArray.current = nouns.split("\n")

        // window.speechSynthesis.addEventListener("onend",(event)=>{
        //     console.log(event)
        // })

    },[])
        
    function parseLine(_line){
        // # denotes a comment
        if(!_line || _line[0] === "#")
            return " "

        var tempLine = _line

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

        // Add up to 100 random words to a line
        var c = 0
        while(tempLine.includes("<word>") && (c < 100)){        
            // console.log("templine includes word")    
            tempLine = tempLine.replace("<word>", randomWord())            
            c++
        }
        // Add up to 100 random numbers to a line
        c = 0
        while(tempLine.includes("<number>") && (c < 100)){            
                tempLine = tempLine.replace("<number>", randomNumber())                
            c++
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
        console.log("reading line")
        // If there is no note array return
        if(!Array.isArray(noteArray) || noteArray.length == 0)
            return

        // If the note was paused this will resume it
        if(justPaused.current){
        
            // Unpauses the paused speech synthesis
            window.speechSynthesis.resume()  
            
            // Set flat so this only happens once per resume
            justPaused.current = false              

        }
        else{

            // Speak the current line after a pause
            speak(parseLine(noteArray[lineRef.current])).then(()=>{
                setTimeout(() => {
                    readNextLine()
                }, 2000); 
            })
    
            // Increace the counter
            lineRef.current = lineRef.current + 1
            setLineState(lineRef.current - 1)
            if(lineRef.current >= noteArray.length)
                lineRef.current = 0

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
        props.setPage("titles")
    }
    function edit(){
        pause()
        props.setPage("edit")
    }
    function toggleVideo(){
        setShowVideo(!showVideo)
    }

    return (
        <div>
            <div className='noteViewTitle'>                
                {props.noteData.title}
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