// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCMHyzu8Jvjjl1-nlAHOXghGIVmwfqK6wQ",
  authDomain: "tetris-58968.firebaseapp.com",
  databaseURL: "https://tetris-58968-default-rtdb.firebaseio.com",
  projectId: "tetris-58968",
  storageBucket: "tetris-58968.appspot.com",
  messagingSenderId: "216467645324",
  appId: "1:216467645324:web:01186051568b8419056ca9",
  measurementId: "G-8XVBRRRWYJ",
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
