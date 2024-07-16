
//^ This page is to add new itineraries and to view the list of itineraries.


import React, { useState, useEffect } from "react"; 
// import "../pages/homePage.css"
import { serverTimestamp } from "firebase/firestore";
import { useItineraries } from "./useGetItineraries";


export const MYTRIPS = () => {

  const { itineraries,
    getItinerary, addItinerary, 
    updateItinerary, deleteItinerary } = useItineraries()

  const [ itinerary, setItinerary ] = useState({})
  const [itineraryID, setItineraryID] = useState("")

  const [text1, setText1] = useState();     //^ Title
  const [text2, setText2] = useState();     //^ Dest
  const [text3, setText3] = useState();     //^ Pax

  const [text4, setText4] = useState();     //^ Find By ID
  const [text12, setText12] = useState();   //^ Find By Title

  const [text5, setText5] = useState();     //^ Update Title
  const [text6, setText6] = useState();     //^ Update Dest
  const [text7, setText7] = useState();     //^ Update Pax

  const [text8, setText8] = useState();
  const [text9, setText9] = useState();
  const [text10, setText10] = useState();




  //^template for creating new Itineraries
  const newItinerary = () => { 
    setItinerary({
      Title: text1,
      Dest: text2,
      Pax: text3,
      Creater: null,
      Contributers: [],
      Budget: null,
      Likes: 0,
      Public: false,
    })
  }

  // useEffect(() => {
  //   showItinerary(itinerary)
  // })
  // const showItinerary = (itinerary) => {
  //   const {Title, Dest, Pax,} = itinerary
  //   setText5(Title)
  //   setText6(Dest)
  //   setText7(Pax)
  // }


  //^for displaying full list of itineraries
  const submit = (e) => { 
    e.preventDefault()
    addItinerary({
      Title: text1,
      Dest: text2,
      Pax: text3,
      Creater: null,
      Contributers: [],
      CreatedAt: new Date().toJSON(), 
      EditedAt: new Date().toJSON(),
      Budget: null,
      Likes: 0,
      Public: false,
    })
    setText1("")
    setText2("")
    setText3("")
  }

  //^ for requesting a specific itinerary
  const submit2 = async (e) => {
    e.preventDefault()
    try {
      const data = await getItinerary(text4)

      console.log(data)
      
      const {country, city, numberOfPeople,} = data
      setText5(country)
      setText6(city)
      setText7(numberOfPeople)
    } catch (error) {
      console.error(error)
    }
  }

  //^ For Updating the selected itinerary
  const submit3 = (e) => {
    e.preventDefault()
    updateItinerary(text4,{
      country: text5,
      city: text6,
      numberOfPeople: text7,
    })
    setText5('')
    setText6('')
    setText7('')
  }

  function onDelete(id) {
    console.log("deleting:",id)
    deleteItinerary(id)
  }

  const onSelect = (id) => {
    setText4(id)
    console.log("selected:",id)
    // submit2()
  }

  return (
    <div id="main" className="col centerAlign">

      <div className="row gap2 padding2 ">
        <div className="col centerAlign padding2 border">
          <h2>All Itineraries</h2>
          <div className="col maxWidth gap center">
            <div className="padding gap border">
              {itineraries.map((itinerary) => {
                const {city,country,numberOfPeople,id} = itinerary
                return (
                  <div className="row border gap justify maxWidth">
                    <div className="padding" >
                      <h3>{country}</h3>
                      <p>{city} | {numberOfPeople}</p>
                    </div>
                  </div>
                )
              })}
            </div>
            <form onSubmit={submit} className="col border padding gap">
              <input type="text" onChange={(e) => {setText1(e.target.value)}}
                placeholder="Name" value={text1} required />
              <input type="text" onChange={(e) => {setText2(e.target.value)}}
                placeholder="City" value={text2} required />
              <input type="number" onChange={(e) => {setText3(e.target.value)}}
                placeholder="Number of people going" value={text3} required />
              <button type="submit">Add Itinerary</button>
            </form>
          </div>
        </div>
        <div className="col centerAlign padding2 border">
          <h2>Update Itinerary</h2>
          <form onSubmit={submit2} className="row padding border gap">
            <input type="text" onChange={(e) => {setText4(e.target.value)}}
              placeholder="ID" value={text4} required />
            <input type="text" onChange={(e) => {setText12(e.target.value)}}
              placeholder="Title" value={text12} required />
            <button type="submit">Find Itinerary</button>
          </form>

          <div className="col centerAlign border">
            <form onSubmit={submit3} className="col rightAlign padding gap">
              <div className="row center gap">
                <h3>Title</h3>
                <input type="text" value={text5} 
                  onChange={(e) => {setText5(e.target.value)}} required />
              </div>
              <div className="row center gap">
                <h3>Dest</h3>
                <input type="text" value={text6}
                  onChange={(e) => {setText6(e.target.value)}} required />
              </div>
              <div className="row center gap">
                <h3>Pax</h3>
                <input type="text" value={text7}
                  onChange={(e) => {setText7(e.target.value)}} required />
              </div>
              <div className="row">
                <button type="submit">Update Itinerary</button>
              </div>
            </form>
                <button onClick={() => onDelete(text4)}>Delete</button>
          </div>
        </div>
      </div>

      <div className="maxWidth col leftAlign">
        <form onSubmit={submit3} className="row padding center gap border">
          <h3>Sort By:</h3>   
          <div className="col centerAlign">
            <label for="Title">Title</label>
            <input type="radio" id="Title" name="sortOrder"
              onChange={(e) => {setText8(e.target.value)}} required />
          </div>
          <div className="col centerAlign">
            <label for="Destination">Dest</label>
            <input type="radio" id="Destination" name="sortOrder"
              onChange={(e) => {setText8(e.targelabelt.value)}} required />
          </div>
          <div className="col centerAlign">
            <label for="Pax">Pax</label>
            <input type="radio" id="Pax" name="sortOrder"
              onChange={(e) => {setText8(e.target.value)}} required />
          </div>
          <button type="submit">Refresh</button>
        </form>
      </div>
    </div>
  )
}