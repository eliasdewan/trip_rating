import { object } from "zod";
import { DetailedOutcode, aroundLondonOutcodes, multiCentralLondonOutcodes } from "../../../data/location/outcodesData";
import { postCodelocality, DetailedPostalCode } from '../../../data/location/postCodeArea';

// const outcodeRegex = /^([A-Z]{1,2}\d{1,2}[A-Z]?)/ // checks for outcode and grabs from string (outcode and subOutcodes)
// const outcodeRegex = /^([A-Z]{1,2}\d{1,2}[A-Z]?)\b(?=[^,]*,?)/ //STRONG checks for outcode and grabs from string (outcode and subOutcodes)
// const subOutcodeRegex = /^([A-Z]{1,2}\d)[A-Z]$\b/ // grabs outcode from suboutcode
// const postalAreaRegex = /^([A-Z]{1,2})\d{1,2}$/ // Grabs the postal area from outcode, no multicode

const outcodeRegex = /([A-Z]{1,2}\d{1,2}[A-Z]?)\s*/;
const subOutcodeRegex = /^([A-Z]{1,2}\d{1,2})$/;
const postalAreaRegex = /^([A-Z]{1,2})/;




const checkOutcode = (text: string) => text.match(outcodeRegex);
const testOutcodei = (text: string) => outcodeRegex.test(text);

const getOutcode = (text: string) => { const outcodeMatch = text.match(outcodeRegex); return outcodeMatch ? outcodeMatch[1] : "" }

const getSubOtcode = (text: string) => { const subOutcodeMatch = getOutcode(text).match(subOutcodeRegex); return subOutcodeMatch ? subOutcodeMatch[1] : "" }
const getPostalCode = (text: string) => { const postalCodeMatch = getOutcode(text).match(postalAreaRegex); return postalCodeMatch ? postalCodeMatch[1] : ""; }

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
    if (inOutMiles >= 0){
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

export function getOutcodeData(destinationString: string) {

  if (checkOutcode(destinationString)) {
    if (multiCentralLondonOutcodes[getSubOtcode(destinationString)] || multiCentralLondonOutcodes[getOutcode(destinationString)]) {
      return multiCentralLondonOutcodes[getSubOtcode(destinationString)] ? multiCentralLondonOutcodes[getSubOtcode(destinationString)] : multiCentralLondonOutcodes[getOutcode(destinationString)];
    }
    else if (aroundLondonOutcodes[getOutcode(destinationString)]) {
      return aroundLondonOutcodes[getOutcode(destinationString)];
    }
    else if (postCodelocality[getPostalCode(destinationString)]) {
      return postCodelocality[getPostalCode(destinationString)];
    } else {
      console.log("No postal code found in data");
      return "No postal in data"
    }

  } else {
    console.log("no outcode found"); // probably airport or a major area
    return "No outcode"
  }

}