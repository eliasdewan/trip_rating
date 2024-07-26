type googleMatrixReturn = [{
  originIndex?: number,
  destinationIndex?: number,
  status?: object,
  distanceMeters?: number,
  duration?: string,
  condition?: string
}]

export interface CalculatedData {
  pay: number,
  miles: number,
  time: number,
  timeMinutes: number,
  pricePerMile: number,
  pricePerHour: number,
  perMileRating: number,
  perHourRating: number,
  passengerRating: number,
  distanceDifference: number
}

/**
 * -- Aims to return a score for the trip, mainly price per hour, duration, other calculations are being made
 * @param data 
 * @param passengerRating 
 * @param pay 
 * @param uberDistance
 * @param pickupDistance 
 * @param pickupTimeEstimate 
 * @returns { pay,miles,time,timeMinutes,pricePerMile,pricePerHour,perMileRating,perHourRating,passengerRating,distanceDifference}
 */
export function calculateScore (
  data: googleMatrixReturn | any,
  passengerRating: number,
  pay: number,
  uberDistance: number,
  pickupDistance: number,
  pickupTimeEstimate: number
): CalculatedData | any {

  const miles_to_km: number = 1.609344;
  // Set desired score for 100
  const desiredHourlyRate = 40;
  const desiredPayPerMile = 2;

  const calculatedData : Partial<CalculatedData> = {
    pay,
    passengerRating
  }

  console.log(data, "calculate score using it in score function");
  // FIXME:  you can have here address not found from google , dont proceed if that happens
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
    data = data[0];

    console.log(data);
    console.log("calc", (data.distanceMeters / 1000) / miles_to_km + +pickupDistance);

    let miles = (data.distanceMeters / 1000) / miles_to_km + +pickupDistance; //  This miles uses location from half post code to half post code (not good for same area travels)
    console.log(miles.toFixed(2), "miles");
    calculatedData.time = Number(data.duration.slice(0, -1)); // remove the s from the last index

    // TRIP DURATION
    calculatedData.timeMinutes = calculatedData.time / 60 + pickupTimeEstimate;
    console.log(calculatedData.timeMinutes.toFixed(2), "minutes");
    // PRICE PER MILE 
    calculatedData.pricePerMile = (pay / miles);
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

    // Discrepancies - when the uber distance significatly lower than calculated
    calculatedData.distanceDifference = miles - (uberDistance + pickupDistance);
    console.log(calculatedData.distanceDifference, "more or less than uber");

    return calculatedData as CalculatedData;
  }
  catch (error) {
    console.log('Calculate Score failed: ', error);
    return error;
  }
}