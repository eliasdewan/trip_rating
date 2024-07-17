export function getGoogleEstimatev2() {
  const url = "https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix"
  const data = {
    "origins": [
      {
        "waypoint": {
          "address": "UB2 southall"
        },
        "routeModifiers": { "avoid_ferries": true }
      }
    ],
    "destinations": [
      {
        "waypoint": {
          "address": "E14 London"
        }
      }
    ],
    "travelMode": "DRIVE",
    "routingPreference": "TRAFFIC_AWARE_OPTIMAL"
  }
  // routingPreferences // TRAFFIC_UNAWARE // TRAFFIC_AWARE // TRAFFIC_AWARE_OPTIMAL

  return fetch(url, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": "AIzaSyDso8ZpnTpAeWsnveJaKyA57nt2Eyqgj5I",
      "X-Goog-FieldMask": "originIndex,destinationIndex,duration,distanceMeters,status,condition"
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      return data;
    })
    .catch(error => {
      console.error('Error:', error);
      throw error; // Re-throw the error to handle it further if needed
    });
}


/** # For routing string
** "origin": { "address": "UB2 southall" },
** "destination": { "address": "E14 London" },
** "travelMode": "DRIVE",
* "routingPreference": "TRAFFIC_AWARE"
* @HEADER
*  routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline 
*/