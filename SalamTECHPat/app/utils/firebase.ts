// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCLICFyVASEMmeeVPacEghy-M267Nde86c",
  authDomain: "salamtech-d2c77.firebaseapp.com",
  projectId: "salamtech-d2c77",
  storageBucket: "salamtech-d2c77.firebasestorage.app",
  messagingSenderId: "24643262603",
  appId: "1:24643262603:web:e8560b5b758ee812e15c8e",
  measurementId: "G-E2DJE5E1C2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);