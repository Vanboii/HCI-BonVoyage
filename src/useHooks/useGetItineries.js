// This is just for imported functions
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, orderBy, limit, onSnapshot } from "firebase/firestore";
// import { useGetUserInfo } from "./useGetUserInfo";

import { QuerySnapshot } from "firebase/firestore";

export const useGetItineraries = () => {

  const [itineraries, setItineraries] = useState([]);

  const itineraryCollectionRef = collection(db, "itineraries");

  const getItineraries = () => {
    let unsub;
    try {
      const queryItineraries = query(itineraryCollectionRef, 
        // orderBy("CreatedAt"),
      );
      unsub = onSnapshot(queryItineraries, (snapshot) => {
        let docs = [];

        snapshot.forEach((itinerary) => {
          const data = itinerary.data()
          const id = itinerary.id

          docs.push({...data, id});
        });
        // console.log(docs)
        setItineraries(docs);
      });
    } catch (error) {
      console.error(error)
    }
    return () => unsub();
  };

  

  const getItineraries2 = (uID) => {
    let unsub;
    try {
      const itineraryCollectionRef = collection(db, "itineraries");
      const queryItineraries = (uID == "") ? 
        query(itineraryCollectionRef,
        orderBy("CreatedAt"),) :
        query(itineraryCollectionRef,
        where("Contributers", "array-contains", uID),
        orderBy("CreatedAt"),);
      unsub = onSnapshot(queryItineraries, (snapshot) => {
        let docs = [];

        snapshot.forEach((itinerary) => {
          const data = itinerary.data()
          const id = itinerary.id

          docs.push({...data, id});
        });
        // console.log(docs)
        setItineraries(docs);
      });
    } catch (error) {
      console.error(error)
    }
    return () => unsub();
  };

  useEffect(() => {
    getItineraries();
  });

  return { itineraries };

}