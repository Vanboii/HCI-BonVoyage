import React from "react";
import "./homePage.css";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import TopBanner from "../components/banner";
import ButtonComponent from "../components/button";

function Test2() {
    const navigate = useNavigate();

    function UserSignup (event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('pw').value;
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredentail) => {
            console.log(userCredentail);
            const user = userCredentail.user
            alert("Account " + user + " created!")
            navigate('/newpage');
            }).catch ((error) => {
            alert(error.message);
            });
        
    };
    return (
        <>
        {/* <TopBanner/> */}
        <div className="centerAlign">
            <h2>Sign Up</h2>
            <form className="centerAlign col" onSubmit={UserSignup}>
                <input type="text" placeholder="Email" id="email" required />
                <input type="text" placeholder="Password" id="pw" required />
                <button type="submit">Sign Me Up!</button>
            </form>

            <ButtonComponent toPage='/test' type="1" text="I have an Account!"/>
        </div>
        </>
        
    );
}

export default Test2;