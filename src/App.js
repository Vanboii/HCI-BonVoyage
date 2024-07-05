import React, { useState } from 'react';
// import Test from './pages/test';
// import TopBanner from './components/banner';
import Default from './pages/default';
import HomePage from './pages/home_page/homePage';
import LoginPage from './pages/login/signup_page/loginPage';
import SignupPage from './pages/login/signup_page/signupPage';
import WelcomePage from './pages/trial/welcomePage';
import MyTrips from './pages/mytrips_page/mytripsPage';
// import ButtonComponent from './components/button';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CommunityPage from './pages/community_page/communityPage';
// import TopBanner from './components/banner';





function App() {

    // const [dataBase, checkUser] = useState();


  return (
    <>
    <Router>
        <Routes>
            <Route path="/home" Component={HomePage} />
            <Route exact path='/login' Component={LoginPage} />
            <Route exact path='/signup' Component={SignupPage} />
            <Route exact path='/welcome' Component={WelcomePage} />
            <Route exact path='/community' Component={CommunityPage} />
            <Route exact path='/mytrips' Component = {MyTrips}/>
            <Route path='*' Component={HomePage}/>
        </Routes>
    </Router>



    </>
    
  );
}

export default App;

