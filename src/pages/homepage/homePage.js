import React from "react";
import TopBanner from "../components/banner";
import ButtonComponent from "../components/button";
import "./homePage.css";



function HomePage() {
    // ^ Need to add path for the button
    return (
        <>
        <TopBanner/>
        <div id="main">
            <div className="col centerAlign">
                <h1>Bon Voyage</h1>
                <ButtonComponent type="2" text="Start Planning"/>
            </div>
        
        </div>
        </>
    );
}

export default HomePage;