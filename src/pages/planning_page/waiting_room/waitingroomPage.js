import TopBanner from "../../../components/banner";
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './waitingroomPage.css';

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
import { useItineraries } from "../../../test/useGetItineraries";

function WaitingRoom() {


  const [users, setUsers] = useState([]);
  //const maxUsers = 5; // Set the number of users expected to join


  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  const { id } = useParams()
  const { getItinerary } = useItineraries()
  
  const itinerary = getItinerary(id);
  const maxUsers = itinerary.numberOfPeople
  setUsers(itinerary)


  const navigate = useNavigate();
  const userStatuses = Array(maxUsers).fill('Waiting for response...');






  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    setUsers(storedUsers);
    if (storedUsers.length >= maxUsers) {
      navigate(`/loading/${id}`);
    }
  }, [navigate]);

  users.forEach((user, index) => {
    userStatuses[index] = `${user} is ready for the trip!`;
  });

  return (
    <>
      {/* <TopBanner/> */}
        <div className="content">
          <div>
            <p className="progress">{users.length}/{maxUsers} has filled in their preference</p>
          </div>
          <div className="status">
            <h2>Status:</h2>
            {userStatuses.map((status, index) => (
              <div key={index} className="statusItem">
                {status}
              </div>
            ))}
          </div>
        </div>
        <button className="button" onClick={() => navigate('/loading')}>Start Generating</button>
    </>

  );
}

export default WaitingRoom;