import React from "react";
import TopBanner from "../../components/banner";
import ButtonComponent from "../../components/button";
import "../homePage.css";
import { useNavigate } from "react-router-dom";
import { db } from "../../../../bonvoyage/src/firebase-config";


function LoginPage() {

    const userLogin = async (email,pw) => {
        const results = await signInWithEmailAndPassword(auth,email,pw);
        
    };
    const navigate = useNavigate()
    function handleClick(toPage) {
        navigate(toPage);
    };
    return (
        <>
        <TopBanner/>
        <div id="main">
            <div id="account">
                <div className="left">
                <h2>Log In</h2>
                <p className="subtitle">No account? <i onClick={handleClick('/signup')} >Register</i> </p>
                </div>
                <div className="col ">
                    <form>
                        <input type="text" placeholder="Email" id="email" name="id" required />
                        <input type="text" placeholder="Password"id="password" name="password" required />
                        <div className="rightAlign">
                        {/* <input className="submit" type="submit" value={"Login"}/> */}
                        <button type="submit" onClick={userLogin}>Login</button>
                        </div>
                    </form>
                </div>
                <div>

                </div>
            </div>


        </div>

        
        
        </>

    );
}

export default LoginPage;