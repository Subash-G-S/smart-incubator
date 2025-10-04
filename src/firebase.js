import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCIxc3PLOWIno1iD5EMKa-o2HcvafJXMCY",
  authDomain: "incubator-project-3f6be.firebaseapp.com",
  databaseURL: "https://incubator-project-3f6be-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "incubator-project-3f6be",
  storageBucket: "incubator-project-3f6be.appspot.com",
  messagingSenderId: "803402274421",
  appId: "1:803402274421:web:e818106f08aefaddc74a3c",
  measurementId: "G-NYG65VZ3SS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Anonymous sign-in
const auth = getAuth(app);
signInAnonymously(auth)
  .then(() => {
    console.log("✅ Signed in anonymously");
  })
  .catch((error) => {
    console.error("❌ Auth error:", error.message);
  });

// Export Realtime Database
export const db = getDatabase(app);
