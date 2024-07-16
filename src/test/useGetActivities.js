import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, updateDoc, deleteDoc, onSnapshot, doc, getDoc,where, getDocs } from "firebase/firestore";

export const useActivities = () => {

  const [ activities, setActivities ] = useState()

  const collectionRef = collection(db,"testPrac")

  const getActivities = (id) => {
    const activityRef = collection(collectionRef, id, "activities")
    return onSnapshot(activityRef,
      (snapshot) => {
        const activityList = snapshot.docs.map(doc => (
          {id: doc.id, ...doc.data}
        ));
        setActivities(activityList);
      },
      (error) => {
        console.error("Error Getting Activites:",error)
      }
    );
  }

  useEffect(() => {
    const unsubscribe = getActivities()
    return () => unsubscribe();
  },[])

  const getActivity = async (iID,aID) => {
    const docSnap = await getDoc(doc(db, 'testPrac', iID, 'activities', aID))
    if (docSnap.exists()) {
      const activity = docSnap.data()
      console.log( iID,"/",aID,"=>",activity)
      return activity
    } else {
      console.log("Activity does not exist")
      return null
    }
  }

  const addActivity = async(iID, activity) => {
    try {
      const activityRef = collection(db,'testPrac', iID, "activities")
      const docRef = await addDoc(activityRef, activity)
      await updateDoc(docRef, {id: docRef.id})
      console.log("Activity Added:", activity)
    } catch (error) {
      console.error("Error Adding Activity:", error)
    }
  };

  const updateActivity = async (iID, aID, act) => {
    try {
      const docRef = doc(db,"testPrac", iID, "activities",aID)
      await updateDoc(docRef, act)
      console.log("Activity Updated")
    } catch (error) {
      console.error("Error Updating Activity:",error)
    }
  }

  const deleteActivity = async (iID,aID) => {
    try {
      const docRef = doc(db,"testPrac", iID,"activities", aID)
      await deleteDoc(docRef)
      console.log("Document",aID,"Deleted")
    } catch (error) {
      console.error("Error Deleting Activity:",error)
    }
  };  


  return { activities, getActivity, addActivity, updateActivity, deleteActivity}
}

