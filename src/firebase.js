// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCIxc3PLOWIno1iD5EMKa-o2HcvafJXMCY",
  authDomain: "incubator-project-3f6be.firebaseapp.com",
  databaseURL: "https://incubator-project-3f6be-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "incubator-project-3f6be",
  storageBucket: "incubator-project-3f6be.firebasestorage.app",
  messagingSenderId: "803402274421",
  appId: "1:803402274421:web:e818106f08aefaddc74a3c",
  measurementId: "G-NYG65VZ3SS"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export { ref, onValue };
