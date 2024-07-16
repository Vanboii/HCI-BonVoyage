import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, doc, setDoc, getDoc, getDocs, updateDoc} from "firebase/firestore";

export const useUsers = () => {
  
  const userRef = collection(db, "Users")
  const [userList, setUserList] = useState([])    //# can possibly delete this & update findUsers()

  const createUser = async ({ uID, displayName, email, fname, lname }) => {
    console.log("CreatingUser:",[uID,displayName,email,fname,lname])
    try {
      await setDoc(doc(db,"Users", uID), {
        displayName : displayName,
        email : email,
        fname : fname,
        lname : lname,
        friends : []
      })
      console.log("Done. User Created.")
    } catch (error) {
      console.error(error)
    }
  }

  const findUsers = async ({ displayName, email, fname, lname }) => {
    let users = []
    let userQuery = userRef
    if (displayName) {
      userQuery = query(userRef, where("displayName", ">=", displayName));
    } 
    if (email) {
      userQuery = query(userRef, where("email", "==", email));
    }
    if (fname) {
      userQuery = query(userRef, where("fname", ">=", fname));
    }
    if (lname) {
      userQuery = query(userRef, where("lname", ">=", lname));
    }
    console.log("Finding Users ...")
    try {
      const querySnapshot = await getDocs(userQuery);
      querySnapshot.forEach((doc) => {
        users.push({ id:doc.id, ...doc.data() });
      });
      setUserList(users)
      console.log(`Users Found: ${users}`)
    } catch (error) {
      console.error(error)
    }
    return users
  }

  const findUsers2 = async ( type, input) => {
    let users = []
    let userQuery = userRef
    if (type in ["email","displayName","lname","fname"] && input) {
      if (type === "email") {
        userQuery = query(userRef, where(type, "==", input));
      } else {
        userQuery = query(userRef, where(type, ">=", input));
      }
    } 
  
    console.log("Finding Users ...")
    try {
      const querySnapshot = await getDocs(userQuery);
      querySnapshot.forEach((doc) => {
        users.push({ id:doc.id, ...doc.data() });
      });
      setUserList(users)
      console.log(`Users Found: ${users}`)
    } catch (error) {
      console.error(error)
    }
    return users
  }

  const getUser = async ({uID}) => {
    console.log(`Getting User: ${uID} ...`)
    try {
      const userRef = doc(db,"Users", uID)
      const docSnap = await getDoc(userRef)
      const user = docSnap.data()
      console.log(`Done. User: ${uID} =>`,user)
      return { user, userRef }
    } catch (error) {
      console.error(error)
      return null
    }
  }
  
  const updateUser = async ({ uID, displayName, fname, lname}) => {
    console.log(`Updating User: ${uID}`)
    try {
      const {userRef} = getUser(uID)
      if (displayName) {
        await updateDoc(userRef, {displayName: displayName});
      }
      if (fname) {
        await updateDoc(userRef, {fname: fname});
      }
      if (lname) {
        await updateDoc(userRef, {lname: lname});
      }
      console.log("Done. User Updated.")
    } catch (error) {
      console.error(error)
    }
  }

  const addFriend = async ({ uID, friendID}) => {
    console.log(`Adding ${friendID} to User:${uID}.friends`)
    try {
      const {user,userRef} = getUser(uID)
      await updateDoc(userRef, {
        friends: [friendID, ...user.friends]
      });
      console.log("Done. Friend Added.")
    } catch (error) {
      console.error(error)
    }
  }

  return { userList, createUser, getUser, findUsers, findUsers2, updateUser, addFriend }
}