import React from "react";
// import TopBanner from "../components/banner";
import ButtonComponent from "../../components/button";
import "../homePage.css";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";



function Test() {

    const navigate = useNavigate();

    async function UserLogin (event) {
        event.preventDefault()
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('pw').value;
        try {
          const userCredentail = await signInWithEmailAndPassword(auth, email, password);
          const user = userCredentail.user
          const username = user.displayName

          console.log(username,"logged in.",user)
          navigate('/database')

        } catch (error) {

        }
        




        
    };


    return (

        <div id="main">
            <h2>Log In</h2>
            <form className="centerAlign col" onSubmit={UserLogin}>
                <input type="text" placeholder="Email" id="email" required />
                <input type="text" placeholder="Password" id="pw" required />
                <div className="row justify">
                  <button type="submit">Login</button>
                  <ButtonComponent toPage='/signup' text="Create an Account!"/>
                </div>
            
            </form>

        </div>

    );
}

export default Test;