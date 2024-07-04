import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Default from './pages/default';
import HomePage from './pages/home_page/homePage';
import LoginPage from './pages/login_page/loginPage';
import SignupPage from './pages/signup_page/signupPage';
import WelcomePage from './pages/trial/welcomePage';
import CommunityPage from './pages/community_page/communityPage';
import MyTripsPage from './pages/mytrips_page/mytripsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/welcome' element={<WelcomePage />} />
        <Route path='/community' element={<CommunityPage />} />
        <Route path='/mytrips' element={<MyTripsPage />} />
        <Route path='*' element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
