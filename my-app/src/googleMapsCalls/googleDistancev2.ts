export type googleMatrixResponse = [{
  originIndex: number,
  destinationIndex: number,
  status?: {
    code?: number,
    message?: string
  },
  distanceMeters: number,
  duration: string,
  staticDuration?: string,
  condition?: string,
  localizedValues?: {
    distance: {
      text: string
    },
    duration: {
      text: string
    },
    staticDuration: {
      text: string
    }
  }
}]
export type googleRouteResponse = {
  routes:
  {
    distanceMeters: number,
    duration: string,
    staticDuration?: string,
    description: string,
    routeLabels: string[],
    localizedValues?: {
      distance: {
        text: string
      },
      duration: {
        text: string
      },
      staticDuration: {
        text: string
      }
    }
  }[]
}

export function computeRouteMatrixV2(origin: string, destination: string, apiKey: string, routingPreference = "TRAFFIC_AWARE_OPTIMAL") {

  // TODO: Try for origin and destination types , format to accept lat lng with conditional checking

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
    "routingPreference": routingPreference,
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
      console.error('Error from computeRouteMatrixV2:', error);
      throw error; // Re-throw the error to handle it further if needed
    });
}

export function computeRoutesV2(origin: string, destination: string, apiKey: string, routingPreference = "TRAFFIC_AWARE_OPTIMAL") {
  const url = "https://routes.googleapis.com/directions/v2:computeRoutes"
  const data =
  {
    "origin": {
      "address": origin
    },
    "destination": {
      "address": destination
    },
    "routeModifiers": {
      "avoid_ferries": true
    },
    "computeAlternativeRoutes": true,
    "travelMode": "DRIVE",
    "routingPreference": routingPreference,
    "units": "IMPERIAL"
  }
  // routingPreferences // TRAFFIC_UNAWARE // TRAFFIC_AWARE // TRAFFIC_AWARE_OPTIMAL

  return fetch(url, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "routes.distanceMeters,routes.duration,routes.staticDuration,routes.localizedValues,routes.routeLabels,routes.description,routes.warnings"
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
      console.error('Error from computeRoutesV2:', error);
      throw error; // Re-throw the error to handle it further if needed
    });
}

// Uber likes to give you a little more 6.5 for 6.6