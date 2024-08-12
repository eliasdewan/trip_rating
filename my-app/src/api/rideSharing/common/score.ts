import { googleRouteResponse } from '../../../googleMapsCalls/googleDistanceV2';
export interface CalculatedDataType {
  pay: number;
  routing: String;
  miles: number;
  timeMinutes: number;
  pricePerMile: number;
  pricePerHour: number;
  perMileRating: number;
  perHourRating: number;
  passengerRating: number;
  distanceDifference: number;
  distanceDifferenceFactor: number;
  trafficIntensity: number;
  factoredData: {
    miles: number,
    timeMinutes: number;
    pricePerMile: number;
    pricePerHour: number;
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
export function calculateScore(
  data: googleRouteResponse,
  passengerRating: number,
  pay: number,
  driverAppDistance: number,
  pickupDistance: number,
  pickupTimeEstimate: number
): CalculatedDataType | any {

  const miles_to_km: number = 1.609344;
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




    // Discrepancies - when the driverAppDistance distance significantly lower than calculated
    // Tell you how accurately you are predicting (how many less miles used when routing when negative)
    // You want this number in the positive telling you the google routing is giving over estimated miles
    calculatedData.distanceDifference = routeMiles - driverAppDistance;
    calculatedData.distanceDifference = parseFloat(calculatedData.distanceDifference.toFixed(2));;

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

    if (calculatedData.distanceDifferenceFactor > 1.05 || calculatedData.distanceDifferenceFactor < 0.95) {
      // FIXME: Possible under estimation in traffic condition when longer journey is quicker but driverAppDistance is showing shorter distance in miles. Use factoring only smaller journeys
    }
    /** 

    // TODO: Check distance difference and make traffic unaware google maps api call to see if the route distance matches with the given uberDistance
    let googleDistanceMiles = googleJsonData[0].distanceMeters / 1.609;
    let combinedGivenDistanceMiles = driverAppDistance + pickupDistance;
    let estimateFactor = googleDistanceMiles / combinedGivenDistanceMiles;
    if (estimateFactor > 1.05) {
      // over estimating (could be diversion due to traffic). Need to check with google estimate with traffic unaware.
    } else if (estimateFactor < 0.95) {
      // under estimating (could be short journey, just crossing one district or driverApp not taking some road closure into account)
      // may need to consider traffic conditions
    }
*/



    return calculatedData as CalculatedDataType;
  }
  catch (error) {
    console.log('Calculate Score failed: ', error);
    throw error;
  }
}