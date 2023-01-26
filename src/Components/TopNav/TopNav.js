import React, { useState } from 'react'
import accountIcon from "../../Images/accountIcon.png"
import AccountMenu from '../Account/AccountMenu'
import AuthMenu from '../AuthMenu/AuthMenu'
import "./TopNav.css"
function TopNav(props) {

  const [showAccountMenu, setShowAccountMenu] = useState(false)

  return (
    <div className='topNav'>
        <div className='accountIcon' onClick={()=>setShowAccountMenu(true)}>
          <img src={accountIcon}></img>
        </div>
        {/* <div onClick={()=>props.transferNotes()}>Transfer Notes</div> */}
        {showAccountMenu && <AccountMenu setShowAccountMenu={setShowAccountMenu}></AccountMenu>}
    </div>
  )
}

export default TopNav