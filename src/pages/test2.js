import React from "react";
import "./homePage.css";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";


function Test2() {

    // const [userEmail, setEmail] = useState('');
    // const [userPW, setPW] = useState('');

    const UserSignup = (event) => {
        event.preventDefault();
        const navigate = useNavigate();
        const email = document.getElementById('email').value;
        const password = document.getElementById('pw').value;
        
        try { 
            const userCredentail = createUserWithEmailAndPassword(auth, email, password);
            console.log(userCredentail)
            navigate('/newpage')
        } catch (error) {
            console.log(error.message);
            alert(error.message)
        }
        // createUserWithEmailAndPassword(auth, email, password)
        //     .then((userCredentail) => {
        //         console.log(userCredentail)
        //         //# Redirect to homepage
        //     }).catch((error) => {
                
        //     })
    };

    return (

        <div className="centerAlign">
            {/* <form className="centerAlign col" onSubmit={userLogin()}>
                <input type="text" placeholder="Email" id="email" name="email" required />
                <input type="text" placeholder="Password" id="pw" name="pw" required />
                <button type="submit">Login</button>
            </form> */}

            <form className="centerAlign col" onSubmit={UserSignup}>
                <input type="text" placeholder="Email" required id="email" />
                <input type="text" placeholder="Password" required id="pw" />
                <button type="submit">SignUp</button>
            </form>
        </div>
    );
}

export default Test2;