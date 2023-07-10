let map = L.map("map").setView([51.505, -0.09], 13);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  maxZoom: 18,
}).addTo(map);

let isTracking = false;
let routeLayer;
let watchID;
let routeCoordinates = [];

function startTracking() {
  isTracking = true;
  document.getElementById("startButton").disabled = true;
  document.getElementById("stopButton").disabled = false;
  document.getElementById("downloadButton").disabled = true;
  document.getElementById("uploadButton").disabled = true;
  routeCoordinates = [];
  routeLayer = undefined;

  if ("geolocation" in navigator) {
    watchID = navigator.geolocation.watchPosition(function (position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      routeCoordinates.push([latitude, longitude]);

      updateRoute();
    });
  }
}

function stopTracking() {
  isTracking = false;
  document.getElementById("startButton").disabled = false;
  document.getElementById("stopButton").disabled = true;
  document.getElementById("downloadButton").disabled = false;
  document.getElementById("uploadButton").disabled = false;

  navigator.geolocation.clearWatch(watchID);

  updateRoute();
}

function downloadGPX() {
  const gpxData = generateGPX();

  const blob = new Blob([gpxData], { type: "text/xml" });

  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = "route.gpx";
  link.click();
}

function handleFileSelect(evt) {
  const file = evt.target.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const contents = e.target.result;
    routeCoordinates = parseGPX(contents);
    updateRoute();
  };

  reader.readAsText(file);
}

function updateRoute() {
  if (routeCoordinates.length > 1) {
    if (routeLayer) {
      routeLayer.removeFrom(map);
    }

    routeLayer = L.polyline(routeCoordinates, {
      color: "blue", // Set the color to blue
      weight: 5,
    }).addTo(map);

    map.fitBounds(routeLayer.getBounds());
  }
}

function generateGPX() {
  let gpxContent = `<?xml version="1.0" encoding="UTF-8"?>
  <gpx
    version="1.1"
    creator="GPX Tracker"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns="http://www.topografix.com/GPX/1/1"
    xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
    <trk>
      <trkseg>`;

  for (let i = 0; i < routeCoordinates.length; i++) {
    const [latitude, longitude] = routeCoordinates[i];
    const currentTimestamp = new Date().toISOString();

    gpxContent += `
      <trkpt lat="${latitude}" lon="${longitude}">
        <ele>0</ele>
        <time>${currentTimestamp}</time>
      </trkpt>`;
  }

  gpxContent += `
      </trkseg>
    </trk>
  </gpx>`;

  return gpxContent;
}

function parseGPX(gpxData) {
  const parser = new DOMParser();
  const gpxDocument = parser.parseFromString(gpxData, "text/xml");
  const waypoints = gpxDocument.getElementsByTagName("wpt");
  const coordinates = [];

  for (let i = 0; i < waypoints.length; i++) {
    const waypoint = waypoints[i];
    const latitude = parseFloat(waypoint.getAttribute("lat"));
    const longitude = parseFloat(waypoint.getAttribute("lon"));
    coordinates.push([latitude, longitude]);
  }

  return coordinates;
}

// Button event listeners
document.getElementById("startButton").addEventListener("click", startTracking);
document.getElementById("stopButton").addEventListener("click", stopTracking);
document
  .getElementById("downloadButton")
  .addEventListener("click", downloadGPX);
document
  .getElementById("uploadInput")
  .addEventListener("change", handleFileSelect);
