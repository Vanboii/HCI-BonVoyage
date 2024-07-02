import React from "react";
import "./styleMain.css";
import logo from '../components/boat-10.png';

function Test() {
    var doSomething;
    return (
        <div id="stickyBanner">
            <div className="leftButtons">
            <img src={logo} title="Logo" onClick={doSomething}/>
            <button>My Trips</button>
            <button>Community Trips</button>
            <button>Save Me!</button>
            <button>Help Me!</button>

   
            </div>
            
            <div>
            <button>Profile</button>
            </div>
            
      
        
    
        </div>
    );
}

export default Test;