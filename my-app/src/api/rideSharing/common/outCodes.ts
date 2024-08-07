import { object } from "zod";
import { DetailedOutcode, aroundLondonOutcodes, multiCentralLondonOutcodes } from "../../../data/location/outcodesData";
import { postCodelocality, DetailedPostalCode } from '../../../data/location/postCodeArea';

// const outcodeRegex = /^([A-Z]{1,2}\d{1,2}[A-Z]?)/ // checks for outcode and grabs from string (outcode and subOutcodes)
const outcodeRegex = /^([A-Z]{1,2}\d{1,2}[A-Z]?)\b(?=[^,]*,?)/ //STRONG checks for outcode and grabs from string (outcode and subOutcodes)
const subOutcodeRegex = /^([A-Z]{1,2}\d)[A-Z]$\b/ // grabs outcode from suboutcode
const postalAreaRegex = /^([A-Z]{1,2})\d{1,2}$/ // Grabs the postal area from outcode, no multicode

const checkOutcode = (text: string) => text.match(outcodeRegex);
const testOutcodei = (text: string) => outcodeRegex.test(text);

const getOutcode = (text: string) => { const outcodeMatch = text.match(outcodeRegex); return outcodeMatch ? outcodeMatch[1] : "" }

const getSubOtcode = (text: string) => { const subOutcodeMatch = getOutcode(text).match(subOutcodeRegex); return subOutcodeMatch ? subOutcodeMatch[1] : "" }
const getPostalCode = (text: string) => { const postalCodeMatch = getOutcode(text).match(postalAreaRegex); return postalCodeMatch ? postalCodeMatch[1] : ""; }

export function getOutcodeDataString(outCodeString: string) {
  const result = getOutcodeData(outCodeString)
  if (typeof (result) === "string") {
    return result;
  } else if ("TFLZone" in result) {
    return `Zone ${result.TFLZone} ${result.distanceFromLondon}m ${result.directionFromLondon} from London, ${result.localityName} ${result.areaName}`
  }
  else return `LONG ${result.distanceFromLondon}m ${result.directionFromLondon} from London, ${result.localityName}`
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