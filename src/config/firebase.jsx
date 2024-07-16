// config/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDB9c2cEPRxpYtRXbwY8978_LSIGhhK54g",
  authDomain: "expense-tracker-5b3aa.firebaseapp.com",
  projectId: "expense-tracker-5b3aa",
  storageBucket: "expense-tracker-5b3aa.appspot.com",
  messagingSenderId: "478587025336",
  appId: "1:478587025336:web:b3fc6576d41eae9c1f014d",
  measurementId: "G-WK11WHZN99"
};

const app = initializeApp(firebaseConfig);
export const Auth = getAuth(app);
export const Db = getFirestore(app);
export const Provider = new GoogleAuthProvider();
