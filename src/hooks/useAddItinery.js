import { db } from "../firebase";
import { doc, addDoc, deleteDoc, collection, serverTimestamp, updateDoc } from "firebase/firestore";
// import { useGetUserInfo } from "./useGetUserInfo";
import { useGetUserInfo, useGetUserInfo2 } from "./useGetUserInfo";
// import { useSearchParams } from "react-router-dom";
// import { useState, useEffect } from "react";


/**
* Used to add an itinerary to the database
*
* @param {type}  title   name of itinerary.
* @param {type}  destination         destination of itinerary.
* @param {type}  budget  total budget.
*/
export function useAddItinerary() {
  const { userID } = useGetUserInfo();
  const itineraryCollectionRef = collection(db,"itineraries");

  const addItinerary = async ({
    //# Data to be added
    title,
    destination,
    pax,

  }) => {
    const docRef = await addDoc(itineraryCollectionRef, {
      Creater: userID,
      Contributors : [],
      ItineraryName : title,
      CreatedAt : serverTimestamp(),
      EditedAt : serverTimestamp(),
      Destination : destination,
      Pax: pax,
      Budget : null,
      Likes : 0,
      Public : false,
      ViewableByFriends : true,
    })

    await updateDoc(docRef, {id: docRef.id});
    console.log(docRef,docRef.id)
  };

  const deleteItinerary = async (itineraryID) => {
    try {
      const activityRef = doc(db,"itineraries", itineraryID)
      await deleteDoc(activityRef).finally()

    } catch (error) {
      console.error(error)
    }
  }
  
  return { addItinerary, deleteItinerary }
    
}