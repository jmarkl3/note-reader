import { signOut } from 'firebase/auth'
import React from 'react'
import "./AccountMenu.css"
import { useSelector } from 'react-redux'

function AccountMenu(props) {

  const auth = useSelector(state => state.appSlice.auth)

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