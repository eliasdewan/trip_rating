import { googleRouteResponse } from '../../../googleMapsCalls/googleDistanceV2';
export interface CalculatedDataType {
  time: String; // TODO:
  timeSummary: String;
  pay: number;
  routing: String;
  miles: number;
  timeMinutes: number;
  pricePerMile: number;
  pricePerHour: number;
  expectedArrival: string;
  perMileRating: number;
  perHourRating: number;
  passengerRating: number;
  distanceDifference: number;
  distanceDifferenceFactor: number;
  trafficIntensity: number;
  outsideOperatingArea: boolean; // TODO: if destination is outside the operating area where you can not get trip requests - maybe use distance.
  factoredData: {
    miles: number,
    timeMinutes: number;
    pricePerMile: number;
    pricePerHour: number;
    expectedArrival: string; // TODO:
  }
}

/**
 * -- Aims to return a score for the trip, mainly price per hour, duration, other calculations are being made
 * @param data 
 * @param passengerRating 
 * @param pay 
 * @param driverAppDistance
 * @param pickupDistance 
 * @param pickupTimeEstimate 
 * @returns { pay,miles,time,timeMinutes,pricePerMile,pricePerHour,perMileRating,perHourRating,passengerRating,distanceDifference}
 */

//TODO: Add a parameter for which app its from, the request
export function calculateScore(
  data: googleRouteResponse,
  passengerRating: number,
  pay: number,
  driverAppDistance: number,
  pickupDistance: number,
  pickupTimeEstimate: number
): CalculatedDataType | any {

  const miles_to_km: number = 1.609;
  // Set desired score for 100
  const desiredHourlyRate = 40;
  const desiredPayPerMile = 2;

  const calculatedData: Partial<CalculatedDataType> = {
    pay,
    passengerRating,
  }

  console.log(data, "calculate score using it in score function");

  try {
    if (data.routes === undefined || data === null) {
      throw new Error(`Google maps failed, No routes found`);
    }
    // For now using first default TODO: find closest match the app uses and use that for factoring solution
    // TODO: Check the factor is not too high, if it is, then the route is not accurate
    // TODO: If distance is high then factoring should be lower that 0.1, maybe 5 miles+ , and 
    // TODO: if origin and destination is detailed, then the factor should not be applied
    let primaryData = data.routes[0];
    // data.routes.sort((a, b) => a.distanceMeters - b.distanceMeters) // small to big sorted
    if (data.routes.length > 1) {
      let firstDuration = parseFloat(data.routes[0].duration.replace("s", ""));
      let secondDuration = parseFloat(data.routes[1].duration.replace("s", ""));
      // if the first route is over 20% longer but the duration is not 20 percent longer - choose the second route - as first route is rerouting to a longer route
      if (data.routes[0].distanceMeters > data.routes[1].distanceMeters * 1.2 && firstDuration * 1.2 >= secondDuration) {
        primaryData = data.routes[1]
      }
    }


    // console.log(primaryData);
    // console.log("calc", (primaryData.distanceMeters / 1000) / miles_to_km + +pickupDistance);

    //🛣️🗺️ Route description - using a major road or static message
    calculatedData.routing = primaryData.description;

    //🛣️ Miles of the trip
    const routeMiles = (primaryData.distanceMeters / 1000) / miles_to_km
    calculatedData.miles = routeMiles + +pickupDistance; //  This miles uses location from half post code to half post code (not good for same area travels)
    calculatedData.miles = parseFloat(calculatedData.miles.toFixed(2));
    console.log(calculatedData.miles.toFixed(2), "miles");

    //⏱️🆎 Minutes of the trip for duration
    const seconds = parseFloat(primaryData.duration.replace("s", "")); // remove the s from the last index // TODO: Unnecessary variable
    const routeTimeMinutes = seconds / 60;
    calculatedData.timeMinutes = routeTimeMinutes + pickupTimeEstimate;
    calculatedData.timeMinutes = parseFloat(calculatedData.timeMinutes.toFixed(2));;
    console.log(calculatedData.timeMinutes, "minutes");


    //💲🛣️ PRICE PER MILE 
    calculatedData.pricePerMile = (pay / calculatedData.miles);
    calculatedData.pricePerMile = parseFloat(calculatedData.pricePerMile.toFixed(2));
    console.log(calculatedData.pricePerMile, " per mile");

    //💲⏱️ PRICE PER HOUR
    calculatedData.pricePerHour = (pay / (calculatedData.timeMinutes / 60));
    calculatedData.pricePerHour = parseFloat(calculatedData.pricePerHour.toFixed(2));;
    console.log(calculatedData.pricePerHour, "per hour");

    //⭐ Per mile rating
    calculatedData.perMileRating = calculatedData.pricePerMile * (100 / desiredPayPerMile);
    calculatedData.perMileRating = parseFloat(calculatedData.perMileRating.toFixed(0));;
    console.log(calculatedData.perMileRating, "ppmlr");

    //⭐ Per Hour rating
    calculatedData.perHourRating = calculatedData.pricePerHour * (100 / desiredHourlyRate);
    calculatedData.perHourRating = parseFloat(calculatedData.perHourRating.toFixed(0));;
    console.log(calculatedData.perHourRating, "phr");

    //🛣️🚦🚗🚙🚓 Traffic intensity for static and current time
    if (primaryData.staticDuration) {
      const staticDuration = parseFloat(primaryData.staticDuration.replace("s", ""));
      const actualDuration = parseFloat(primaryData.duration.replace("s", ""));
      calculatedData.trafficIntensity = parseFloat((actualDuration / staticDuration).toFixed(1))
    }

    //⌚
    const currentTime = new Date();
    calculatedData.time = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const pickupTime = currentTime.getTime() + pickupTimeEstimate * 60 * 1000;
    const dropOffTime = currentTime.getTime() + calculatedData.timeMinutes * 60 * 1000;

    /*Discrepancies - when the driverAppDistance distance significantly lower than calculated
    * Tell you how accurately you are predicting (how many less miles used when routing when negative)
    * You want this number in the positive telling you the google routing is giving over estimated miles
    */
    calculatedData.distanceDifference = routeMiles - driverAppDistance;
    calculatedData.distanceDifference = parseFloat(calculatedData.distanceDifference.toFixed(2));;

    // When guess route is calculated, there is no distance difference, and when bolt didn't provide distance 
    if (calculatedData.distanceDifference === 0 || pay === driverAppDistance) {
      console.log("factoring to zero");
      // set factor to 0
      calculatedData.distanceDifferenceFactor = 0;
      calculatedData.factoredData = { miles: 0, timeMinutes: 0, pricePerHour: 0, pricePerMile: 0, expectedArrival: new Date(dropOffTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }; // TODO: some alternative to the this, use outcode to search location and use that
      calculatedData.timeSummary =`${calculatedData.time} (${new Date(pickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} pickup) ${calculatedData.factoredData.expectedArrival}`;
    } else {
      // Similarly you want the distance difference factor to be > 1 . Over estimation means reality is the return is more than the effort
      calculatedData.distanceDifferenceFactor = routeMiles / driverAppDistance;
      calculatedData.distanceDifferenceFactor = parseFloat(calculatedData.distanceDifferenceFactor.toFixed(1));
      calculatedData.factoredData = {} as CalculatedDataType;
      // Effort
      calculatedData.factoredData.miles = parseFloat((routeMiles / calculatedData.distanceDifferenceFactor + +pickupDistance).toFixed(2));
      calculatedData.factoredData.timeMinutes = parseFloat((routeTimeMinutes / calculatedData.distanceDifferenceFactor + pickupTimeEstimate).toFixed(0));
      // Return
      calculatedData.factoredData.pricePerHour = parseFloat((pay / (calculatedData.factoredData.timeMinutes / 60)).toFixed(2));
      calculatedData.factoredData.pricePerMile = parseFloat((pay / calculatedData.factoredData.miles).toFixed(2));
      //⌚ Factored
      const dropOffTimeFactored = currentTime.getTime() + calculatedData.factoredData.timeMinutes * 60 * 1000;
      calculatedData.factoredData.expectedArrival = new Date(dropOffTimeFactored).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      calculatedData.timeSummary =`${calculatedData.time} (${new Date(pickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} pickup) ${calculatedData.factoredData.expectedArrival}`;
          };

    return calculatedData as CalculatedDataType;
  }
  catch (error) {
    console.log('Calculate Score failed: ', error);
    throw error;
  }
}