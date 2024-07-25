type googleMatrixReturn = [{
  originIndex?: number,
  destinationIndex?: number,
  status?: object,
  distanceMeters?: number,
  duration?: string,
  condition?: string
}]

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
export function calculateScore(
  data: googleMatrixReturn | any,
  passengerRating: number,
  pay: number,
  uberDistance: number,
  pickupDistance: number,
  pickupTimeEstimate: number
) {

  const miles_to_km: number = 1.609344;
  // Set desired score for 100
  const desiredHourlyRate = 40;
  const desiredPayPerMile = 2;

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


  data = data[0];
  
  console.log(data);
  console.log("calc", (data.distanceMeters / 1000) / miles_to_km + +pickupDistance);
  
  let miles = (data.distanceMeters / 1000) / miles_to_km + +pickupDistance; //  This miles uses location from half post code to half post code (not good for same area travels)
  console.log(miles.toFixed(2), "miles");
  let time = Number(data.duration.slice(0, -1)); // remove the s from the last index

  // TRIP DURATION
  let timeMinutes = time / 60 + pickupTimeEstimate;
  console.log(timeMinutes.toFixed(2), "minutes");
  // PRICE PER MILE 
  let pricePerMile = (pay / miles);
  console.log(pricePerMile.toFixed(2), " per mile");

  //⌛ PRICE PER HOUR
  let pricePerHour = (pay / (timeMinutes / 60));
  console.log(pricePerHour.toFixed(2), "per hour");

  //⭐ Per mile rating
  let perMileRating = pricePerMile * (100 / desiredPayPerMile);
  console.log(perMileRating.toFixed(2), "ppmlr");

  //⭐ Per Hour rating
  let perHourRating = pricePerHour * (100 / desiredHourlyRate);
  console.log(perHourRating.toFixed(2), "phr");

  // Discrepancies - when the uber distance significatly lower than calculated
  let distanceDifference = miles - (uberDistance + pickupDistance);
  console.log(distanceDifference, "more or less than uber");




  let resultData = {
    pay,
    miles,
    time,
    timeMinutes,
    pricePerMile,
    pricePerHour,
    perMileRating,
    perHourRating,
    passengerRating,
    distanceDifference
  }

  return resultData;
}