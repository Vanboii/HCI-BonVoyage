import React, { useEffect, useState } from "react";
import logo from './boat-10.png';
import ButtonComponent from "./button";
import './banner.css';
import './button.css';
import { useNavigate } from "react-router-dom";
import { useGetUserInfo } from "../pages/hooks/useGetUserInfo";



function TopBanner() {

    const [userName, getUsername] = useState("Login")
    // const [showSettings, toggleSettings] = useState(false);
    const {name} = useGetUserInfo();
  
    useEffect(() => {
      getUsername(name)
    },[])

    function MouseEnter() {
      getUsername("Logout")
    }
    function MouseLeave() {
      getUsername(name)
    }
    
    //? For the Home icon
    const navigate = useNavigate()
    function handleClick() {
      navigate('/home');
    }

    //? For the Profile Button


    return (
        <div id="stickyBanner">
            {/* <div className="leftButtons spacer"> */}
            <img src={logo} title="Logo" onClick={handleClick} alt="Logo" />
            <ButtonComponent text="My Trips" toPage="/mytrips"/>
            <ButtonComponent text="Community Trips" toPage="/welcome" />
            <ButtonComponent text="Database" toPage="/database" />
            {/* </div> */}

            <div className="spacer"></div>
            
            <div className='profile' onMouseEnter={MouseEnter} onMouseLeave={MouseLeave}>
              <ButtonComponent text={userName} toPage="/test2"/>
              <div className="rightButtons">
              <ButtonComponent text="Settings"/>
              </div>
              
            </div>
            
    
        </div>

        //^ This the previously working layout
        // <div id="stickyBanner2">
        //     <div className="leftButtons spacer">
        //     <img src={logo} title="Logo" onClick={handleClick} alt="Logo" />
        //     <ButtonComponent text="My Trips" />
        //     <ButtonComponent text="Community Trips"/>
        //     <ButtonComponent text="Save Me!"/> /** Extra buttons to test responsiveness */
        //     <ButtonComponent text="Help Me!"/>
        //     </div>
        //     <div className="rightButtons spacer">
        //     <ButtonComponent text="Profile!" toPage="/login"/>
        //     </div>
    
        // </div>
    );
}




export default TopBanner;