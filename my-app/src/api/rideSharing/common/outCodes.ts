import { object, string } from "zod";
import { DetailedOutcode, aroundLondonOutcodes, multiCentralLondonOutcodes } from "../../../data/location/outcodesData";
import { postCodelocality, DetailedPostalCode } from '../../../data/location/postCodeArea';
import { extractData } from '../uber/uber.service';

// const outcodeRegex = /^([A-Z]{1,2}\d{1,2}[A-Z]?)/ // checks for outcode and grabs from string (outcode and subOutcodes)
// const outcodeRegex = /^([A-Z]{1,2}\d{1,2}[A-Z]?)\b(?=[^,]*,?)/ //STRONG checks for outcode and grabs from string (outcode and subOutcodes)
// const subOutcodeRegex = /^([A-Z]{1,2}\d)[A-Z]$\b/ // grabs outcode from suboutcode (EC2M) will match but will grab (EC2)
// const postalAreaRegex = /^([A-Z]{1,2})\d{1,2}$/ // Grabs the postal area from outcode, no multicode
// TODO:  Sub outcode is the main searching method
const outcodeRegex = /([A-Z]{1,2}\d{1,2}[A-Z]?)\s*/;
const subOutcodeRegex = /([A-Z]{1,2}\d{1,2})[A-Z]$/;
const postalAreaRegex = /^([A-Z]{1,2})/;


// FIXME: FOR MULTICENTRAL CHECH THE OUTCODE IS IN THE LIST AND USE THE KEY  from outcode data file

const checkOutcode = (text: string) => text.match(outcodeRegex);
const testOutcodei = (text: string) => outcodeRegex.test(text);

const getOutcode = (text: string) => { const outcodeMatch = text.match(outcodeRegex); return outcodeMatch ? outcodeMatch[1] : "" }

const getSubOtcode = (text: string) => { const subOutcodeMatch = getOutcode(text).match(subOutcodeRegex); return subOutcodeMatch ? subOutcodeMatch[1] : "" }
const getPostalCode = (text: string) => { const postalCodeMatch = getOutcode(text).match(postalAreaRegex); return postalCodeMatch ? postalCodeMatch[1] : ""; }

// Gets the name only from location
export function getOutcodeArea(outCodeString: string) {
  const result = getOutcodeData(outCodeString)
  if (typeof (result) === "string") {
    return null;
  } else return result.localityName;
}

export function getOutcodeDataString(origin: string, destination: string) {
  const originResult = getOutcodeData(origin);
  const destinationResult = getOutcodeData(destination);

  // For creating string about increasing or decreasing distance from london
  let inOutString = "";
  if (typeof (originResult) != "string" && typeof (destinationResult) != "string") {

    // Measure negative or positive from London
    let inOutMiles = originResult.distanceFromLondon - destinationResult.distanceFromLondon;

    // Use measurement to state if going inward or outward 
    if (inOutMiles >= 0) {
      inOutString = `IN ${Math.abs(inOutMiles)}`
    } else {
      inOutString = `OUT ${Math.abs(inOutMiles)}`
    }
  }

  if (typeof (destinationResult) === "string") {
    return destinationResult;
  } else if ("TFLZone" in destinationResult) {
    // commenting out the from london after direction from london
    return `${inOutString} | Zone ${destinationResult.TFLZone} (${destinationResult.distanceFromLondon}m ${destinationResult.directionFromLondon}) ${destinationResult.localityName} ${destinationResult.areaName}`
  }
  else return `${inOutString} | LONG (${destinationResult.distanceFromLondon}m ${destinationResult.directionFromLondon}) ${destinationResult.localityName}`
}

// returns the outcode data object, destination is with basically ex: SW7, Kensington
export function getOutcodeData(destinationString: string) {

  const subOutcode = getSubOtcode(destinationString);
  const outcode = getOutcode(destinationString);
  const postalCode = getPostalCode(destinationString);
  // console.log("{all}", "1", subOutcode, "2", outcode, "3", postalCode);

  if (checkOutcode(destinationString)) {
    if (multiCentralLondonOutcodes[subOutcode] || multiCentralLondonOutcodes[outcode]) {
      return multiCentralLondonOutcodes[subOutcode] ? { outcode, subOutcode, ...multiCentralLondonOutcodes[subOutcode] } : { outcode, ...multiCentralLondonOutcodes[outcode] };
    }

    else if (aroundLondonOutcodes[outcode]) {
      return { outcode, ...aroundLondonOutcodes[outcode] };
    }
    else if (postCodelocality[postalCode]) {
      return { postalCode, ...postCodelocality[postalCode] };
    } else {
      console.log("No postal code found in data");
      return "No postal in data"
    }

  } else if (localitySearch(destinationString)) {
    //FIXME: this repeats the locality name if there is only locality name , here or somewhere it does duplicate
    const locality = localitySearch(destinationString);
    return locality ? getOutcodeData(locality.outcode) : "No outcode"

  } else {
    console.log("no outcode found"); // probably airport or a major area
    return "No outcode"
  }
}


// Takes locality name and return the full form array
export function localitySearch(locality: string) {
  for (const outcode in multiCentralLondonOutcodes) {
    if (multiCentralLondonOutcodes[outcode].localityName === locality) {
      return { outcode, ...multiCentralLondonOutcodes[outcode] }; // Return the outcode and location data
    }
  }

  for (const outcode in aroundLondonOutcodes) {
    if (aroundLondonOutcodes[outcode].localityName === locality) {
      return { outcode, ...aroundLondonOutcodes[outcode] }; // Return the outcode and location data
    }
  }
  for (const outcode in postCodelocality) {
    if (postCodelocality[outcode].localityName === locality) {
      return { outcode, ...postCodelocality[outcode] }; // Return the outcode and location data
    }
  }
  return null; // Return null if not found

}

// Only replaces locality name if outcode in data set, if no outcode, a locality search will check
// Add more functionality maybe where outcode is added to missing address.
export function fixSearchAddress(address: string) {
  const localityName = getOutcodeArea(address);
  console.log(localityName);
  // FIXME: this in conjunction with no outcode does locality search, the split is the locality and adds locality making  just repeating area name/locality
  
  if (localityName) {
    return address.split(",")[0] + ", " + localityName;
  }

  if (address === localityName) {
    return address.concat(' uk')
  }


  const addressData = getOutcodeData(address);
  if (typeof (addressData) === 'string') {
    console.log("GENERIC ADDRESS");
  }
  console.log(addressData);

  //TODO: if its in london replace with the the second part with london

  // if locality data is found means, more data needs be added for search
  // const localityData = localitySearch(address); outcode data does this


  return address.concat(' uk')

}   