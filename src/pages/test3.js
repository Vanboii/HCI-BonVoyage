import React, { useState } from "react";
import "./homePage.css";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";

function Test3() {
    function UserLogin (event) {
        event.preventDefault();
        const navigate = useNavigate();
        const email = document.getElementById('email').value;
        const password = document.getElementById('pw').value;
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredentail) => {
            console.log(userCredentail);
            navigate('/newpage');
            }).catch ((error) => {
            alert(error.message);
            });

    };
    return (
        <>
        <div className="centerAlign">
            <form className="centerAlign col" onSubmit={UserLogin}>
                <input type="text" placeholder="Email" id="email" required />
                <input type="text" placeholder="Password" id="pw" required />
                <button type="submit">Login</button>
            </form>

            {/* <form className="centerAlign col" onSubmit={userLogin(userEmail,userPW)}>
                <input type="text" placeholder="Email" required  onChange={(event) => setEmail(event.target.value)} />
                <input type="text" placeholder="Password" required  onChange={(event) => setPW(event.target.value)}/>
                <button type="submit">Login</button>
            </form> */}
        </div>
        </>
        
    );
}

export default Test3;