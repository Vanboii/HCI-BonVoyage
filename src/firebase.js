
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCWfzHRAMccFuUYM7GhPssyBjml-b4csBA",
  authDomain: "bonvoyage-ab-testing.firebaseapp.com",
  projectId: "bonvoyage-ab-testing",
  storageBucket: "bonvoyage-ab-testing.appspot.com",
  messagingSenderId: "1014608347865",
  appId: "1:1014608347865:web:f191eec1d4ad8d40b974c8",
  measurementId: "G-624SK77LR3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

//#  https://bonvoyage-ab-testing.web.app/