// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCMHyzu8Jvjjl1-nlAHOXghGIVmwfqK6wQ",
  authDomain: "tetris-58968.firebaseapp.com",
  projectId: "tetris-58968",
  storageBucket: "tetris-58968.appspot.com",
  messagingSenderId: "216467645324",
  appId: "1:216467645324:web:01186051568b8419056ca9",
  measurementId: "G-8XVBRRRWYJ",
};

initializeApp(firebaseConfig);
export const db = getFirestore("tetris-leaderboard");
