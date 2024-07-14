import React, { useEffect, useState } from "react";

import {useGetItineraries} from "../hooks/useGetItineries";
import {useAddItinerary} from "../hooks/useAddItinery";
import {useGetItinerary} from "../hooks/useGetItinery";
import './homePage.css';
import { useGetActivities } from "../hooks/useGetActivities";
import { useAddActivity } from "../hooks/useAddActivity";

export default function DisplayDB() {
  
  const { addItinerary, deleteItinerary } = useAddItinerary();
  const { itineraries } = useGetItineraries();
  const { getItinerary } = useGetItinerary();
  const { activities, getActivities2} = useGetActivities();
  const { addActivity, deleteActivity } = useAddActivity();

  const [tiTle, setTitle] = useState("tiTle");
  const [deStination, setDest] = useState("deStination");
  const [buDget, setBudget] = useState("buDget");

  
  const [id, setID] = useState("");
  const [ itinerary, setItinerary] = useState({})

  function handleAdd(e) {
    e.preventDefault(); 
    const titlE = document.getElementById('ItineraryName').value;
    const destinatioN = document.getElementById('Destination').value;
    const budgeT = document.getElementById('Budget').value;

    addItinerary({
      title: titlE,
      destination: destinatioN,
      pax: budgeT,
    });
  };

  async function handleGet(e) {
    e.preventDefault();
    setID(document.getElementById("itiID").value);
    getItinerary(id,setItinerary).then(() => {
      
    });
    getActivities2(id);
    // const  = itinerarY
    // console.log("123:",itinerarY)
    console.log(
      itinerary
    );
    setTitle(itinerary.ItineraryName)
    setDest(itinerary.Destination)
    setBudget(itinerary.Budget)
    console.log(tiTle,deStination,buDget);
  };

  function addAct(e) {
    e.preventDefault();
    const T = document.getElementById('title').value;
    const A = document.getElementById('address').value;
    const C = document.getElementById('cost').value;
    const D = document.getElementById('date').value;
    const R = document.getElementById('comment').value;

    addActivity(id, { 
      name: T,
      address: A,
      cost: C,
      date: D,
      comments: R,
    })
  }

  function handleDel(e) {
    e.preventDefault()
    setID(document.getElementById("itiID").value);
    deleteItinerary(id)

  }

  useEffect(() => {
    
  },[])

  return (
    <div id='main' >
      <div className="row center gap2">
        <div className="col centerAlign">
        <div className="halfWidth border"> 
          <h2>Create An Itinerary</h2>
          <form className="col centerAlign" onSubmit={handleAdd}>
            <input 
              type="text" 
              id="ItineraryName"
              placeholder="Name" 
              required
            />
            <input 
              type="text" 
              id="Destination"
              placeholder="Destination" 
              required
            />
            <input 
              type="number" 
              id="Budget"
              placeholder="Pax"
              min={0}
              required
            />
            <button type="submit" onClick={handleAdd}>Add Itinerary</button>
            
          </form>
        </div>
        <div className="centerAlign border">
          <h2>Your Itineraries</h2>
          <div className="col padding2 gap">
            {itineraries.map((itinerary) => {
              const { ItineraryName, Destination, Budget, id } = itinerary;
              return (
                <div className="col">
                  <h3>{ItineraryName}</h3>
                  <p>{Destination} <i>${Budget}</i></p>
                  <p><i><u>{id}</u></i></p>
                </div>
              )
            })}
          </div>
        </div>
        </div>
        <div className="col centerAlign ">
          <div className="border">
            <h3>Chosen Itinerary</h3>
            <form className="row">
              <input 
                type="text"
                id="itiID"
              />
              <button type="submit" onClick={handleGet}>Get Itinerary</button>
              <button type="submit" onClick={handleDel}>Del Itinerary</button>
            </form>
            <div>
              <p>ID: {id}</p>
              <p>Title: {tiTle}</p>
              <p>Destination: {deStination}</p>
              <p>Budget: {buDget}</p>
            </div>
          </div>
          <div className="padding border">
            <h2>Activities</h2>
            <div className="col centerAlign border">
              <h3>Add Activity</h3>
              <form className="col centerAlign" onSubmit={addAct}>
                <input type="text" id="title" 
                  placeholder="Activity" 
                  required />
                <input type="text" id="address"
                  placeholder="Location"
                  required />
                <input type="number" id="cost"
                  placeholder="Cost"
                  required />
                <input type="date" id="date"
                  placeholder="Date"
                  required />
                <input type="text" id="comment" 
                  placeholder="Remarks" />
                <button type="submit">Add</button>
              </form>
            </div>
            <div className="col centerAlign">
              {activities.map((activity) => {
                const { name, address, date, cost } = activity;
                return (
                  <div className="border">
                      <h3>Activity: {name}</h3>
                      <p>{date}</p>
                    <p>{address} <i>${cost}</i></p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};