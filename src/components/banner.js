import React, { useEffect, useState } from "react";
import logo from './boat-10.png';
import ButtonComponent from "./button";
import './banner.css';
import './button.css';
import { useNavigate } from "react-router-dom";

import { useGetUserInfo } from "../hooks/useGetUserInfo";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";



function TopBanner() {

    const [username, setUsername] = useState("Login")
 

    //? For the Home icon
    const navigate = useNavigate()
    function handleClick() {
      navigate('/home');
    }

    //? For the Profile Button
    const listen = () => {
      if (auth.currentUser) {
        setUsername(auth.currentUser.displayName)
      } else {
        setUsername("Login")
      }
    }

    function logout() {
      signOut(auth);
      console.log("Logging Out",auth.currentUser)
    }

    useEffect(() => {
      listen()
    })

    return (
        <div id="stickyBanner">
            {/* <div className="leftButtons spacer"> */}
            <img src={logo} title="Logo" onClick={handleClick} alt="Logo" />
            <ButtonComponent text="My Trips" toPage="/trips"/>
            <ButtonComponent text="Community Trips" toPage="/community" />
            <ButtonComponent text="Database" toPage="/database" />
            {/* </div> */}

            <div className="spacer"></div>
          
            <div className='profile'>
            <ButtonComponent text={username} toPage="/login"/>
            {(username != "Login") && <div className="rightButtons">
              <ButtonComponent text="Logout" action={logout}/>
            </div>}
          </div>
            
    
        </div>


    );
}




export default TopBanner;