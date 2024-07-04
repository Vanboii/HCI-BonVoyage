// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB7saEhVsScBEWEmP0LDIQy0Rc7qZQ4a7s",
  authDomain: "hci-bonvoyage.firebaseapp.com",
  projectId: "hci-bonvoyage",
  storageBucket: "hci-bonvoyage.appspot.com",
  messagingSenderId: "877723332161",
  appId: "1:877723332161:web:a4fa09e2f23f5589a1a0c0",
  measurementId: "G-Z19X17D93J"
};

// Initialize Firebase
const firebase_app = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebase_app);

export const auth = getAuth(firebase_app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(firebase_app)




//# hci-bonvoyage.web.app