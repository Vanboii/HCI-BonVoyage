import React from "react";
import TopBanner from "../components/banner";
import ButtonComponent from "../components/button";
import "./homePage.css";

import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";



function Test() {

    const navigate = useNavigate();

    async function UserLogin (event) {
        event.preventDefault()
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('pw').value;
        
        const userCredentail = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredentail.user
        const username = user.displayName

        console.log("User logged in:", username)
        console.log(user)

        const userInfo = {
            userID: user.uid,
            email: email,
            name: username,
        }

        localStorage.setItem("BonVoyageAuth", JSON.stringify(userInfo));
        navigate('/newpage')

    };


    return (
        <>
        {/* <TopBanner/> */}
        <div className="centerAlign">
            <h2>Log In</h2>
            <form className="centerAlign col" onSubmit={UserLogin}>
                <input type="text" placeholder="Email" id="email" required />
                <input type="text" placeholder="Password" id="pw" required />
                <button type="submit">Login</button>
            </form>

            <ButtonComponent toPage='/test2' text="Create an Account!"/>
        </div>
        </>
        
    );
}

export default Test;