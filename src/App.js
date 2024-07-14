// import React, { useState }from 'react';
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import HomePage from './pages/home_page/homePage';
// import LoginPage from './pages/login_page/loginPage';
// import SignupPage from './pages/signup_page/signupPage';
// import WelcomePage from './pages/trial/welcomePage';
// import MyTrips from './pages/mytrips_page/mytripsPage';
// import CommunityPage from './pages/community_page/communityPage';
// import TripDetailPage from './pages/planning_page/trip_detail/trip_detail'; // Adjusted import to match the file path and name
// import InvitePage from './pages/planning_page/invite_page/invite_page'; // Corrected import path
// import PreferencesPage from './pages/planning_page/preferences_page/preferences_page'; // Import PreferencesPage
// import TinderPreference from './pages/planning_page/tinder_preference/tinder_preference';
// import WaitingRoomPage from './pages/planning_page/waiting_room/waitingroomPage';
// // import TopBanner from './components/banner';
// import LoadingPage from './pages/planning_page/loading_page/loadingPage';





// function App() {
  
//     // const [dataBase, checkUser] = useState();


//   return (
//         <>
//     <Router>
//             <Routes>
//               <Route path="/home" Component={HomePage} />
//               <Route exact path='/login' Component={LoginPage} />
//               <Route exact path='/signup' Component={SignupPage} />
//               <Route exact path='/welcome' Component={WelcomePage} />
//               <Route exact path='/community' Component={CommunityPage} />
//               <Route exact path='/mytrips' Component = {MyTrips}/>
//               <Route path='/planning/trip_detail' element={<TripDetailPage />} />
//               <Route path='/planning/invite' element={<InvitePage />} /> {/* Corrected path */}
//               <Route path='/preferences' element={<PreferencesPage />} /> {/* Added PreferencesPage route */}
//               <Route path='/tinderpreference' element={<TinderPreference />} />
//               <Route path='/waitingroom' element={<WaitingRoomPage />} />
//               <Route exact path='/loading' Component={LoadingPage} />
//               <Route path='*' element={<HomePage />} />
//             </Routes>
//       </Router>
  


//     </>
    
//   );
// }

// export default App;



//celest new linking loading page to results page
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from './pages/home_page/homePage';
import LoginPage from './pages/login_page/loginPage';
import SignupPage from './pages/signup_page/signupPage';
import WelcomePage from './pages/trial/welcomePage';
import MyTrips from './pages/mytrips_page/mytripsPage';
import CommunityPage from './pages/community_page/communityPage';
import TripDetailPage from './pages/planning_page/trip_detail/trip_detail';
import InvitePage from './pages/planning_page/invite_page/invite_page';
import PreferencesPage from './pages/planning_page/preferences_page/preferences_page';
import TinderPreference from './pages/planning_page/tinder_preference/tinder_preference';
import WaitingRoomPage from './pages/planning_page/waiting_room/waitingroomPage';
import LoadingPage from './pages/planning_page/loading_page/loadingPage';
import ResultsPage from './pages/planning_page/results_page/resultsPage'; // Import ResultsPage

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" Component={HomePage} />
        <Route path="/login" Component={LoginPage} />
        <Route path="/signup" Component={SignupPage} />
        <Route path="/welcome" Component={WelcomePage} />
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
