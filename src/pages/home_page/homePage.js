import React from "react";
import TopBanner from '../../components/banner'; 
import ButtonComponent from '../../components/button'; 
import './homePage.css'; 

function HomePage() {
    return (
        <>
            <TopBanner />
            <div id="main">
                <div className="col centerAlign">
                    <h1>Bon Voyage</h1>
                    <ButtonComponent type="2" text="Start Planning" toPage="/planning/trip_detail" />
                </div>
            </div>
        </>
    );
}

export default HomePage;
