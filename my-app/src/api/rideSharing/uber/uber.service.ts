import uberExtractData from "./uberExtractTaskerData.service";
// TODO : format functions into 1 and create fuction interface or data type for parameter
export function extractData(jsonData: any) {
  const cleanDataExtracted = uberExtractData(jsonData);
  console.log(cleanDataExtracted, "extractData");

  // Two methods of extracting the address, choosing the one with two strings in the array using the status pass
  let locations;
  if (cleanDataExtracted.regFindaddressarrayPass) {
     locations = { origin: cleanDataExtracted.regfindAddresses[0], destination: cleanDataExtracted.regfindAddresses[1] }
  } else {
     locations = { origin: cleanDataExtracted.indexedAddress[0], destination: cleanDataExtracted.indexedAddress[1] }
  }
  // current index in this data
  const passengerRating = cleanDataExtracted.customerRating;
  const pay = cleanDataExtracted.pay
  const driverAppDistance = cleanDataExtracted.tripLength;
  const pickupDistance = cleanDataExtracted.pickupDistance;
  const pickupTimeEstimate = cleanDataExtracted.pickupTimeEstimate;

  // returns string for http requrest and other

  console.log({ ...locations, passengerRating, pay, pickupDistance, pickupTimeEstimate });

  return { ...locations, passengerRating, pay,driverAppDistance, pickupDistance, pickupTimeEstimate }
}

// TODO: possible solution to same address and first part of the address, get random locations using the distance and approximate, verify they are within locality of the post code,
// calcualate the using distance matrix and match the ones that fit with the given distance.