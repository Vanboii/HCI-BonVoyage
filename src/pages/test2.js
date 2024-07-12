import React from "react";
import ButtonComponent from "../components/button";
import "./homePage.css";

import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

import Cookies from "js-cookie";

function Test2() {
    const navigate = useNavigate();

    const setCookie = (userInfo) => {
      Cookies.set("BonVoyAuth",userInfo,{expires: 0.5})
    }

    async function UserSignup (event)  {
        event.preventDefault();

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

        const userInfo = {
            userID: user.uid,
            email: user.email,
            name: username,
        }
        setCookie(userInfo)
        localStorage.setItem("BonVoyageAuth", JSON.stringify(userInfo));
        navigate('/database')

        




    };

    return (
        <>
        {/* <TopBanner/> */}
        <div className="centerAlign">
            <h2>Sign Up</h2>
            <form className="centerAlign col" onSubmit={UserSignup}>
                <input type="text" placeholder="Email" id="email" required />
                <input type="text" placeholder="Username" id="username" required />
                <input type="text" placeholder="Password" id="pw" required />
                <input type="submit">Sign Me Up!</input>
            </form>

            <ButtonComponent toPage='/test' type="1" text="I have an Account!"/>
        </div>
        </>
        
    );
}

export default Test2;