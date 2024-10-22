import React from "react";
import TopBanner from "../../components/banner";
import ButtonComponent from "../../components/button";
// import '../homePage.css';



function SignupPage() {

  return (
    <>
    <TopBanner/>
    <div id="main">
      <div id="account">
        <div className="left">
        <h2>Sign Up</h2>
        <p className="subtitle">Got account? <ButtonComponent className="3" text="Login" type="0" toPage="/Login"/></p>
        </div>
        <div className="col">
          <form action={'/newpage'} method="post">

            <label for="username">Username</label>
            <input type="text" id="username" name="username"/>
            <label for="email">Email</label>
            <input type="text" id="email" name="email"/>
            <label for="password">Password</label>
            <input type="text" id="password" name="password"/>
            <div className="rightAlign">
            <input className="submit" type="submit" value={"Sign Up"}/>
            </div>
            
          </form>
        </div>
      </div>
    </div>
    </>
  );
}

export default SignupPage;
