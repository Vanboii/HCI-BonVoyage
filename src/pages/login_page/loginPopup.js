import React, {useState} from "react";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useUsers } from "../../test/useGetUsers";

import './loginPopup.css'

export const AuthenticationPopup = () => {

  const [ email, setEmail] = useState("")
  const [ password, setPassword ] = useState("")
  const [ fname, setFname] = useState("")
  const [ lname, setLname] = useState("")
  const [ username, setUsername ] = useState("")
  const [ LoginSignUp, toggleLoginSignUp] = useState(true);
  const [ viewable, toggleViewable ] = useState(false)
  const { createUser,getUser } = useUsers();

  const handleChange = () => {
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
          uID: User.uid,
          email: email,
          displayName: User.displayName,
          fname: "",
          lname: "",
        })
        console.log("User Added")
      }

      console.log(User.displayName,"logged in.",User)
      toggleViewable(false)
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
        uID:User.uid,
        email: email,
        displayName: username,
        fname:fname,
        lname:lname,
      })
      console.log(User.displayName,"logged in.", User)

      toggleViewable(false)
    } catch (error) {
      console.error(error)
    }
  }    

  const Popup = () => {
    if (viewable) {
      if (LoginSignUp) {
        return (
          <div id="popup" className="col centerAlign">
            <div className="content">
              <div className="topCross" onClick={() => toggleViewable(false)}>X</div>
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
              <div className="topCross" onClick={() => toggleViewable(false)}>X</div>
              <h2>Create Account</h2>
              <form onSubmit={handlCreate} className="col centerAlign border">
                <div className="names">
                  <input type="text" onChange={(e) => {setFname(e.target.value)}}
                    placeholder="First Name" required />
                  <input type="text" onChange={(e) => {setLname(e.target.value)}}
                    placeholder="Last Name" required />
                </div>
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

  return {  viewable, toggleViewable, Popup }
}