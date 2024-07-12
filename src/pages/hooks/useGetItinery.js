// This is just for imported functions
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { getDoc, collection, query, where, orderBy, limit, onSnapshot } from "firebase/firestore";
// import { useGetUserInfo } from "./useGetUserInfo";



export const useGetItineraries = () => {

  const [itineraries, setItineraries] = useState([]);

  const itineraryCollectionRef = collection(db, "itineraries");
  // const { userID } = useGetUserInfo();

  const getItineraries = async () => {
    let unsub;
    try {
      const queryItineraries = query(itineraryCollectionRef, 
        // where("Creater", "==", userID),
        orderBy("CreatedAt"),
      );
      unsub = onSnapshot(queryItineraries, (snapshot) => {
        let docs = [];

        snapshot.forEach((itinerary) => {
          const data = itinerary.data()
          const id = itinerary.id

          docs.push({...data, id});
        });
        console.log(docs)
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