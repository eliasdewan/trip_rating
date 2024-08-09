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
  trafficIntensity?: number;
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
    const primaryData = data.routes[0];


    // console.log(primaryData);
    // console.log("calc", (primaryData.distanceMeters / 1000) / miles_to_km + +pickupDistance);

    // Route description - using a major road or static message
    calculatedData.routing = primaryData.description;
    // Miles of the trip
    calculatedData.miles = (primaryData.distanceMeters / 1000) / miles_to_km + +pickupDistance; //  This miles uses location from half post code to half post code (not good for same area travels)
    calculatedData.miles = parseFloat(calculatedData.miles.toFixed(2));
    console.log(calculatedData.miles.toFixed(2), "miles");
    let time = parseFloat(primaryData.duration.replace("s", "")); // remove the s from the last index // TODO: Unnecessary variable

    // Minutes of the trip for duration
    calculatedData.timeMinutes = time / 60 + pickupTimeEstimate;
    calculatedData.timeMinutes = parseFloat(calculatedData.timeMinutes.toFixed(2));;
    console.log(calculatedData.timeMinutes, "minutes");

    // Discrepancies - when the driverAppDistance distance significantly lower than calculated
    // Tell you how accurately you are predicting (how many less miles used when routing when negative)
    // You want this number in the positive telling you the google routing is giving over estimated miles
    calculatedData.distanceDifference = calculatedData.miles - (driverAppDistance + pickupDistance);
    calculatedData.distanceDifference = parseFloat(calculatedData.distanceDifference.toFixed(2));;

    // Similarly you want the distance difference factor to be > 1 
    calculatedData.distanceDifferenceFactor = calculatedData.miles / (driverAppDistance + pickupDistance);
    calculatedData.distanceDifferenceFactor = parseFloat(calculatedData.distanceDifferenceFactor.toFixed(1));

    if (calculatedData.distanceDifferenceFactor > 1.05 || calculatedData.distanceDifferenceFactor < 0.95) {
      // FIXME: Possible under estimation in traffic condition when longer journey is quicker but driverAppDistance is showing shorter distance in miles. Use factoring only smaller journeys
      // TODO: Possible solution: Calculate a set values and display both as factored and non factored 
      // miles = miles / calculatedData.distanceDifferenceFactor;
      // calculatedData.timeMinutes = calculatedData.timeMinutes / calculatedData.distanceDifferenceFactor;
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

    return calculatedData as CalculatedDataType;
  }
  catch (error) {
    console.log('Calculate Score failed: ', error);
    throw error;
  }
}