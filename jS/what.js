// // Function to create the GPX file from coordinates
// const createGPXFile = (coordinates) => {
//   let gpxContent = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
//     <gpx version="1.1" xmlns="http://www.topografix.com/GPX/1/1">
//       <trk>
//         <name>Track</name>
//         <trkseg>`;

//   // Loop through the coordinates and add trackpoints to the GPX content
//   coordinates.forEach((coord) => {
//     gpxContent += `
//       <trkpt lat="${coord.latitude}" lon="${coord.longitude}">
//         <ele>${coord.altitude}</ele>
//         <time>${new Date(coord.timestamp).toISOString()}</time>
//       </trkpt>`;
//   });

//   gpxContent += `
//         </trkseg>
//       </trk>
//     </gpx>`;

//   return gpxContent;
// };

// // Function to handle successful geolocation
// const handleGeolocationSuccess = (position) => {
//   const coordinates = [];

//   // Extract latitude, longitude, and timestamp from the geolocation position object
//   const { latitude, longitude, altitude, timestamp } = position.coords;

//   // Create a coordinate object
//   const coordinate = {
//     latitude,
//     longitude,
//     altitude,
//     timestamp: new Date(timestamp).getTime(),
//   };

//   coordinates.push(coordinate);

//   // Create the GPX file content
//   const gpxContent = createGPXFile(coordinates);

//   // Download the GPX file
//   downloadGPXFile(gpxContent);
// };

// // Function to handle geolocation errors
// const handleGeolocationError = (error) => {
//   console.error("Geolocation error:", error);
// };

// // Function to start geolocation tracking
// const startGeolocationTracking = () => {
//   if (navigator.geolocation) {
//     // Request geolocation updates with high accuracy
//     navigator.geolocation.watchPosition(
//       handleGeolocationSuccess,
//       handleGeolocationError,
//       { enableHighAccuracy: true }
//     );
//   } else {
//     console.error("Geolocation is not supported by this browser.");
//   }
// };

// // Function to download the GPX file
// const downloadGPXFile = (gpxContent) => {
//   const filename = "track.gpx";

//   const element = document.createElement("a");
//   element.setAttribute(
//     "href",
//     "data:text/xml;charset=utf-8," + encodeURIComponent(gpxContent)
//   );
//   element.setAttribute("download", filename);
//   element.style.display = "none";

//   document.body.appendChild(element);

//   element.click();

//   document.body.removeChild(element);
// };

// // Example usage:
// startGeolocationTracking();
