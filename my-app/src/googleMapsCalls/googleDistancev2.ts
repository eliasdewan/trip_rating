import { logger } from "hono/logger";

export function getGoogleEstimatev2(origin: string, destination: string, apiKey: string) {

  const url = "https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix"
  const data = {
    "origins": [
      {
        "waypoint": {
          "address": origin
        },
        "routeModifiers": { "avoid_ferries": true }
      }
    ],
    "destinations": [
      {
        "waypoint": {
          "address": destination
        }
      }
    ],
    "travelMode": "DRIVE",
    "routingPreference": "TRAFFIC_AWARE_OPTIMAL",
    "units": "IMPERIAL"
  }
  // routingPreferences // TRAFFIC_UNAWARE // TRAFFIC_AWARE // TRAFFIC_AWARE_OPTIMAL

  return fetch(url, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "originIndex,destinationIndex,duration,distanceMeters,status,condition,staticDuration,travelAdvisory,localizedValues,fallbackInfo"
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not ok from google:', ${response.text}, ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      return data; // The actual map data as ../data
    })
    .catch(error => {
      console.error('Error from googleDistranceMatrixV2:', error);
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