import React, {useState} from "react";

import { useItineraries } from "./useGetItineraries";

export const newPage = () => {

  const { itineraries, addItinerary,deleteItinerary,updateItinerary} = useItineraries()

  const [title, setTitle] = useState("")
  const [dest, setDest] = useState("")
  const [pax, setPax] = useState("")

  const handleAdd = () => {


  }



  return (
    <div id="main">
      <div className="content">
        <h2>Itineraries</h2>
        <div>
          {itineraries.map((itinerary) => {
            const { Title, Dest, Pax, CreatedAt} = itinerary
            return (
              <div>
                <h3>{Title}</h3>
                <p>{Dest}: {Pax}</p>
                <p>{CreatedAt}</p>
              </div>
            )
          })}
        </div>
      </div>
      <div className="Form">
        <form className="col centerAlign" onSubmit={handleAdd}>
          <input 
            type="text" 
            onChange={(e) => {setTitle(e.target.value)}}
            placeholder="Name" 
            required
          />
          <input 
            type="text" 
            onChange={(e) => {setDest(e.target.value)}}
            placeholder="Destination" 
            required
          />
          <input 
            type="number" 
            onChange={(e) => {setPax(e.target.value)}}
            placeholder="Pax" min={1}
            required
          />
          <button type="submit" onClick={handleAdd}>Add Itinerary</button>
          
        </form>
      </div>
    </div>
  )
}