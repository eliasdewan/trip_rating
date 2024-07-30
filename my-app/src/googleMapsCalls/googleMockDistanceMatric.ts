// A sub par solution to the problem of not having different origin and destination. // TODO: 
export function googleMockDistanceMatrixCall(uberDistance: number, pickupDistance: number, pickupTimeEstimate: number) {
  const result = [{
    originIndex: 0,
    destinationIndex: 0,
    status: {},
    distanceMeters: uberDistance * 1609, // in meters
    duration: (uberDistance / 0.2 * 60 ).toFixed(0).concat('s'), // in seconds
    condition: 'MOCK_ROUTE'
  }]

  return result;
}



