import React from "react";
import logo from './boat-10.png';
import ButtonComponent from "./button";
import { useNavigate } from 'react-router-dom';
import './banner.css';





function TopBanner() {

    const navigate = useNavigate();
    function handleClick() {
        // setState(!state);
        navigate('/Home');
    };
    var doSomething;
    return (
        <div id="stickyBanner">
            {/* <div className="leftButtons spacer"> */}
            <img src={logo} title="Logo" onClick={handleClick} alt="Logo" />
            <ButtonComponent text="My Trips" toPage="/mytrips"/> 
            <ButtonComponent text="Community Trips" toPage="/community"/>
            {/* <ButtonComponent text="Save Me!"/> */}
            {/* <ButtonComponent text="Help Me!"/> */}
            {/* </div> */}
            <div className="spacer"></div>
            {/* <div className="rightButtons spacer"> */}
            <ButtonComponent text="Profile" toPage="/login"/>
            {/* </div> */}
    
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