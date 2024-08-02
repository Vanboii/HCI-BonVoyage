import React, { useEffect, useState } from "react";
import PageLogo from './boat_in_white.png'; // Use the white logo for all pages
import ButtonComponent from "./button";
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation to get the current path
import './banner.css'; // Ensure correct CSS file is imported
import Alert from './alert'; // Make sure the path to Alert is correct

import { auth } from "../firebase";
import { onAuthStateChanged, updateProfile, signOut } from "firebase/auth";
import { AuthenticationPopup } from "../pages/login_page/loginPopup";

function TopBanner({ showAlertOnNavigate }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showAlert, setShowAlert] = useState(false);
  const [navigateTo, setNavigateTo] = useState("");

  // Determine if the current page is the homepage
  const isHomepage = location.pathname === '/' || location.pathname === '/Home';

  function handleClick() {
    navigate('/'); // Adjust the homepage route if needed
  }

  const { Popup, viewable, toggleViewable } = AuthenticationPopup();

  const [user, setUser] = useState(null);
  const [hover, setHover] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      console.log("User signed out");
      navigate('/'); // Optionally navigate to the home page
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

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
          onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>{show}</button>
      )
    }
    return (
      <button className={isHomepage ? 'white-text' : 'black-text'} onClick={() => toggleViewable(true)}>Log In</button>
    )
  }

  const handleLogoClick = () => {
    if (showAlertOnNavigate) {
      setNavigateTo('/Home');
      setShowAlert(true);
    } else {
      navigate('/Home');
    }
  };

  const handleButtonClick = (toPage) => {
    if (showAlertOnNavigate) {
      setNavigateTo(toPage);
      setShowAlert(true);
    } else {
      navigate(toPage);
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const handleOkayAlert = () => {
    navigate(navigateTo);
  };

  return (
    <div id="stickyBanner" className={isHomepage ? 'transparent' : 'colored'}>
      <img src={PageLogo} title="Logo" onClick={isHomepage ? handleClick : handleLogoClick} alt="Logo" />
      <div className="spacer"></div>
      <div className="rightButtons">
        <ButtonComponent
          text="My Trips"
          onClick={() => {
            if (isHomepage) {
              navigate('/mytrips');
            } else {
              handleButtonClick('/mytrips');
            }
          }}
          type={isHomepage ? 'white-text' : 'black-text'}
        />
        <ButtonComponent
          text="Community Trips"
          onClick={() => {
            if (isHomepage) {
              navigate('/community');
            } else {
              handleButtonClick('/community');
            }
          }}
          type={isHomepage ? 'white-text' : 'black-text'}
        />
        {profile()}
      </div>
      {showAlert && (
        <Alert
          message="Are you sure you want to leave the page? All changes will be discarded."
          onClose={handleCloseAlert}
          onOkay={handleOkayAlert}
          showAlert={showAlert}
        />
      )}
      {viewable && Popup()}
    </div>
  );
}

export default TopBanner;
