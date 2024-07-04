import React, { useState } from 'react';
// import Test from './pages/test';
// import TopBanner from './components/banner';
import Default from './pages/default';
import HomePage from './pages/homePage';
import LoginPage from './pages/login-signup/loginPage';
import SignupPage from './pages/login-signup/signupPage';
import WelcomePage from './pages/welcomePage';
// import ButtonComponent from './components/button';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CommunityPage from './pages/communityPage';
// import TopBanner from './components/banner';





function App() {

    // const [dataBase, checkUser] = useState();


  return (
    <>
    <Router>
        <Routes>
            <Route exact path="/" Component={HomePage} />
            <Route path='/login' Component={LoginPage} />
            <Route path='/signup' Component={SignupPage} />
            <Route path='/welcome' Component={WelcomePage} />
            <Route path='/newpage' Component={CommunityPage} />
            <Route path='*' Component={HomePage}/>
        </Routes>
    </Router>



    </>
    
  );
}

export default App;
