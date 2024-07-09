import React, { useState } from "react";

import {useGetItineraries} from "./hooks/useGetItinery";
import {useAddItinerary} from "./hooks/useAddItinery";
import './homePage.css';


export default function DisplayDB() {
  
    const { addItinerary } = useAddItinerary();
    const { itineraries } = useGetItineraries();

    const [title, setTitle] = useState("");
    const [destination, setDest] = useState("");
    const [budget, setBudget] = useState(0);

    function handleAdd(e) {
        e.preventDefault();

        addItinerary({
            title: title,
            destination: destination,
            budget: budget,
        });
    };

    return (
        <div id='main' className="col centerAlign">
          <div className="halfWidth border"> 
            <h2>Create An Itinerary</h2>
            <form className="col centerAlign" onSubmit={handleAdd}>

              <input 
                type="text" 
                placeholder="Name" 
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <input 
                type="text" 
                placeholder="Destination" 
                onChange={(e) => setDest(e.target.value)}
                required
              />
              <input 
                type="number" 
                placeholder="Budget"
                min={0}
                onChange={(e) => setBudget(e.target.value)}
                required
              />

              <button type="submit">Add Itinerary</button>
            </form>
          </div>
          <div className="halfWidth centerAlign border">
            hello
            <h2>Your Itineraries</h2>
              <ul className="col centerAlign">
                {itineraries.map((itinerary) => {
                  const { ItineraryName, Destination, Budget } = itinerary;
                  return (
                    <li className="padding halfWidth border">

                      <h3> {ItineraryName} </h3>
                      {Destination}  <i>${Budget}</i>

                    </li>
                  )
                })}
              </ul>
          </div>
          <div className="verticleGap">
            <div>hehe</div>
            <div>hehe</div>
            <div>hehe</div>
            <div>hehe</div>
            <div>hehe</div>
            <div>hehe</div>
            <div>hehe</div>
            <div>hehe</div>
            <div>hehe</div>
            <div>hehe</div>
            <div>hehe</div>
            <div>hehe</div>
            <div>hehe</div>
            <div>hehe</div>
            <div>hehe</div>
            <div>hehe</div>
            <div>hehe</div>
            <div>hehe</div>
          </div>
          
        </div>




    );
};