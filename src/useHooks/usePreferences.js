import { db } from "../firebase";
import { doc, setDoc, getDoc, updateDoc, deleteDoc, } from "firebase/firestore";


export const usePreference = () => {
  const collectionName = "main-Preferences"
  const Options = {merge: true}
  

  /**
   * @param {string} id  - itinerary ID
   * @param {object} data - info to be stored
   * @returns {boolean}
   */
  const addPreference = (id, data) => {
    setDoc(doc(db, collectionName, id), data, Options).then(
      () => {
        return true
      }, (error) => {
        console.error(error)
        return false
      }
    )
  }

  /**
   * @param {string} id  - itinerary ID
   * @returns {Object | null}
   */
  const getPreference = async (id) => {
    const docSnap = await getDoc(doc(db, collectionName, id))
    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log(id,"=>",data)
      return data 
    } 
    console.log(`Itinerary ${id} does not exist`)
    return null
  }

  /**
   * @param {string} id - Itinerary ID
   * @param {object} data - use dot reference to update nested data\
   *  -> before  { age: 12, favourites: {color: "yellow", food: "pizza", sport: "cycling" }}\
   *  -> update  { "age": 13, "favourites.color": "blue"}\
   *  -> after  { age: 13, favourites: {color: "blue", food: "pizza", sport: "cycling" }}
   * @returns {boolean}
   */
  const updatePreference = async (id,data) => {
    const ref = doc(db, collectionName, id)
    await updateDoc(ref, data).then(
      (success) => {
        return true
      }, (error) => {
        console.error(`Failed to Update ${id}`,error)
        return false
      }
    )
    console.log(`Trip ${id} Updated`)
  }

  const deletePreference = async (id) => {
    const ref = doc(db, collectionName, id)
    await deleteDoc(ref).then(
      () => {
        console.log(`Pref ${id} Deleted`)
      }, (error) => {
        console.error(`Failed to Delete Pref ${id}`,error)
      }
    )
  }

  return {addPreference,getPreference,updatePreference,deletePreference}
}