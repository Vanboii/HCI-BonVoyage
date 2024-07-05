import React, { useState }from 'react';
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
              <Route path='/planning/trip_detail' element={<TripDetailPage />} />
              <Route path='/planning/invite' element={<InvitePage />} /> {/* Corrected path */}
              <Route path='/preferences' element={<PreferencesPage />} /> {/* Added PreferencesPage route */}
              <Route path='/tinderpreference' element={<TinderPreference />} />
              <Route path='*' element={<HomePage />} />
            </Routes>
      </Router>
  


    </>
    
  );
}

export default App;
