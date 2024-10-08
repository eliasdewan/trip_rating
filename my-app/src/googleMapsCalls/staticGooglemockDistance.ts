import { googleRouteResponse } from "./googleDistanceV2";

// A sub par solution to the problem of not having different origin and destination. // TODO: 
export function googleMockDistanceMatrixCall(driverAppDistance: number, pickupDistance: number, pickupTimeEstimate: number) {
  const result = [{
    originIndex: 0,
    destinationIndex: 0,
    status: {},
    distanceMeters: driverAppDistance * 1609, // in meters
    duration: (driverAppDistance / 0.2 * 60).toFixed(0).concat('s'), // in seconds
    condition: 'GUESS_ROUTE_CALCULATED'
  }]
  console.log("Running mock google distance matrix result", driverAppDistance, result);
  return result;
}
export function googleMockDistanceRouteCall(driverAppDistance: number, pickupDistance: number, pickupTimeEstimate: number) {
  const result: googleRouteResponse = {
    routes: [{
      distanceMeters: driverAppDistance * 1609, // in meters
      duration: (driverAppDistance / 0.2 * 60).toFixed(0).concat('s'), // in seconds
      description: "GUESS_ROUTE_CALCULATED",
      routeLabels: ["GUESS_ROUTE_CALCULATED"]

    }]

  }
  console.log("Running mock google distance route result", driverAppDistance, result);
  return result;
}



