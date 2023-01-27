import React, { useRef, useState } from 'react'
import "./AuthMenu.css"

import {auth} from "../../Firebase.js"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { refFromURL } from 'firebase/database'

function AuthMenu() {
  
    const [createAccount, setCreateAccount] = useState(false)
    const [authMessage, setAuthMessage] = useState(false)
    const emailInput = useRef()
    const passInput = useRef()
    const passInput2 = useRef()        

    function createUser(){
        
        if(!emailInput.current || !passInput.current || !passInput2.current)
            return

        // Get input values
        const email = emailInput.current.value
        const password = passInput.current.value
        const password2 = passInput2.current.value
        
        // Make sure the password confirmatino matches
        if(password !== password2){
            setAuthMessage("Passwords do not match")
            return
        }
        
        // Create the user
        createUserWithEmailAndPassword(auth, email, password).then(msg => {
            setAuthMessage(msg.message)
        }).catch(err => {
            setAuthMessage(err.message)
        })
    }
    function signIn(){
        
        // Get input values
        if(!emailInput.current || !passInput.current)
            return

        const email = emailInput.current.value
        const password = passInput.current.value
        
        // Create the user
        signInWithEmailAndPassword(auth, email, password).then(msg => {
            setAuthMessage(msg.message)
        }).catch(err => {
            setAuthMessage(err.message)
        })
    }
    function convertErrorMessage(_msg){
        if(_msg === "Firebase: Error (auth/invalid-email).")
            return "Plase Check Email"
        else if (_msg === "Firebase: Error (auth/internal-error).")
            return "Please Check Password"
        else if (_msg === "Firebase: Error (auth/wrong-password).")
            return "Please Check Password"
        else if(_msg === "Firebase: Error (auth/email-already-in-use).")
            return "Email Already In Use"
        else
            return _msg
        
    }

    function creatingAccount(bool){
        setAuthMessage("")
        setCreateAccount(bool)
    }

    return (
        <div className='authMenuContainer'>
            <div className='authMenu'>
                {/* <div className='closeButton'>x</div> */}
                <div className='authTitle'>
                    {createAccount ? 
                        "Crate Account"    
                        :
                        "Login"
                    }
                </div>
                <div className='authInputArea'>
                    <div>
                        <input placeholder='Email' ref={emailInput}></input>
                    </div>
                    <div>
                        <input placeholder='Password' type={"password"} ref={passInput}></input>
                    </div>
                    {createAccount &&            
                        <div>
                            <input placeholder='Password Confirmation' ref={passInput2}></input>                    
                        </div>
                    }                
                    {createAccount ?                     
                        <button className='loginButton' onClick={createUser}>Create Account</button>
                        :
                        <button className='loginButton' onClick={signIn}>Login</button>                    
                    }
                </div>
                <div className='authMessage'>
                    {convertErrorMessage(authMessage)}
                </div>
                <div className='authBottom'>
                    {
                        createAccount ?
                        <div>Have an account? <button className='createAccountButton' onClick={()=>creatingAccount(false)}> Log In</button></div>
                        :
                        <div>New here? <button className='createAccountButton' onClick={()=>creatingAccount(true)}> Create an Account</button></div>
                    }
                </div>
            </div>
        </div>
  )
}

export default AuthMenu