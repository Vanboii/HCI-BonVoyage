import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from './pages/home_page/homePage';
import LoginPage from './pages/login/signup_page/loginPage';
import SignupPage from './pages/login/signup_page/signupPage';
import WelcomePage from './pages/trial/welcomePage';
import CommunityPage from './pages/community_page/communityPage';
import MyTripsPage from './pages/mytrips_page/myTripsPage';
import ConfirmationPage from './pages/planning_page/confirmation_page/confirmationPage';
import GenerationPage from './pages/planning_page/generation_page/generationPage';
import InvitePage from './pages/planning_page/invite_page/invitePage';
import ItineraryResultPage from './pages/planning_page/itinerary_result_page/itineraryResultPage';
import PreferenceBasicPage from './pages/planning_page/preference_basic/preferenceBasicPage';
import TinderPreferencePage from './pages/planning_page/tinder_preference/tinderPreferencePage';
import TripDetailPage from './pages/planning_page/trip_detail/tripDetailPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/welcome' element={<WelcomePage />} />
        <Route path='/newpage' element={<CommunityPage />} />
        <Route path='/mytrips' element={<MyTripsPage />} />
        <Route path='/planning/confirmation' element={<ConfirmationPage />} />
        <Route path='/planning/generation' element={<GenerationPage />} />
        <Route path='/planning/invite' element={<InvitePage />} />
        <Route path='/planning/itinerary' element={<ItineraryResultPage />} />
        <Route path='/planning/preference_basic' element={<PreferenceBasicPage />} />
        <Route path='/planning/tinder_preference' element={<TinderPreferencePage />} />
        <Route path='/planning/trip_detail' element={<TripDetailPage />} />
        <Route path='*' element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
