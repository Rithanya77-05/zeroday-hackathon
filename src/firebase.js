// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAXs7-TlVu2N0t2IzQNvDbAlip-48ixrQw",
  authDomain: "sandy12-dcbc8.firebaseapp.com",
  projectId: "sandy12-dcbc8",
  storageBucket: "sandy12-dcbc8.firebasestorage.app",
  messagingSenderId: "469395398222",
  appId: "1:469395398222:web:983f1ad087f2f2b7212d1f",
  measurementId: "G-B42M2ZHB3E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth }; 