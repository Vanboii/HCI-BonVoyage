import React, {useState} from "react";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signOut } from "firebase/auth";
import { useUsers } from "../../test/useUsers";

import './loginPopup.css'

export const AuthenticationPopup = () => {

  const [ email, setEmail] = useState("")
  const [ password, setPassword ] = useState("")
  const [ username, setUsername ] = useState("")
  
  const [ LoginSignUp, toggleLoginSignUp] = useState(true);
  const [ popUp, togglePopup ] = useState(false)
  const { createUser,getUser } = useUsers();

  const handleChange = (e) => {
    e.preventDefault()
    setPassword("")
    toggleLoginSignUp(!LoginSignUp)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const userCredentail = await signInWithEmailAndPassword(auth, email, password);
      const User = userCredentail.user
      try {
        const { user } = getUser(User.uid)
        if (user) {
          console.log("Welcome")
        }
      } catch (error) {
        console.error(error)
        createUser({
          uid: User.uid,
          email: email,
          displayName: User.displayName,

        })
        console.log("User Added")
      }

      console.log(User.displayName,"logged in.",User)
      togglePopup(false)
    } catch (error) {
      console.error(error)
    }
  }

  const handlCreate = async (e) => {
    e.preventDefault()
    try {
      const userCredentail = await createUserWithEmailAndPassword(auth, email, password);
      const User = userCredentail.user
      await updateProfile(User, {
        displayName: username
      })
      createUser({
        uid:User.uid,
        email: email,
        displayName: username,
      })
      
      console.log(User.displayName,"logged in.", User)

      togglePopup(false)
    } catch (error) {
      console.error(error)
    }
  }    

  const popupWindow = () => {
    if (popUp) {
      if (LoginSignUp) {
        return (
          <div id="popup" className="col centerAlign">
            <div className="content">
              <div className="topCross" onClick={() => togglePopup(false)}>X</div>
              <h2>Login</h2>
              <form onSubmit={handleLogin} className="col centerAlign border">
                <input type="text" onChange={(e) => {setEmail(e.target.value)}}
                  placeholder="Email" required />
                <input type="text" onChange={(e) => {setPassword(e.target.value)}}
                  placeholder="Password" required />
                <button type="submit">I'm Back!</button>
              </form>
              <button onClick={handleChange}>Create an Account</button>
            </div>
          </div>
        )
      } else {
        return (
          <div id="popup" className="col centerAlign">
            <div className="content">
              <div className="topCross" onClick={() => togglePopup(false)}>X</div>
              <h2>Create Account</h2>
              <form onSubmit={handlCreate} className="col centerAlign border">
                <input type="text" onChange={(e) => {setUsername(e.target.value)}}
                  placeholder="Username" required />
                <input type="text" onChange={(e) => {setEmail(e.target.value)}}
                  placeholder="Email" required />
                <input type="text" onChange={(e) => {setPassword(e.target.value)}}
                  placeholder="Password" required />
                <button type="submit">Let. Me. IN!</button>
              </form>
              <button onClick={handleChange}>Login instead</button>
            </div>
          </div>
        )
      }
    }
    
  }

  return { popupWindow, togglePopup, popUp }
}