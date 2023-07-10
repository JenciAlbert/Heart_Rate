// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";

// // If you enabled Analytics in your project, add the Firebase SDK for Google Analytics
// import {
//   getDatabase,
//   ref,
//   runTransaction,
// } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";
import { sendDataToDatabase } from "./firebase.js";
import { readHeartRateFromDatabase } from "./firebase.js";

const statusText = document.querySelector("#statusText");
const min = document.querySelector("#minBpm");
const max = document.querySelector("#maxBpm");

const avarageBpm = document.querySelector("#avarageBpm");
let lastSentTimestamp = 0;
let heartRates = [];

statusText.addEventListener("click", function () {
  statusText.textContent = "Breathe...";
  heartRates = [];
  heartRateSensor
    .connect()
    .then(() =>
      heartRateSensor
        .startNotificationsHeartRateMeasurement()
        .then(handleHeartRateMeasurement)
    );
});

//here we handle the data
const handleHeartRateMeasurement = function (heartRateMeasurement) {
  heartRateMeasurement.addEventListener(
    "characteristicvaluechanged",
    handleHeartRateChanged
  );
};

//It calls the other functions in a sequence to handle the heart rate measurement data
const handleHeartRateChanged = function (event) {
  const heartRateMeasurement = parseHeartRateMeasurement(event.target.value);
  updateStatusText(heartRateMeasurement);
  updateHeartRates(heartRateMeasurement);
  updateHeartRateRange();
  sendHeartRateData(heartRateMeasurement);
};
// extracts the heart rate measurement from the value.
const parseHeartRateMeasurement = function (value) {
  return heartRateSensor.parseHeartRate(value);
};
// updates the status text with the heart rate measurement.
const updateStatusText = function (heartRateMeasurement) {
  // console.log(heartRateMeasurement);
  statusText.innerHTML = heartRateMeasurement.heartRate + " ❤️";
};
//adds the heart rate measurement to the array of heart rates.
const updateHeartRates = function (heartRateMeasurement) {
  heartRates.push(heartRateMeasurement.heartRate);
};
//calculates and updates the minimum, maximum, and average heart rate.
const updateHeartRateRange = function () {
  min.innerHTML = Math.min(...heartRates);
  max.innerHTML = Math.max(...heartRates);
  avarageBpm.textContent = calculateAverageHeartRate();
};
//send the parsed heart rate to a database(every 8 seconds)
const sendHeartRateData = function (heartRateMeasurement) {
  const currentTimestamp = new Date().getTime();
  if (currentTimestamp - lastSentTimestamp >= 8000) {
    const timestamp = new Date().toLocaleString();
    const data = {
      heartRate: heartRateMeasurement.heartRate,
      timestamp: timestamp,
    };
    sendDataToDatabase(data);
    lastSentTimestamp = currentTimestamp;
  }
};
const calculateAverageHeartRate = () => {
  const sum = heartRates.reduce((total, hr) => total + hr, 0);
  return Math.floor(sum / heartRates.length.toFixed()); // Return average with 2 decimal places
};
