import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TopBanner from './components/banner';

import HomePage from './pages/homePage';
import Test from './pages/login_page/test';
import Test2 from './pages/signup_page/test2';

// import MyTrips from './pages/mytrips_page/mytripsPage';
// import CommunityPage from './pages/community_page/communityPage';
// import TripDetailPage from './pages/planning_page/trip_detail/trip_detail';
// import InvitePage from './pages/planning_page/invite_page/invite_page';
// import PreferencesPage from './pages/planning_page/preferences_page/preferences_page';
// import TinderPreference from './pages/planning_page/tinder_preference/tinder_preference';
// import WaitingRoomPage from './pages/planning_page/waiting_room/waitingroomPage';
// import LoadingPage from './pages/planning_page/loading_page/loadingPage';

import { MYTRIPS } from './test/page1';
import DisplayDB from './pages/database';
import DisplayDB2 from './pages/database2';

import { auth } from './firebase';

function App() {
  
  const [ LoggedIn, setLoggedIn] = useState(false)
  const User = auth.currentUser
  console.log(User)
  return (
    <div id='page'>
    <Router>
      <TopBanner/>

      <Routes>
        <Route exact path="/" Component={MYTRIPS()} />
        <Route path='/login' Component={Test} />
        <Route path='/signup' Component={Test2} />
        {/* <Route path='/trips' Component={MyTrips} />
        <Route path='/community' Component={CommunityPage} />
        <Route path='/details' Component={TripDetailPage} />
          <Route path='/invite' Component={InvitePage} />
          <Route path='/preferences' Component={PreferencesPage} />
          <Route path='/swipe' Component={TinderPreference} />
          <Route path='/waitingroom' Component={WaitingRoomPage} />
          <Route path='/loading' Component={LoadingPage} /> */}
        <Route path='/MYTRIPS' Component={MYTRIPS} />
        <Route path='/database' Component={MYTRIPS} />
        <Route path='/community' Component={DisplayDB2} />
        <Route path='*' Component={HomePage} />

        
      </Routes>

    </Router>
    </div>
  );
}

export default App;
