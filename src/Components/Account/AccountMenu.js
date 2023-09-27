import { signOut, updateEmail } from 'firebase/auth'
import React, { useRef } from 'react'
import "./AccountMenu.css"
import { useSelector } from 'react-redux'

function AccountMenu(props) {

  const auth = useSelector(state => state.appSlice.auth)
  const userEmail = useSelector(state => state.appSlice.userEmail)
  const newEmailInput = useRef()

  // Requires recent login
  function updateEmailFunction(){
    let newEmail = newEmailInput.current.value
    console.log("attempting to update email to "+newEmail)
    updateEmail(auth.currentUser, newEmail)

  }

  function updateUserPassword(){
    // send a password reset link to the usesr's email
    
  }

  return (
    <div className='accountMenuContainer'>
      <div className='accountMenu'>
          <div className='accountMenuTitle'>
              Account
          </div>
          <div>Email: {userEmail}</div>
          <div className='closeButton' onClick={()=>props.setShowAccountMenu(false)}>x</div>
          <button className='signOutButton' onClick={()=>signOut(auth)}>Log Out</button>
          <input placeholder='new email' ref={newEmailInput}></input>
          <button onClick={updateEmailFunction}>Update Email</button>
          <button onClick={updateUserPassword}>Update Password</button>
      </div>
    </div>
  )
}

export default AccountMenu