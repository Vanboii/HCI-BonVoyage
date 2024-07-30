import TopBanner from "../../../components/banner";
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './waitingroomPage.css';

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
import { useItinerary } from "../../../useHooks/useItineraries";
import { usePreference } from "../../../useHooks/usePreferences";

function WaitingRoom() {

  const [maxUsers , setMax] = useState(1);
  const [Users, setUsers] = useState([]);


  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  const { id } = useParams()
  const navigate = useNavigate();
  const { getItinerary } = useItinerary();
  const { getPreference } = usePreference();
  const [update, triggerUpdate] = useState(false);


  
  const getPax = async () => {
    const doc = await getItinerary(id)
    const max = doc.numberOfPeople
    console.log("Max:", max)
    setMax(max)
  }

  const getDone = async () => {
    const out = await getPreference(id)
    let userList = []
    Object.keys(out).sort().forEach(value => {
      userList.push({
        displayName: out[value].displayName,
        isdone: out[value].isdone,
      }

       )
    })
    setUsers(userList)
    console.log("Users:",userList)
  }
  getPax()
  const userStatuses = Array(maxUsers).fill('Waiting for response...');

  useEffect(() => {
    
    getDone()


    // Set up the interval
    const intervalId = setInterval(() => {
      triggerUpdate(!update);
    }, 5000); // Executes every 5000ms (5 second)


    // Cleanup function to clear the interval
    return () => clearInterval(intervalId);
    

    // const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    // setUsers(storedUsers);
    // if (storedUsers.length >= maxUsers) {
    //   navigate(`/loading/${id}`);
    // }

  }, [update]);

  Users.forEach((user, index) => {
    userStatuses[index] = user.isdone ? `${user.displayName} is ready for the trip!` : `${user.displayName} is still preparing ...` ;
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