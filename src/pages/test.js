import React from "react";
import "./homePage.css";
import { db } from "../../../bonvoyage/src/firebase-config";

function Test() {

    const userLogin = async (email,pw) => {
        const results = await signInWithEmailAndPassword(auth,email,pw);
        
    };

    return (
        <div id="stickyBanner">
            <div className="leftButtons">

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