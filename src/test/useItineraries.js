import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDoc, updateDoc, deleteDoc, doc, addDoc, onSnapshot } from "firebase/firestore";

export const useItinerary = () => {

  const [itineraries, setItineraries] = useState([])
  const collectionRef = collection(db,"main-PrePlanning")

  const addItinerary = async (data) => {
    await addDoc(collectionRef, data)
      .then((ref) => {
        return ref.id
      }, (error) => {
        console.error(error)
      })
  }

  const getItinerary = async (id) => {
    const docSnap = await getDoc(doc(db, 'main-PrePlanning', id))
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
    const itineraryRef = doc(db,"main-PrePlanning", id)
    await updateDoc(itineraryRef, data)
    console.log(`Itinerary ${id} Updated`)
  }

  const deleteItinerary = async (id) => {
    const itineraryRef = doc(db,"main-PrePlanning", id)
    await deleteDoc(itineraryRef).then(() => {
      console.log(`Itinerary ${id} Deleted`)
    },
    (error) => {
      console.error(`Failed to Delete Itinerary ${id}`,error)
    })
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

    return sub
  },[])

  // const [queries, setQueries] = useState([]);
  const [country,setCountry] = useState(null);
  const [city,setCity] = useState(null);
  const [pax,setPax] = useState(null);
  const [owner,setOwner] = useState(null);

  // const queryItineraries = ({country=null, city=null, pax=null, owner=null}) => {
  //   let queryRef = collectionRef
  //   if (country !== null) {
  //     queryRef = query(queryRef, where("country", "==", country));
  //   }
  //   if (city !== null) {
  //     queryRef = query(queryRef, where("city", "==", city));
  //   }
  //   if (pax !== null) {
  //     queryRef = query(queryRef, where("noOfPeople", "==", pax));
  //   }
  //   if (owner !== null) {
  //     queryRef = query(queryRef, where("owner", "==", owner));
  //   }
  //   return onSnapshot(queryRef,(snapshot) => {
  //     const queryList = snapshot.docs.map(doc => (
  //       {id:doc.id,...doc.data()}
  //     ))
  //     setQueries(queryList)
  //   }, (error) => {
  //     console.error("Query Failed:",error)
  //   })
  // }

  return {addItinerary,getItinerary,updateItinerary,deleteItinerary,itineraries}
}