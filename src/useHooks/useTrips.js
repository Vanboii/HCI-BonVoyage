import { db } from "../firebase";
import { doc, setDoc, getDoc, updateDoc, deleteDoc, } from "firebase/firestore";
import { getIdToken } from "firebase/auth";

export const useTrip = () => {
  const collectionName = "main-Trips"

  /**
   * @param {string} id - Itinerary/Preferences/Trip ID
   * @param {object} data Trip Details
   * @returns {boolean} 
   */
  const addTrip = (id, data) => {
    setDoc(doc(db, collectionName, id), data).then(
      () => {
        return true
      }, (error) => {
        console.error(error)
        return false
      }
    );
  };

  /**
   * @param {string} id - itinerary ID
   * @returns {object|null} 
   */
  const getTrip = async (id) => {
    const docSnap = await getDoc(doc(db, collectionName, id))
    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log(id,"=>",data)
      return data
    } 
    console.log(`Trip ${id} does not exist`)
    return null
  }

  /**
   * @param  id - Trip ID
   * @param data - use dot reference to update nested data\
   *  -> before  { age: 12, favourites: {color: "yellow", food: "pizza", sport: "cycling" }}\
   *  -> update  { "age": 13, "favourites.color": "blue"}\
   *  -> after  { age: 13, favourites: {color: "blue", food: "pizza", sport: "cycling" }}
   */
  const updateTrip = async (id,data) => {
    const tripRef = doc(db, collectionName, id)
    await updateDoc(tripRef, data).then(
      (success) => {
        return true
      }, (error) => {
        console.error(`Failed to Update ${id}`,error)
        return false
      }
    )
    console.log(`Trip ${id} Updated`)
  }

  const deleteTrip = (id) => {
    const Ref = doc(db,collectionName, id)
    deleteDoc(Ref).then(
      () => console.log(`Trip ${id} Deleted`),
      (error) => console.error(`Failed to Delete ${id}`,error)
    );
  }


  return {addTrip, 
          getTrip, 
          // updateTrip, 
          deleteTrip}
}