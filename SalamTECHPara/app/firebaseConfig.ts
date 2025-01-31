import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCLICFyVASEMmeeVPacEghy-M267Nde86c",
    authDomain: "salamtech-d2c77.firebaseapp.com",
    projectId: "salamtech-d2c77",
    storageBucket: "salamtech-d2c77.firebasestorage.app",
    messagingSenderId: "24643262603",
    appId: "1:24643262603:web:e8560b5b758ee812e15c8e",
    measurementId: "G-E2DJE5E1C2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app; 