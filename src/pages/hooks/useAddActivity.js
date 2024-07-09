import React from "react";
import { db } from "../../firebase";
import { addDoc, collection } from "firebase/firestore";
import { useGetUserInfo } from "./useGetUserInfo";

export const useAddActivity = (itineryRef) => {
    const { userID } = useGetUserInfo();
    const activityCollectionRef = collection(db, itineryRef, "Activity")

    const addActivity = async () => {
        await addDoc(activityCollectionRef, {
            name : "",
            address : "",
            cost : "",
            timeStart : "",
            timeEnd : "",
            remarks : "",
        })
    }
    
}