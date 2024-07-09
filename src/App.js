import React, { useState } from 'react';
import TopBanner from './components/banner';

import Test from './pages/test';
import Test2 from './pages/test2';
import HomePage from './pages/homePage';
import WelcomePage from './pages/welcomePage';
import CommunityPage from './pages/communityPage';
import DisplayDB from './pages/database';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';

function App() {

  const userInfo = {
    userID: null,
    email: null,
    name: null,
}
if (localStorage.getItem("BonVoyageAuth") == null) {
  localStorage.setItem("BonVoyageAuth", JSON.stringify(userInfo));
}


const [user, setUser] = useState("")



  return (
    <div id='page'>
    <Router>
      <TopBanner/>
      <Routes>
          
        <Route exact path="/" Component={HomePage} />
        <Route path='/welcome' Component={WelcomePage} />
        <Route path='/newpage' Component={CommunityPage} />
        <Route path='/test' Component={Test} />
        <Route path='/test2' Component={Test2} />
        <Route path='/database' Component={DisplayDB} />
        <Route path='*' Component={HomePage} />

        
      </Routes>

    </Router>
    </div>
  );
}

export default App;
