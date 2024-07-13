import React from "react";
import logo from './boat_in_white.png'; // Update the logo
// import ButtonComponent from "./button";
import { useNavigate } from 'react-router-dom';
import './homepagebanner.css'; // Ensure correct CSS file is imported

function HomePageBanner() {
    const navigate = useNavigate();

    function handleClick() {
        navigate('/Home');
    }

    return (
        <div id="stickyBanner">
            <img src={logo} title="Logo" onClick={handleClick} alt="Logo" />
            <div className="spacer"></div>
            <div className="rightButtons">
                <button onClick={() => navigate('/mytrips')}>My Trips</button>
                <button onClick={() => navigate('/community')}>Community Trips</button>
                <button onClick={() => navigate('/login')}>Log In</button>
            </div>
        </div>
    );
}

export default HomePageBanner;


