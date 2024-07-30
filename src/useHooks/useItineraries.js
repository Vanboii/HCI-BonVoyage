import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDoc, updateDoc, deleteDoc, doc, addDoc, onSnapshot } from "firebase/firestore";

export const useItinerary = () => {
  const [itineraries, setItineraries] = useState([])
  const collectionName = "main-PrePlanning"
  const collectionRef = collection(db, collectionName)

  /**
   * @param {object} data - info to be stored
   * @returns {string | null} itinerary ID
   */
  const addItinerary = (data) => {
    addDoc(collectionRef, data).then(
      (ref) => {
        return (ref.id)
      }, (error) => {
        console.error(error)
        return null
      })
  }


  /**
   * @param {string} id  - itinerary ID
   * @returns {Object | null}
   */
  const getItinerary = async (id) => {
    const docSnap = await getDoc(doc(db, collectionName, id))
    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log(id,"=>",data)
      return data 
    } 
    console.log(`Itinerary ${id} does not exist`)
    return null
  }

  /**
   * @param  id - Itinerary ID
   * @param data - use dot reference to update nested data\
   *  -> before  { age: 12, favourites: {color: "yellow", food: "pizza", sport: "cycling" }}\
   *  -> update  { "age": 13, "favourites.color": "blue"}\
   *  -> after  { age: 13, favourites: {color: "blue", food: "pizza", sport: "cycling" }}
   */
  const updateItinerary = async (id,data) => {
    const itineraryRef = doc(db,collectionName, id)
    await updateDoc(itineraryRef, data)
    console.log(`Itinerary ${id} Updated`)
  }

  const deleteItinerary = async (id) => {
    const itineraryRef = doc(db,collectionName, id)
    await deleteDoc(itineraryRef).then(() => {
      console.log(`Itinerary ${id} Deleted`)
    },
    (error) => {
      console.error(`Failed to Delete Itinerary ${id}`,error)
    })
  }

  const queryItinerary = async ({country="", city=""}) => {

  }

  useEffect(()=>{
    const getItineraries = () => {
      return onSnapshot(collectionRef, (snapShot) => {
        const data = snapShot.docs.map(item => (
          {id:item.id, ...item.data()}
        ));
        setItineraries(data)
      }, (error) => {
        console.error("Error Getting Itineraries:", error);
      })
    }
    const sub = getItineraries();
    console.log("useEffect!")
    return sub
  },[])

  return {addItinerary,
          getItinerary,
          updateItinerary,
          deleteItinerary,
          queryItinerary,
          itineraries,}
}

