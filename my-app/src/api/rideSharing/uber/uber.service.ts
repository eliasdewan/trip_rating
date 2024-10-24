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

function spellingCheck(address: string) {
   const knownMisspellings: { [key: string]: string } = {
      Harov: "Harrow"
   }
   //(SW7, Kensington) also doesn't work use (SW7, London); Fulham; Tottenham

   if (Object.hasOwn(knownMisspellings, address)) {
      return knownMisspellings[address]
   }

}

// README: if no outcode or bad match, check with the outcode list and fix missing and misspelling 
// in in central london outcode list, replace to london

// check location type 
// add or fix the mistake if its just a little bit
// get the location lat lng from header
// No address: Confirm, Match, 5.3 mi trip,Towards your destination,
// SELECT * FROM successlogs WHERE entry like '%error%'  and data not like '%Harov%' and data not like '%Match%' and data not like '%Confirm%'ORDER BY (id) DESC limit 38json 


//All area names with n e s w are london,
//all other areas are different 

// bolt for using origin use the csv