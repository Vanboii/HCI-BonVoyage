import React, {useState} from "react";
import "./homePage.css";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";


function Test() {

    // const [userEmail, setEmail] = useState('');
    // const [userPW, setPW] = useState('');

    // async function userLogin (email,password) {
    //     await signInWithEmailAndPassword(auth, email, password)
    //         .catch((error) => {
    //             console.log(error.message);
    //         }).then((userCredentail) => {
    //             console.log(userCredentail)
    //             //# Redirect to homepage
    //         })
    // };

    function UserLogin (event) {
        event.preventDefault()
        const navigate = useNavigate();
        try {
            const userCredentail = signInWithEmailAndPassword(auth, document.getElementById('email'), document.getElementById('pw'));
            console.log(userCredentail)
            navigate('/newpage')
        } catch (error) {
            alert(error.message);
        }

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

export default Test;