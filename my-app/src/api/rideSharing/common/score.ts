export type googleMatrixReturn = [{
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

export interface CalculatedData {
  pay: number;
  routing: String;
  miles: number;
  time: number;
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
  data: googleMatrixReturn,
  passengerRating: number,
  pay: number,
  driverAppDistance: number,
  pickupDistance: number,
  pickupTimeEstimate: number
): CalculatedData | any {

  const miles_to_km: number = 1.609344;
  // Set desired score for 100
  const desiredHourlyRate = 40;
  const desiredPayPerMile = 2;

  const calculatedData: Partial<CalculatedData> = {
    pay,
    passengerRating,
  }

  console.log(data, "calculate score using it in score function");
  // TODO:  you can have here address not found from google , find a route with driverAppDistance parameter
  /**
   * [
    {
      originIndex: 0,
      destinationIndex: 0,
      status: { code: 5, message: 'Address not found.' }
    }
  ]
   */

  try {
    const primaryData = data[0]
    if (primaryData.status?.code) {
      throw new Error(`Google maps failed ${primaryData.status?.message}`);
    }
    // console.log(primaryData);
    // console.log("calc", (primaryData.distanceMeters / 1000) / miles_to_km + +pickupDistance);

    // Route type - from google or static calculated
    calculatedData.routing = primaryData.condition;
    // Miles of the trip
    calculatedData.miles = (primaryData.distanceMeters / 1000) / miles_to_km + +pickupDistance; //  This miles uses location from half post code to half post code (not good for same area travels)
    console.log(calculatedData.miles.toFixed(2), "miles");
    calculatedData.time = parseFloat(primaryData.duration.replace("s", "")); // remove the s from the last index // TODO: Unnecessary variable

    // Minutes of the trip for duration
    calculatedData.timeMinutes = calculatedData.time / 60 + pickupTimeEstimate;
    console.log(calculatedData.timeMinutes.toFixed(2), "minutes");

    // Discrepancies - when the driverAppDistance distance significantly lower than calculated
    // Tell you how accurately you are predicting (how many less miles used when routing when negative)
    // You want this number in the positive telling you the google routing is giving over estimated miles
    calculatedData.distanceDifference = calculatedData.miles - (driverAppDistance + pickupDistance);
    // Similarly you want the distance difference factor to be > 1 
    calculatedData.distanceDifferenceFactor = calculatedData.miles / (driverAppDistance + pickupDistance);
    
    if (calculatedData.distanceDifferenceFactor > 1.05 || calculatedData.distanceDifferenceFactor < 0.95){
      // FIXME: Possible under estimation in traffic condition when longer journey is quicker but driverAppDistance is showing shorter distance in miles. Use factoring only smaller journeys
      // TODO: Possible solution: Calculate a set values and display both as factored and non factored 
      // miles = miles / calculatedData.distanceDifferenceFactor;
      // calculatedData.timeMinutes = calculatedData.timeMinutes / calculatedData.distanceDifferenceFactor;
    }

    // PRICE PER MILE 
    calculatedData.pricePerMile = (pay / calculatedData.miles);
    console.log(calculatedData.pricePerMile.toFixed(2), " per mile");

    //⌛ PRICE PER HOUR
    calculatedData.pricePerHour = (pay / (calculatedData.timeMinutes / 60));
    console.log(calculatedData.pricePerHour.toFixed(2), "per hour");

    //⭐ Per mile rating
    calculatedData.perMileRating = calculatedData.pricePerMile * (100 / desiredPayPerMile);
    console.log(calculatedData.perMileRating.toFixed(2), "ppmlr");

    //⭐ Per Hour rating
    calculatedData.perHourRating = calculatedData.pricePerHour * (100 / desiredHourlyRate);
    console.log(calculatedData.perHourRating.toFixed(2), "phr");

    // Traffic intensity for static and current time
    if (primaryData.staticDuration) {
      const staticDuration = parseFloat(primaryData.staticDuration.replace("s", ""));
      const actualDuration = parseFloat(primaryData.duration.replace("s", ""));
      calculatedData.trafficIntensity = parseFloat((actualDuration / staticDuration).toFixed(1))
    }

    return calculatedData as CalculatedData;
  }
  catch (error) {
    console.log('Calculate Score failed: ', error);
    throw error;
  }
}