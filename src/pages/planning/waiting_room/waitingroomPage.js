import TopBanner from "../../../components/banner";
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './waitingroomPage.css';

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
import { useItinerary } from "../../../useHooks/useItineraries";
import { usePreference } from "../../../useHooks/usePreferences";
import { useTrips } from "../../../useHooks/useTrips";

function WaitingRoom() {

  const [maxUsers , setMax] = useState(1);
  const [Users, setUsers] = useState([]);


  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  const { id } = useParams()
  const navigate = useNavigate();
  const { getItinerary } = useItinerary();
  const { listenPreference, } = usePreference();
  const { addTrip } = useTrips();
  // const [update, triggerUpdate] = useState(false);
  const [preferences, setPreferences] = useState({})

  const getPax = async () => {
    const doc = await getItinerary(id)
    const max = doc.numberOfPeople
    console.log("Max:", max)
    setMax(max)
  }

  const handleSubmit = () => {


    navigate(`/loading/${id}`)
  }

  useEffect(() => {
    getPax()
    const unsub = listenPreference(id,setPreferences);
    return unsub
  },[id])

  useEffect(() => {
    if (Object.keys(preferences).length > 0) {
      let userList = []
      Object.keys(preferences).sort().forEach(value => {
        userList.push({
          displayName: preferences[value].displayName,
          isdone: preferences[value].isdone,
        })
      })
      setUsers(userList)
    }
  },[preferences])

  const userStatuses = Array(maxUsers).fill('Waiting for response...');

  Users.forEach((user, index) => {
    userStatuses[index] = user.isdone ? `${user.displayName} is ready for the trip!` : `${user.displayName} is still preparing ...` ;
  });

  return (
    <>
      <TopBanner/>
        <div className="content">
          <div>
            <p className="progress">{Users.length}/{maxUsers} has filled in their preference</p>
            <button className="button" onClick={() => navigate(`/loading/${id}`)}>Start Generating</button>
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
    </>

  );
}

export default WaitingRoom;