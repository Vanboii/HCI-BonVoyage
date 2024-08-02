import React, {useEffect, useState} from "react";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useUsers } from "../../useHooks/useUsers";

import './loginPopup.css'
import { setHours } from "date-fns";
import { useNavigate } from "react-router-dom";

export const AuthenticationPopup = (required) => {

  const [ email, setEmail] = useState("")
  const [ username, setUsername ] = useState("")
  const [ password, setPassword ] = useState("")
  
  const [ LoginSignUp, toggleLoginSignUp] = useState(true);
  const [ viewable, toggleViewable ] = useState(false)
  const { addUser, getUser } = useUsers();
  const navigate = useNavigate()

  const handleChange = () => {
    setEmail("")
    setUsername("")
    setPassword("")
    toggleLoginSignUp(!LoginSignUp)
  }

  const handleClose = () => {
    if (required) {
      navigate(-1)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (LoginSignUp) {
      const userCredentail = await signInWithEmailAndPassword(auth, email, password);
      const User = userCredentail.user
      const dbUser = await getUser(User.uid)
      if (dbUser) {
        console.log("Welcome", User.displayName)
      } else {
        addUser(User.uid, {
          email: User.email,
          displayName: User.displayName,
        })
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
    await auth.currentUser.reload()
    const actualUser = auth.currentUser
    if (actualUser) toggleViewable(false);
  }




  const Popup = () => {
    return (
      <div id="popup" className="col centerAlign">
        <div className="content">
          <div className="topCross" onClick={handleClose}>X</div>
          <h2 className="h2-login">{LoginSignUp ? "Welcome!" : "Create a New Account"}</h2>
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
        </div>
      </div>
    );
  };

  return {  viewable, toggleViewable, Popup }
}