import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

export function useGetActivities() {

  const [activities, setActivities] = useState([])

  const getActivities = async (itineraryID) => {
    let unsubscribe
    try {
      const activitiesRef = collection(db, "itineraries", itineraryID, "activities");
      const activitiesSnap = query(activitiesRef, orderBy("date"));

      unsubscribe = onSnapshot(activitiesSnap, (querySnapshot) => {
        const acts = [];
        querySnapshot.forEach((doc) => {
            acts.push(doc.data());
        });
        setActivities(acts);
      });
    } catch (error) {
      console.error(error)
    }
    return () => unsubscribe();
  };


  const getActivities2 = async (itineraryID) => {
    let unsub;
    try {
      const activitiesRef = collection(db, "itineraries", itineraryID, "activities")
      const activitiesQ = query(activitiesRef, orderBy("date"))
      console.log("acts-Q:",activitiesQ)
      unsub = onSnapshot(activitiesQ, (snapshot) => {
        let acts = [];
        snapshot.forEach((act) => {
          const data = act.data()
          const id = act.id
          console.log("act-id:",id)
          acts.push({id, ...data });
        });
        console.log(acts)
        setActivities(acts);
      });

    } catch (error) {
      setActivities([])
    }
    return () => unsub()
  }

  return { activities, getActivities2 }
}
