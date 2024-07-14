import React from "react";
import ButtonComponent from "../../components/button";
import "../homePage.css";

import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";



function Test2() {

    const navigate = useNavigate();


    async function UserSignup (event)  {
      event.preventDefault();
      try {
        const email = document.getElementById('email').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('pw').value;

        const userCredentail = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredentail.user

        await updateProfile(user, {
            displayName: username,
        });

        console.log("User signed up:", username)
        console.log(user)
        navigate('/database')

      } catch (error) {
        console.log("Signup error:",error)
      }
      

    };

    return (
        <>
        <div className="centerAlign">
          <h2>Sign Up</h2>
          <form className="col centerAlign" onSubmit={UserSignup}>
              <input type="text" placeholder="Email" id="email" required />
              <input type="text" placeholder="Username" id="username" required />
              <input type="text" placeholder="Password" id="pw" required />
              <div>
                <button type="submit">Sign Me Up!</button>
                <ButtonComponent toPage='/login' text="I have an Account!"/>
              </div>
          </form>

        </div>
        </>
        
    );
}

export default Test2;