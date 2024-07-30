import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDoc, updateDoc, deleteDoc, doc, addDoc, onSnapshot } from "firebase/firestore";

export const useUsers = () => {

  const [Users, setUsers] = useState([])

  const collectionRef = collection(db,"main-Users")


  const addUser = async (data) => {
    await addDoc(collectionRef, data)
      .then((ref) => {
        return ref.id
      }, (error) => {
        console.error(error)
      })
  }

  const getUser = async (id) => {
    const docSnap = await getDoc(doc(db, 'main-Users', id))
    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log(id,"=>",data)
      return data 
    } 
    console.log(`User ${id} does not exist`)
    return null
  }

  /**
   * @param  id - User ID
   * @param data - use dot reference to update nested data\
   *  -> before  { age: 12, favourites: {color: "yellow", food: "pizza", sport: "cycling" }}\
   *  -> update  { "age": 13, "favourites.color": "blue"}\
   *  -> after  { age: 13, favourites: {color: "blue", food: "pizza", sport: "cycling" }}
   */
  const updateUser = async (id,data) => {
    const userRef = doc(db,"main-PrePlanning", id)
    await updateDoc(userRef, data)
    console.log(`Itinerary ${id} Updated`)
  }

  const deleteUser = async (id) => {
    const userRef = doc(db,"main-PrePlanning", id)
    await deleteDoc(userRef).then(() => {
      console.log(`User ${id} Deleted`)
    },
    (error) => {
      console.error(`Failed to Delete Itinerary ${id}`,error)
    })
  }

  
  useEffect(()=>{
    const getUsers = () => {
      return onSnapshot(collectionRef, (snapShot) => {
        const data = snapShot.docs.map(item => (
          {id:item.id, ...item.data()}
        ));
        setUsers(data)
  
      }, (error) => {
        console.error("Error Getting Users:", error);
      })
    }
    const sub = getUsers();
    return sub
  },[])

  return {addUser,getUser,updateUser,deleteUser, Users}
}