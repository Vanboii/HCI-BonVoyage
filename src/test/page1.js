
//^ This page is to add new itineraries and to view the list of itineraries.


import React, { useState, useEffect } from "react"; 
import "../pages/homePage.css"
import { serverTimestamp } from "firebase/firestore";
import { useItineraries } from "./useGetItineraries";


export const MYTRIPS = (isAuth) => {

  const { itineraries, query, 
    getItinerary, addItinerary, 
    updateItinerary, deleteItinerary } = useItineraries()

  const [ itinerary, setItinerary ] = useState({})
  const [text1, setText1] = useState();
  const [text2, setText2] = useState();
  const [text3, setText3] = useState();

  const [text4, setText4] = useState();

  const [text5, setText5] = useState();
  const [text6, setText6] = useState();
  const [text7, setText7] = useState();

  const [text8, setText8] = useState();
  const [text9, setText9] = useState();
  const [text10, setText10] = useState();
  // const [text12, setText12] = useState();



//^template for creating new Itineraries

const newItinerary = () => { 
    setItinerary({
      Title: text1,
      Dest: text2,
      Pax: text3,
      Creater: null,
      Contributers: [],
      CreatedAt: serverTimestamp(),
      EditedAt: serverTimestamp(),
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
      data.CreatedAt = Date(data.CreatedAt)
      data.EditedAt = Date(data.EditedAt)
      console.log(data)
      
      const {Title, Dest, Pax,} = data
      setText5(Title)
      setText6(Dest)
      setText7(Pax)
    } catch (error) {
      console.error(error)
    }
    
    
  }
  //^ For Updating the selected itinerary
  const submit3 = (e) => {
    e.preventDefault()
    updateItinerary(text4,{
      Title: text5,
      Dest: text6,
      Pax: text7,
    })
    setText5('')
    setText6('')
    setText7('')
  }

  const onDelete = (id) => {

    deleteItinerary(id)
  }
  const onSelect = (id) => {
    setText4(id)
    submit2()
  }
    


  return (
    <div id="main" className="col centerAlign">
      <div className="row gap2 padding2">
        <div className="col centerAlign">
          <h2>My Itineraries</h2>
          <div className="row center">
            <div className="padding gap border">
              {itineraries.map((itinerary) => {
                const {Title,Dest,Pax,id} = itinerary
                return (
                  <div className="row border gap justify maxWidth">
                    <div className="col padding" >
                      <h3>{Title}</h3>
                      <p>{Dest} | {Pax}</p>
                    </div>
                    <button>Delete</button>
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
        <div className="col centerAlign border padding">
        <h2>Update Itinerary</h2>
          <form onSubmit={submit2} className="row padding border gap">
              <input type="text" onChange={(e) => {setText4(e.target.value)}}
                placeholder="ID" value={text4} required />
              <button type="submit">Get Itinerary</button>
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
              <button type="submit">Update Itinerary</button>
            </form>
            
          </div>
        </div>
      </div>
      <div>
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