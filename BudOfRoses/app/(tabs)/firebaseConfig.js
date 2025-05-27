// import { initializeApp } from '@react-native-firebase/app';

import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCMH3sx6jFNQ6g6AkcuKle4bQcXJDA-wnw",
  authDomain: "bud-of-roses.firebaseapp.com",
  databaseURL: "https://bud-of-roses-default-rtdb.firebaseio.com",
  projectId: "bud-of-roses",
  storageBucket: "bud-of-roses.firebasestorage.app",
  messagingSenderId: "250599522396",
  appId: "1:250599522396:web:b2bb8ee0881ac8295d2699",
  measurementId: "G-6Z5434FZ44"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

export{auth, database}