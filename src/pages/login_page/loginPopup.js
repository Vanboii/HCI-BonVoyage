
import React, { useState } from "react";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useUsers } from "../../useHooks/useUsers";
import './loginPopup.css'
import { useNavigate, useLocation } from "react-router-dom";

export const LoginPopup = () => {

  const [ email, setEmail] = useState("")
  const [ username, setUsername ] = useState("")
  const [ password, setPassword ] = useState("")
  
  const [ LoginSignUp, toggleLoginSignUp] = useState(true);
  const [ showPopup, setShowPopup ] = useState(false)
  const { addUser, getUser } = useUsers();
  const navigate = useNavigate()
  const location = useLocation()
  const requireLogin = location.pathname.startsWith("/planning") || 
                      location.pathname.startsWith("/preferences") ||
                      location.pathname.startsWith("/tinderpreference");

  const handleChange = () => {
    setEmail("")
    setUsername("")
    setPassword("")
    toggleLoginSignUp(!LoginSignUp)
  }

  const handleClose = () => {
    setShowPopup(false)
    if (requireLogin) {
      navigate(-1) //Goback to previous page
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (LoginSignUp) {
      const userCredentail = await signInWithEmailAndPassword(auth, email, password);
      const User = userCredentail.user
      const dbUser = await getUser(User.uid)
      if (dbUser) {
        console.log("Welcome back", User.displayName)
      } else {
        addUser(User.uid, {
          email: User.email,
          displayName: User.displayName,
        })
        console.log("Welcome to Bonvoyage,", User.displayName)
      }
    } else {
      const userCredentail = await createUserWithEmailAndPassword(auth, email, password);
      const User = userCredentail.user
      await updateProfile(User, {
        displayName: username
      })
      addUser(User.uid, {
        email: email,
        displayName: username
      })
    }
  }




  const Popup = () => {
    return (
      <div id="popup" className="col centerAlign">
        <div className="content">
          <h2 className="h2-login">{LoginSignUp ? "Welcome!" : "Create a New Account"}</h2>
          {requireLogin && <p>This page requires users to login</p>}
          <form onSubmit={handleSubmit} className="col centerAlign">
            {!LoginSignUp && (
              <input type="text" onChange={(e) => { setUsername(e.target.value) }}
                placeholder="Username" required />
            )}
            <input type="text" onChange={(e) => { setEmail(e.target.value) }}
              placeholder="Email" required />
            <input type="text" onChange={(e) => { setPassword(e.target.value) }}
              placeholder="Password" required />
            <button type="submit">{LoginSignUp ? "Login" : "Sign Up"}</button>
          </form>
          <p>
            {LoginSignUp ? "Don't have an account yet? " : "Have an account? "}
            <a href="#" onClick={handleChange} className="link">
              {LoginSignUp ? "Sign up here" : "Login here"}
            </a>
          </p>
          <button onClick={handleClose}>Close</button>
        </div>
      </div>
    );
  };

  return { showPopup, setShowPopup, Popup }
}