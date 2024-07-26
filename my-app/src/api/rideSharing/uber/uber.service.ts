import uberExtractData from "./uberExtractTaskerData.service";

export function extractData(jsonData: any) {
  const cleanDataExtracted = uberExtractData(jsonData);
  console.log(cleanDataExtracted, "extractData");

  let locations;
  if (cleanDataExtracted.regFindaddressarrayPass) {
     locations = { origin: cleanDataExtracted.regfindAddresses[0], destination: cleanDataExtracted.regfindAddresses[1] }
  } else {
     locations = { origin: cleanDataExtracted.indexedAddress[0], destination: cleanDataExtracted.indexedAddress[1] }
  }
  // current index in this data
  const passengerRating = cleanDataExtracted.customerRating;
  const pay = cleanDataExtracted.pay
  const uberDistance = cleanDataExtracted.tripLength;
  const pickupDistance = cleanDataExtracted.pickupDistance;
  const pickupTimeEstimate = cleanDataExtracted.pickupTimeEstimate;

  // returns string for http requrest and other

  console.log({ ...locations, passengerRating, pay, pickupDistance, pickupTimeEstimate });

  return { ...locations, passengerRating, pay,uberDistance, pickupDistance, pickupTimeEstimate }
}