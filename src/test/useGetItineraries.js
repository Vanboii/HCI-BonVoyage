import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, updateDoc, deleteDoc, onSnapshot, doc, getDoc, query, where, getDocs, limit, setDoc, } from "firebase/firestore";

export const useItineraries = () => {

  const [ itineraries, setItineraries ] = useState([]);
  const [ queries,     setQueries     ] = useState([]);
  const [ itinerary,   setItinerary   ] = useState({});

  const [id, setID] = useState("")
  const [title,setTitle] = useState("")
  const [dest, setDest] = useState("")
  const [contri,setContri] = useState("")

  const collectionRef = collection(db, "testPrac2")

  const getItineraries = () => {

    return onSnapshot(collectionRef,
      (snapshot) => {
        const itinerariesList = snapshot.docs.map(doc => (
          {id: doc.id, ...doc.data()}
        ));
        setItineraries(itinerariesList);
        console.log("All Itineraries:",itinerariesList)
      },
      (error) => {
        console.error("Error Getting Itineraries:",error);
      }
    );
  }

  const queryItinery = (itineraryID="", title="", dest="", contri="") => {

    let queryRef = collectionRef; // Start with the collection reference

    if (itineraryID !== "") {
        queryRef = query(queryRef, where("id", ">=", itineraryID));
    }
    if (title !== "") {
        queryRef = query(queryRef, where("Title", ">=", title));
    }
    if (dest !== "") {
        queryRef = query(queryRef, where("Dest", ">=", dest));
    }
    if (contri !== "") {
        queryRef = query(queryRef, where("Contributers", "array-contains", contri));
    }
    // queryRef = query(collectionRef,
    //   (itineraryID != "") && where("id", '==', itineraryID),
    //   (title != "") && where("Title", "==", title),
    //   (dest != "") && where("Dest", "==", dest),
    //   (contri != "") && where("Contributers", "array-contains", contri)
    // )
    return onSnapshot(queryRef,
      (snapshot) => {
        const queryList = snapshot.docs.map(doc => (
          {id: doc.id, ...doc.data()}
        ));
        setQueries(queryList);
        console.log("Query:",itineraryID,title,dest,contri,queryList)
      },
      (error) => {
        console.error("Error Getting Itineraries:",error);
      }
    );
  }


  useEffect(() => {
    const unsubscribe = getItineraries()
    const unsubscribe2 = queryItinery(id,title,dest,contri)
    return () => {
      unsubscribe();
      unsubscribe2();
    }
  },[])

  const getItinerary = async (id) => {
    console.log("Getting Itinerary:",id)
    const docSnap = await getDoc(doc(db, 'testPrac2', id))
    if (docSnap.exists()) {
      const itinerary = docSnap.data();
      console.log(id,"=>",itinerary)
      return itinerary 
    } else {
      console.log("Itinerary does not exist")
      return null
    }
  }

  const getItinerary2 = async (title) => {
    const q = query(collectionRef, where("Title",">=",title))
    const querySnapshot = await getDocs(q)
    const docs = []
    querySnapshot.forEach((doc) => {
      docs.push({id:doc.id,...doc.data()})
    })
    return docs
  }

  const addItinerary = async (itinerary) => {
    let docRef
    try {
      docRef = await addDoc(collectionRef, itinerary)
      await updateDoc(docRef, {id: docRef.id})
      console.log("Itinerary Added:",itinerary)
    } catch (error) {
      console.error("Error Adding Itinerary:",error)
    }
    return docRef.id
  };

  const updateItinerary = async (itineraryID, itinerary) => {
    console.log("Attempting to update:",itineraryID, itinerary)
    try {
      const docRef = doc(db,"testPrac2", itineraryID)
      await updateDoc(docRef, itinerary)
      console.log("Itinerary Updated")
      // getItinerary(itineraryID)
    } catch (error) {
      console.error("Error Updating Itinerary:",error)
    }
  }

  const deleteItinerary = async (itineraryID) => {
    try {
      const docRef = doc(db,"testPrac", itineraryID)
      await deleteDoc(docRef)
      console.log("Document",itineraryID,"Deleted")
    } catch (error) {
      console.error("Error Deleting Itinerary:",error)
    }
  };

  const addPreferences = async (itineraryID, uID, data) => {
    try {
      const docRef = doc(db,"testPrac2", itineraryID, "userPreferences",uID)
      await setDoc(docRef, data)
      console.log("Document uploaded",data)
    } catch (error) {
      console.error("Error Adding Preferences:",error)
    }
  }

  const updatePreferences = async (itineraryID, uID, data) => {
    console.log(`Updating ${itineraryID}\nWith ${uID} Preferences: ${data}`)
    try {
      const docRef = doc(db,"testPrac2", itineraryID, "userPreferences", uID)
      await updateDoc(docRef, data)
      console.log("User Preferences Updated:", data)
    } catch (error) {
      console.error("Error Updating Preferences:",error)
    }
  }

  const getPreferences = async (itineraryID) => {
    console.log("Getting list of users who completed.")
    try {
      let docs = [];
      const collRef = collection(db,"testPrac2", itineraryID, "userPreferences")
      const snapshot = await getDocs(collRef)
      snapshot.forEach((doc) => {
        docs.push({uid: doc.id, ...doc.data()})
      })
      console.log("User Preferences collected:", snapshot.size)
      return docs
    } catch (error) {
      console.error("Error collecting Preferences:",error)
    }

  }

  return { itineraries, queries, getItinerary, 
    addItinerary, updateItinerary, deleteItinerary, 
    addPreferences, getPreferences, updatePreferences}
}