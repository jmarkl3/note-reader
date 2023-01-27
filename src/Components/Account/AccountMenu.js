import { signOut } from 'firebase/auth'
import React from 'react'
import { auth } from '../../Firebase'
import "./AccountMenu.css"

function AccountMenu(props) {

  return (
    <div className='accountMenuContainer'>
      <div className='accountMenu'>
          <div className='accountMenuTitle'>
              Account
          </div>
          <div className='closeButton' onClick={()=>props.setShowAccountMenu(false)}>x</div>
          <button className='signOutButton' onClick={()=>signOut(auth)}>Log Out</button>
      </div>
    </div>
  )
}

export default AccountMenu