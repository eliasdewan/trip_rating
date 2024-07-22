type googleMatrixReturn = [{
  originIndex?: number,
  destinationIndex?: number,
  status?: object,
  distanceMeters?: number,
  duration?: string,
  condition?: string
}]


export function calculateScore(
  data: googleMatrixReturn | any,
  passengerRating: number,
  pay: number,
  pickupDistance: number,
  pickupTimeEstimate: number
) {

  const miles_to_km = 1.609344;

  const desiredHourlyRate = 40;
  const desiredPayPerMile = 2;

  console.log(data, "score") // FIXME:  you can have here address not found from google , dont proceed if that happens
/**
 * [
  {
    originIndex: 0,
    destinationIndex: 0,
    status: { code: 5, message: 'Address not found.' }
  }
]
 */


  data = data[0]

  console.log(data.distanceMeters);
  let miles = (data.distanceMeters / 1000) / miles_to_km + pickupDistance
  console.log(miles.toFixed(2), "miles")
  let time = Number(data.duration.slice(0, -1))
  // TRIP DURATION
  let timeMinutes = time / 60 + pickupTimeEstimate
  console.log(timeMinutes.toFixed(2), "minutes");
  // PRICE PER MILE 
  let pricePerMile = (pay / miles)
  console.log(pricePerMile.toFixed(2), " per mile")
  // PRICE PER HOUR
  let pricePerHour = (pay / (timeMinutes / 60))
  console.log(pricePerHour.toFixed(2), "per hour");
  // Per mile rating
  let perMileRating = pricePerMile * (100 / desiredPayPerMile)
  console.log(perMileRating.toFixed(2), "ppmlr")
  // Per Hour rating
  let perHourRating = pricePerHour * (100 / desiredHourlyRate)
  console.log(perHourRating.toFixed(2), "phr");


  let resultData = {
    miles,
    time,
    timeMinutes,
    pricePerMile,
    pricePerHour,
    perMileRating,
    perHourRating,
    pay,
    passengerRating
  }

  return resultData
}