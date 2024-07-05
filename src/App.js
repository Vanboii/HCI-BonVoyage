import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from './pages/home_page/homePage';
import LoginPage from './pages/login/signup_page/loginPage';
import SignupPage from './pages/login/signup_page/signupPage';
import WelcomePage from './pages/trial/welcomePage';
import CommunityPage from './pages/community_page/communityPage';
import TripDetailPage from './pages/planning_page/trip_detail/trip_detail'; // Adjusted import to match the file path and name
import InvitePage from './pages/planning_page/invite_page/invite_page'; // Corrected import path
import PreferencesPage from './pages/planning_page/preferences_page/preferences_page'; // Import PreferencesPage

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/home" element={<HomePage />} />
                <Route path='/login' element={<LoginPage />} />
                <Route path='/signup' element={<SignupPage />} />
                <Route path='/welcome' element={<WelcomePage />} />
                <Route path='/newpage' element={<CommunityPage />} />
                <Route path='/planning/trip_detail' element={<TripDetailPage />} />
                <Route path='/planning/invite' element={<InvitePage />} /> {/* Corrected path */}
                <Route path='/preferences' element={<PreferencesPage />} /> {/* Added PreferencesPage route */}
                <Route path='*' element={<HomePage />} />
            </Routes>
        </Router>
    );
}

export default App;
