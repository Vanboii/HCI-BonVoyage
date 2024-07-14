import React from "react";

import "../homePage.css";
import { useNavigate } from "react-router-dom";


function LoginPage() {

    const navigate = useNavigate()
    function handleClick(toPage) {
        navigate(toPage);
    };

    return (
        <>
        {/* <TopBanner/> */}
        <div id="main">
            <div id="account">
                <div className="left">
                <h2>Log In</h2>
                <p className="subtitle">No account? <i onClick={handleClick('/signup')} >Register</i> </p>
                </div>
                <div className="col ">
                    <form action={' PLS HELP '}>
                        <label for="id">Email/Username</label>
                        <input type="text" id="email" name="id"/>
                        <label for="password">Password</label>
                        <input type="text" id="password" name="password"/>
                        <div className="rightAlign">
                        <input className="submit" type="submit" value={"Login"}/>
                        </div>
                    </form>
                </div>
            </div>


        </div>

        
        
        </>

    );
}

export default LoginPage;