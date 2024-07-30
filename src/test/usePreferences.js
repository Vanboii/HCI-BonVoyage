import { db } from "../firebase";
import { collection, getDoc, updateDoc, deleteDoc, doc, addDoc } from "firebase/firestore";

export const usePreference = () => {
  const collectionRef = collection(db,"main-Preferences")

  const addPreference = async (data) => {
    await addDoc(collectionRef, data)
      .then((ref) => {
        return ref.id
      }, (error) => {
        console.error(error)
      })
  }

  const getPreference = async (id) => {
    const docSnap = await getDoc(doc(db, 'main-PrePlanning', id))
    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log(id,"=>",data)
      return data 
    } 
    console.log(`Itinerary ${id} does not exist`)
    return null
  }

  /**
   * @param  id - Itinerary ID
   * @param data - use dot reference to update nested data\
   *  -> before  { age: 12, favourites: {color: "yellow", food: "pizza", sport: "cycling" }}\
   *  -> update  { "age": 13, "favourites.color": "blue"}\
   *  -> after  { age: 13, favourites: {color: "blue", food: "pizza", sport: "cycling" }}
   */
  const updatePreference = async (id,data) => {
    const itineraryRef = doc(db,"main-PrePlanning", id)
    await updateDoc(itineraryRef, data)
    console.log(`Itinerary ${id} Updated`)
  }

  const deletePreference = async (id) => {
    const itineraryRef = doc(db,"main-PrePlanning", id)
    await deleteDoc(itineraryRef).then(() => {
      console.log(`Itinerary ${id} Deleted`)
    },
    (error) => {
      console.error(`Failed to Delete Itinerary ${id}`,error)
    })
  }

  return {addPreference,getPreference,updatePreference,deletePreference}
}