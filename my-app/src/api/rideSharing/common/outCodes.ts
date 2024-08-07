import { aroundLondonOutcodes, multiCentralLondonOutcodes } from "../../../data/location/outcodes";
import { postCodelocality } from "../../../data/location/postCodeArea";

// const outcodeRegex = /^([A-Z]{1,2}\d{1,2}[A-Z]?)/ // checks for outcode and grabs from string (outcode and subOutcodes)
const outcodeRegex = /^([A-Z]{1,2}\d{1,2}[A-Z]?)\b(?=[^,]*,?)/ //STRONG checks for outcode and grabs from string (outcode and subOutcodes)
const subOutcodeRegex = /^([A-Z]{1,2}\d)[A-Z]$\b/ // grabs outcode from suboutcode
const postalAreaRegex = /^([A-Z]{1,2})\d{1,2}$/ // Grabs the postal area from outcode, no multicode

const checkOutcode = (text: string) => text.match(outcodeRegex);
const testOutcodei = (text: string) => outcodeRegex.test(text);

const getOutcode = (text: string) => { const outcodeMatch = text.match(outcodeRegex); return outcodeMatch ? outcodeMatch[1] : "" }

const getSubOtcode = (text: string) => { const subOutcodeMatch = getOutcode(text).match(subOutcodeRegex); return subOutcodeMatch ? subOutcodeMatch[1] : "" }
const getPostalCode = (text: string) => { const postalCodeMatch = getOutcode(text).match(postalAreaRegex); return postalCodeMatch ? postalCodeMatch[1] : ""; }

export function getOutcodeData(destinationString = "SE85, Southall") {

  if (checkOutcode(destinationString)) {
    // start checking outcode
    if (multiCentralLondonOutcodes[getSubOtcode(destinationString)]) {
      const result = multiCentralLondonOutcodes[getSubOtcode(destinationString)];
      console.log("getting the multiCentralLondonOutcodes info for:", destinationString);
      console.log(JSON.stringify(multiCentralLondonOutcodes[getSubOtcode(destinationString)]));
      `${result.distanceFromLondon}m ${result.directionFromLondon} from London, ${result.localityName} ${result.areaName}`

    } else if (multiCentralLondonOutcodes[getOutcode(destinationString)]) {
      const result = multiCentralLondonOutcodes[getOutcode(destinationString)];
      console.log("getting the multiCentralLondonOutcodes (but was given outcode) info for:", destinationString);
      console.log(JSON.stringify(multiCentralLondonOutcodes[getOutcode(destinationString)]));
      return `${result.distanceFromLondon}m ${result.directionFromLondon} from London, ${result.localityName} ${result.areaName}`
    }
    else if (aroundLondonOutcodes[getOutcode(destinationString)]) {
      const result = aroundLondonOutcodes[getOutcode(destinationString)];
      console.log("getting the aroundLondonOutcodes info for:", destinationString);
      console.log(JSON.stringify(aroundLondonOutcodes[getOutcode(destinationString)]));
      `${result.distanceFromLondon}m ${result.directionFromLondon} from London, ${result.localityName} ${result.areaName}`
    }
    else if (postCodelocality[getPostalCode(destinationString)]) {
      const result = postCodelocality[getPostalCode(destinationString)];
      console.log("getting the postal info for:", destinationString);
      console.log(JSON.stringify(postCodelocality[getPostalCode(destinationString)]));
      return `${result.distanceFromLondon}m ${result.directionFromLondon} from London, ${result.localityName}`
    } else {
      console.log("No postal code found in data");
      return "No postal in data"
    }

  } else {
    console.log("no outcode found"); // probably airport or a major area
    return "No outcode"
  }

}