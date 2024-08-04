import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from './pages/home_page/homePage';
// import LoginPage from './pages/login_page/loginPage';
// import SignupPage from './pages/signup_page/signupPage';
import MyTrips from './pages/mytrips_page/mytripsPage';
import CommunityPage from './pages/community_page/communityPage';
import TripDetailPage from './pages/planning/trip_detail/trip_detail';
import InvitePage from './pages/planning/invite_page/invite_page';
import PreferencesPage from './pages/planning/preferences_page/preferences_page';
import TinderPreference from './pages/planning/tinder_preference/tinder_preference';
import WaitingRoomPage from './pages/planning/waiting_room/waitingroomPage';
import LoadingPage from './pages/planning/loading_page/loadingPage';
import ResultsPage from './pages/planning/results_page/resultsPage'; // Import ResultsPage
import InviteStart from './pages/planning/start_invite_page/start_invite'; 




function App() {



  const [savedTrips, setSavedTrips] = useState(() => {
    const savedTripsFromLocalStorage = localStorage.getItem('savedTrips');
    return savedTripsFromLocalStorage ? JSON.parse(savedTripsFromLocalStorage) : [];
  });

  useEffect(() => {
    localStorage.setItem('savedTrips', JSON.stringify(savedTrips));
  }, [savedTrips]);

  const addTripToSaved = (trip) => {
    setSavedTrips((prevTrips) => [...prevTrips, trip]);
  };

  return (      //Component: reInitialises on call, element: renders on call,state is preserved. 
    <Router>
      <Routes>
        <Route exact path="home" element={<HomePage/>} />
        {/* <Route path="login" Component={LoginPage} /> */}
        {/* <Route path="signup" Component={SignupPage} /> */}
        <Route path="/community" 
          element={<CommunityPage addTripToSaved={addTripToSaved} />} 
        />
        <Route path="mytrips" 
          element={<MyTrips savedTrips={savedTrips} />} 
        />
        <Route path="/planning/trip_detail" element={<TripDetailPage />} />
        <Route path="/planning/invite/:id" element={<InvitePage />} />
        <Route path="/preferences/:id" element={<PreferencesPage/>} />
        {/* <Route path="/tinderpreference/:id" element={<TinderPreference/>} /> */}
        <Route path="/tinderpreference/:id" element={<TinderPreference/>} />
        <Route path="/waitingroom/:id" element={<WaitingRoomPage/>} />
        <Route path="/loading/:id" element={<LoadingPage />} />
        <Route path="/results/:id" element={<ResultsPage/>} />   {/* Add ResultsPage route */}
        <Route path="*" element={<HomePage />} />
        <Route path="/planning/invitestart/:id" element={<InviteStart/>} />
        
      </Routes>
    </Router>
  );
}

export default App;
