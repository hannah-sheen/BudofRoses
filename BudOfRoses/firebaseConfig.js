// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);