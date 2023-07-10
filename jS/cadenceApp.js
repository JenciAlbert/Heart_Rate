"use strict";

const statusText2 = document.querySelector("#Connect");
let lastSentTimestamp = 0;
let cadences = [];

statusText2.addEventListener("click", function () {
  statusText2.textContent = "Wait...";
  cadences = [];
  cadenceSensor
    .connect()
    .then(() =>
      cadenceSensor
        .startNotificationsCscMeasurement()
        .then(handleCscMeasurement)
    )
    .catch((error) => {
      statusText2.textContent = error;
    });
});

const handleCscMeasurement = function (cscMeasurement) {
  cscMeasurement.addEventListener(
    "characteristicvaluechanged",
    handleCscChanged
  );
};
let previousCrankRevolutions = 0;
let previousCrankTime = 0;
function calculateRPM(cumulativeCrankRevolutions, crankTimeStamp) {
  const crankRevolutions =
    cumulativeCrankRevolutions - previousCrankRevolutions;
  const crankTime = crankTimeStamp - previousCrankTime;

  const crankTimeInSeconds = crankTime / 1024; // Convert to seconds (assuming a time resolution of 1024Hz)

  const rpm = Math.floor((crankRevolutions / crankTimeInSeconds) * 60); // Calculate RPM

  // Update the previous values for the next calculation
  previousCrankRevolutions = cumulativeCrankRevolutions;
  previousCrankTime = crankTimeStamp;

  return rpm !== 0 ? rpm : 0;
}

const handleCscChanged = function (event) {
  const cscMeasurement = parseCadenceMeasurement(event.target.value);
  updateStatusText(cscMeasurement);
  updateCadences(cscMeasurement);
};

const parseCadenceMeasurement = function (value) {
  return cadenceSensor.parseCadence(value);
};

const updateStatusText = function (cscMeasurement) {
  console.log(cscMeasurement);
  const rpm = calculateRPM(
    cscMeasurement.cumulativeCrankRevolutions,
    cscMeasurement.crankTimeStamp
  );

  // Check if the RPM is NaN and set it to "0" in that case
  const rpmText = isNaN(rpm) ? "0" : rpm.toString();
  statusText2.innerHTML = rpmText * 2 + "🏃";
};

const updateCadences = function (cscMeasurement) {
  cadences.push(cscMeasurement.cadence);
};
