// This is just for imported functions
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc, collection, query, where, limit, onSnapshot } from "firebase/firestore";



export const useGetItinerary = () => {

  // const [itinerary, setItinerary] = useState({});

  const getItinerary = async (itineraryID, setItinerary) => {
    try {
      console.log(itineraryID);
      const itineraryRef = doc(db,"itineraries", itineraryID);
      const docSnap = await getDoc(itineraryRef);
      console.log("itiref",itineraryID, itineraryRef)
 
      if (docSnap.exists()) {
        // setItinerary(docSnap.data())
        console.log("data Exists", docSnap.data())
        setItinerary(docSnap.data())
        return docSnap.data()
      }
    } catch (error){
      console.error(error)
    }
  };

  


  return { getItinerary };

}