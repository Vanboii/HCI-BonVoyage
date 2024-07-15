import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from './pages/home_page/homePage';
import LoginPage from './pages/login_page/loginPage';
import SignupPage from './pages/signup_page/signupPage';
// import WelcomePage from './pages/trial/welcomePage';
import MyTrips from './pages/mytrips_page/mytripsPage';
import CommunityPage from './pages/community_page/communityPage';
import TripDetailPage from './pages/planning_page/trip_detail/trip_detail';
import InvitePage from './pages/planning_page/invite_page/invite_page';
import PreferencesPage from './pages/planning_page/preferences_page/preferences_page';
import TinderPreference from './pages/planning_page/tinder_preference/tinder_preference';
import WaitingRoomPage from './pages/planning_page/waiting_room/waitingroomPage';
import LoadingPage from './pages/planning_page/loading_page/loadingPage';
import ResultsPage from './pages/planning_page/results_page/resultsPage'; // Import ResultsPage
import TopBanner from './components/banner';


function App() {
  return (
    <Router>
      <TopBanner/>
      <Routes>
        <Route path="/home" Component={HomePage} />
        <Route path="/login" Component={LoginPage} />
        <Route path="/signup" Component={SignupPage} />
        {/* <Route path="/welcome" Component={WelcomePage} /> */}
        <Route path="/community" Component={CommunityPage} />
        <Route path="/mytrips" Component={MyTrips} />
        <Route path="/planning/trip_detail" element={<TripDetailPage />} />
        <Route path="/planning/invite" element={<InvitePage />} />
        <Route path="/preferences" element={<PreferencesPage />} />
        <Route path="/tinderpreference" element={<TinderPreference />} />
        <Route path="/waitingroom" element={<WaitingRoomPage />} />
        <Route path="/loading" Component={LoadingPage} />
        <Route path="/results" Component={ResultsPage} /> {/* Add ResultsPage route */}
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
