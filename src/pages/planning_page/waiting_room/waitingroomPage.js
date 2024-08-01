import TopBanner from "../../../components/banner";
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './waitingroomPage.css';

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
import { useItineraries } from "../../../test/useGetItineraries";

function WaitingRoom() {

  const [maxUsers , setMax] = useState();
  const [Users, setUsers] = useState([]);


  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  const { id } = useParams()
  const navigate = useNavigate();
  const { getItinerary, getPreferences } = useItineraries()



  
  const getPax = async () => {
    const doc = await getItinerary(id)
    const max = doc.numberOfPeople
    console.log("Max:", max)
    setMax(max)
  }

  const getDone = async () => {
    const out = await getPreferences(id)
    setUsers(out)
    console.log("Completed Users:",out)
  }
  getPax()
  const userStatuses = Array(maxUsers).fill('Waiting for response...');

  useEffect(() => {
    
    getDone()

    

    // const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    // setUsers(storedUsers);
    // if (storedUsers.length >= maxUsers) {
    //   navigate(`/loading/${id}`);
    // }

  }, [Users]);

  Users.forEach((user, index) => {
    userStatuses[index] = `${user.displayName} is ready for the trip!`;
  });


  return (
    <>
      <TopBanner/>
        <div className="content">
          <div>
            <p className="progress">{Users.length}/{maxUsers} has filled in their preference</p>
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