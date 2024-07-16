
import { db } from "../firebase";
import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";


export const useAddActivity = () => {


  const addActivity = async (itineraryID,
    { name,
      address,
      cost,
      date,
      comments="",
    }
  ) => {
    const activitiesRef = collection(db, "itineraries", itineraryID, "activities") 
    const docRef = await addDoc(activitiesRef, {
      name : name,
      address : address,
      cost : cost,
      date: date,
      remarks : comments,
    })
    await updateDoc(docRef, {id: docRef.id})
  };

  const deleteActivity = async (itineraryID,activityID) => {
    try {
      const activityRef = doc(db,"itineraries", itineraryID,"activities", activityID)
      await deleteDoc(activityRef)
    } catch (error) {
      console.error(error)
    }

  }


  return { addActivity, deleteActivity}
}