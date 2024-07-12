

import { db } from "../../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useGetUserInfo } from "./useGetUserInfo";

/**
* Used to add an itinerary to the database
*
* @param {type}  title   name of itinerary.
* @param {type}  destination         destination of itinerary.
* @param {type}  budget  total budget.
*/
export  function useAddItinerary() {

  const itineraryCollectionRef = collection(db,"itineraries");
  const { userID } = useGetUserInfo();
  
  const addItinerary = async ({
      //# Data to be added
      title,
      destination,
      budget,
    }) => {
    await addDoc(itineraryCollectionRef, {
      Creater: userID,
      Contributors : [],
      ItineraryName : title,
      ItineraryID : "",
      CreatedAt : serverTimestamp(),
      EditedAt : serverTimestamp(),
      Destination : destination,
      Budget : budget,
      Likes : 0,
      Public : false,
      ViewableByFriends : true,
    })
  };
  return { addItinerary }
    
}