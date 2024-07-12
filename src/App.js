import React, { useState } from 'react';
import TopBanner from './components/banner';

import Test from './pages/test';
import Test2 from './pages/test2';
import HomePage from './pages/homePage';
import WelcomePage from './pages/welcomePage';
import CommunityPage from './pages/communityPage';
import DisplayDB from './pages/database';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from './pages/home_page/homePage';
import LoginPage from './pages/login_page/loginPage';
import SignupPage from './pages/signup_page/signupPage';
import WelcomePage from './pages/trial/welcomePage';
import MyTrips from './pages/mytrips_page/mytripsPage';
import CommunityPage from './pages/community_page/communityPage';
import TripDetailPage from './pages/planning_page/trip_detail/trip_detail'; // Adjusted import to match the file path and name
import InvitePage from './pages/planning_page/invite_page/invite_page'; // Corrected import path
import PreferencesPage from './pages/planning_page/preferences_page/preferences_page'; // Import PreferencesPage
import TinderPreference from './pages/planning_page/tinder_preference/tinder_preference';
import WaitingRoomPage from './pages/planning_page/waiting_room/waitingroomPage';
// import TopBanner from './components/banner';
import LoadingPage from './pages/planning_page/loading_page/loadingPage';





function App() {
  
    // const [dataBase, checkUser] = useState();


  return (
    <div id='page'>
    <Router>
      <TopBanner/>
      <Routes>
          
        <Route exact path="/" Component={HomePage} />
        <Route path='/welcome' Component={WelcomePage} />
        <Route path='/trips' Component={MyTripsPage} />
        <Route path='/community' Component={CommunityPage} />
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
