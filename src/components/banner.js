// banner.js

import React, { useEffect, useState } from "react";
import homepageLogo from './boat_in_white.png'; // Logo for homepage
import otherPagesLogo from './boat-10.png'; // Logo for other pages
// import ButtonComponent from "./button";
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation to get the current path
import './banner.css'; // Ensure correct CSS file is imported+

import { auth } from "../firebase";
import { onAuthStateChanged, updateProfile, signOut } from "firebase/auth";
import { AuthenticationPopup } from "../pages/login_page/loginPopup";

function TopBanner() {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if the current page is the homepage
  const isHomepage = location.pathname === '/';

  function handleClick() {
      navigate('/'); // Adjust the homepage route if needed
  }

  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  const { Popup } = AuthenticationPopup()
  const [showPopUp, togglePopUp] = useState(false)
  const [user, setUser] = useState(null)
  const [hover, setHover] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      console.log("User signed out");
      navigate('/'); // Optionally navigate to the home page
    } catch (error) {
        console.error("Error signing out: ", error);
    };
  }
  useEffect(() => {
    // Set up an observer for changes to the user's sign-in state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in
            setUser({
              username: user.displayName,
              email: user.email,
              id: user.uid,
            });
        } else {
            // User is signed out
            setUser(null);
        }
    });
    // Clean up the subscription
    return () => unsubscribe();
  }, []);

  

  const profile = () => {

    if (user) {
      let show = user.username
      if (hover) {
        show = "Log Out"
      }
      return (
        <button className={isHomepage ? 'white-text' : 'black-text'} onClick={handleSignOut} 
          onMouseEnter={() => setHover(true)} onMouseLeave={() =>setHover(false)} >{show}</button>
      )
    }
    return (
      <button className={isHomepage ? 'white-text' : 'black-text'} onClick={() => togglePopUp(true)}>Log In</button>
    )
  }
  

    return (

        <div id="stickyBanner" className={isHomepage ? 'transparent' : 'colored'}>
          <img src={isHomepage ? homepageLogo : otherPagesLogo} title="Logo" onClick={handleClick} alt="Logo" />
          <div className="spacer"></div>
          <div className="rightButtons">
            <button className={isHomepage ? 'white-text' : 'black-text'} onClick={() => navigate('/mytrips')}>My Trips</button>
            <button className={isHomepage ? 'white-text' : 'black-text'} onClick={() => navigate('/community')}>Community Trips</button>
            {profile()}
          </div>
          {showPopUp && Popup()}
        </div>
    );
}




export default TopBanner;