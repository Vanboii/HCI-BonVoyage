// banner.js

import React from "react";
import homepageLogo from './boat_in_white.png'; // Logo for homepage
import otherPagesLogo from './boat-10.png'; // Logo for other pages
// import ButtonComponent from "./button";
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation to get the current path
import './banner.css'; // Ensure correct CSS file is imported

function Banner() {
    const navigate = useNavigate();
    const location = useLocation();

    // Determine if the current page is the homepage
    const isHomepage = location.pathname === '/';

    function handleClick() {
        navigate('/'); // Adjust the homepage route if needed
    }

    return (
        <div id="stickyBanner" className={isHomepage ? 'transparent' : 'colored'}>
            <img src={isHomepage ? homepageLogo : otherPagesLogo} title="Logo" onClick={handleClick} alt="Logo" />
            <div className="spacer"></div>
            <div className="rightButtons">
                <button className={isHomepage ? 'white-text' : 'black-text'} onClick={() => navigate('/mytrips')}>My Trips</button>
                <button className={isHomepage ? 'white-text' : 'black-text'} onClick={() => navigate('/community')}>Community Trips</button>
                <button className={isHomepage ? 'white-text' : 'black-text'} onClick={() => navigate('/login')}>Log In</button>
            </div>
        </div>
    );
}




export default Banner;