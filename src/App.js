import React from 'react';
import TopBanner from './components/banner';
import Test from './pages/test';
import Test3 from './pages/test3';
import HomePage from './pages/homePage';
import LoginPage from './pages/login-signup/loginPage';
import SignupPage from './pages/login-signup/signupPage';
import WelcomePage from './pages/welcomePage';
import CommunityPage from './pages/communityPage';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';

function App() {


    return (
        <div id='page'>
        <Router>
            <TopBanner/>
            <Routes>
                <Route exact path="/" Component={HomePage} />
                <Route path='/login' Component={LoginPage} />
                <Route path='/signup' Component={SignupPage} />
                <Route path='/welcome' Component={WelcomePage} />
                <Route path='/newpage' Component={CommunityPage} />
                <Route path='/test' Component={Test} />
                <Route path='/test2' Component={Test3}/>
                <Route path='*' Component={HomePage} />
            </Routes>

        </Router>
        </div>
    );
}

export default App;
