// Import the functions you need from the SDKs you need
// import { initializeApp } from "../firebase/app";
// import { getDatabase, ref, runTransaction } from "/firebase/database";

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";

import {
  getDatabase,
  ref,
  runTransaction,
  get,
  child,
} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCyf7QgsXL5Kfe7ialu0hSLiZVqpKCvKwg",
  authDomain: "heartrate-1fc0b.firebaseapp.com",
  databaseURL:
    "https://heartrate-1fc0b-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "heartrate-1fc0b",
  storageBucket: "heartrate-1fc0b.appspot.com",
  messagingSenderId: "940411291886",
  appId: "1:940411291886:web:6b10d0d731adcf48c80bff",
  measurementId: "G-E130M9MCQL",
  databaseURL:
    "https://heartrate-1fc0b-default-rtdb.europe-west1.firebasedatabase.app/",
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const db = getDatabase(firebase);

export const sendDataToDatabase = (data) => {
  const cevaRef = ref(db, "heartRate1");
  runTransaction(cevaRef, (current_value) => {
    let parsedValue = JSON.parse(current_value);

    if (parsedValue === null) {
      return JSON.stringify([data]);
    }

    parsedValue.push(data);

    return JSON.stringify(parsedValue);
  });
};

export const readHeartRateFromDatabase = () => {
  return new Promise((resolve, reject) => {
    const dbRef = ref(getDatabase());
    let arr = [];
    get(child(dbRef, `heartRate1`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          arr = JSON.parse(snapshot.val());
          resolve(arr);
        } else {
          reject("No data available");
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};
