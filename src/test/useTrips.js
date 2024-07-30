import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDoc, updateDoc, deleteDoc, doc, addDoc, onSnapshot } from "firebase/firestore";

export const useTrip = () => {

  const collectionRef = collection(db,"main-Trips")

  const addTrip = async (data) => {
    await addDoc(collectionRef, data)
      .then((ref) => {
        return ref.id
      }, (error) => {
        console.error(error)
      })
  }

  const getTrip = async (id) => {
    const docSnap = await getDoc(doc(db, 'main-Trips', id))
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
    const tripRef = doc(db,"main-Trips", id)
    await updateDoc(tripRef, data)
    console.log(`Trip ${id} Updated`)
  }

  const deleteTrip = async (id) => {
    const tripRef = doc(db,"main-Trips", id)
    await deleteDoc(tripRef).then(() => {
      console.log(`Trip ${id} Deleted`)
    },
    (error) => {
      console.error(`Failed to Delete Trip ${id}`,error)
    })
  }

  return {addTrip,getTrip,updateTrip,deleteTrip}
}