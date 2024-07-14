import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, updateDoc, deleteDoc, onSnapshot, doc, getDoc, query, where, getDocs, } from "firebase/firestore";

export const useItineraries = () => {

  const [ itineraries, setItineraries ] = useState([]);
  const [ query,       setQuery       ] = useState([]);
  const [ itinerary,   setItinerary   ] = useState({})

  const collectionRef = collection(db, "testPrac")

  const getItineraries = () => {

      return onSnapshot(collectionRef,
        (snapshot) => {
          const itinerariesList = snapshot.docs.map(doc => ({
            id: doc.id, ...doc.data()
          }));
          setItineraries(itinerariesList);
        },
        (error) => {
          console.error("Error Getting Itineraries:",error);
        });

      }


  useEffect(() => {
    const unsubscribe = getItineraries()
    return () => unsubscribe();
  },[])


  const getItinerary = async (id) => {
    const docSnap = await getDoc(doc(db, 'testPrac', id))
    if (docSnap.exists()) {
      const itinerary = docSnap.data();
      console.log(id,"=>",itinerary)
      return itinerary 
    } else {
      console.log("Itinerary does not exist")
      return null
    }
  }

  const addItinerary = async (itinerary) => {
    try {
      const docRef = await addDoc(collectionRef, itinerary)
      await updateDoc(docRef, {id: docRef.id})
      console.log("Itinerary Added")
    } catch (error) {
      console.error("Error Adding Itinerary:",error)
    }
  };

  const deleteItinerary = async (itineraryID) => {
    try {
      const docRef = doc(db,"testPrac", itineraryID)
      await deleteDoc(docRef)
      console.log("Document",itineraryID,"Deleted")
    } catch (error) {
      console.error("Error Deleting Itinerary:",error)
    }
  };

  const updateItinerary = async (itineraryID, itinerary) => {
    try {
      const docRef = doc(db,"testPrac", itineraryID)
      await updateDoc(docRef, itinerary)
      console.log("Itinerary Updated")
    } catch (error) {
      console.error("Error Updating Itinerary:",error)
    }
    
  }

  const queryItinery = async (itineraryID="", title="", dest="", contri="") => {
    let docs = []
    try {
      const queryRef = query(collectionRef,
        (itineraryID != "") && where("id", '==', itineraryID),
        (title != "") && where("Title", "==", title),
        (dest != "") && where("Dest", "==", dest),
        (contri != "") && where("Contributers", "array-contains", contri)
      )
      const snapshot = await getDocs(queryRef)
      snapshot.forEach((doc) => {
        const id = doc.id
        const data = doc.data()
        docs.push({id:id, ...data})
      })
      console.log("Query done:",docs)
      setQuery(docs)

    } catch (error) {
      console.error("Query error:",error)
    }
    return docs
  }

  return { itineraries, query, getItinerary, addItinerary, updateItinerary, deleteItinerary}
}