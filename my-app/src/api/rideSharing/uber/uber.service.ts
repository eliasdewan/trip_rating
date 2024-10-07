import uberExtractData from "./uberExtractTaskerData.service";
// TODO : format functions into 1 and create function interface or data type for parameter
export function extractData(jsonData: any) {
   const cleanDataExtracted = uberExtractData(jsonData);
   console.log(cleanDataExtracted, "extractData");

   // Two methods of extracting the address, choosing the one with two strings in the array using the status pass
   let locations;
   if (cleanDataExtracted.regFindAddressArrayPass && cleanDataExtracted.regFindAddresses) {
      locations = { origin: cleanDataExtracted.regFindAddresses[0], destination: cleanDataExtracted.regFindAddresses[1] }
   } else if (cleanDataExtracted.indexedAddress) {
      locations = { origin: cleanDataExtracted.indexedAddress[0], destination: cleanDataExtracted.indexedAddress[1] }
   } else {
      locations = { origin: "NOTFOUND", destination: "NOTFOUND" }
   }
   // current index in this data
   const passengerRating = cleanDataExtracted.customerRating;
   const pay = cleanDataExtracted.pay
   const driverAppDistance = cleanDataExtracted.tripLength;
   const pickupDistance = cleanDataExtracted.pickupDistance;
   const pickupTimeEstimate = cleanDataExtracted.pickupTimeEstimate;
   const multipleStops = cleanDataExtracted.multipleStops;

   // returns string for http request and other

   console.log({ ...locations, passengerRating, pay, pickupDistance, pickupTimeEstimate });

   return { ...locations, passengerRating, pay, driverAppDistance, pickupDistance, pickupTimeEstimate }
}

// TODO: possible solution to same address and first part of the address, get random locations using the distance and approximate, verify they are within locality of the post code,
// calculate the using distance matrix and match the ones that fit with the given distance.