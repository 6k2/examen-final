import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCNTPdVhKjIYEBTdsQ11B61RRsyfTDiFYg",
  authDomain: "examen-final-3f37e.firebaseapp.com",
  projectId: "examen-final-3f37e",
  storageBucket: "examen-final-3f37e.firebasestorage.app",
  messagingSenderId: "853388042882",
  appId: "1:853388042882:web:5410ab7ce4faaa6e6dca9b",
  measurementId: "G-5R2BPCLLN2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
