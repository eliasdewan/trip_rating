import { getOutcodeDataString } from "../common/outCodes";

export interface ExtractBolt {
  origin: string,
  destination: string,
  driverAppDistance: number,
  pay: number,
  pickupDistance: number,
  pickupTimeEstimate: number,
  appTripTimeEstimate: number,
  passengerRating: number
  multipleStops: boolean,
  destinationInfoString: string;
}

//.match(/(?:(\d+)\s*hr\s*)?(\d+)\s*mins\s*\((\d+(\.\d+)?)\s*mi\)/);

export function extractBoltData(boltJsonData: { [key: string]: string }[]): ExtractBolt | any {
  const extract: Partial<ExtractBolt> = { multipleStops: false };
  try {
    for (let i = 0; i < boltJsonData.length; i++) {
      // console.log(extract);
      const text = boltJsonData[i].text;
      // console.log(text);


      // let payLine = text.match(/^£(\d+.\d{2})/);
      // if (payLine) {
      //   extract.pay = parseFloat(payLine[1]);
      // }

      // Check for the pay string (e.g., "£5.59 · Net")
      if (text.includes('£') && text.includes('Net,')) {
        extract.pay = Number(text.split(' ')[0].replace('£', ''));
        if (extract.driverAppDistance === 0.404) {
          extract.driverAppDistance = extract.pay;
          // FIXME: Adapt in score, so this distance could be ignored

        }
      }


      if (i > 4 && boltJsonData[i + 3] && boltJsonData[i - 2]?.text.includes('★')) {
        if (boltJsonData[i - 1].text.includes('ft') || boltJsonData[i - 1].text.includes('mi')) {
          extract.origin = text;
        }
      }

      if (i > 6 && boltJsonData[i + 1]?.text.includes('Accept')) {
        extract.destination = text;
      }

      // (?:\b(\d+)\s+hr\s+)?(\d+)\s+min.*?\b(\d+(?:\.\d+))\s+mi


      if (text.includes('min') && text.includes('•')) {
        let timeMinutes, distanceMiles;
        console.log("🐱", "min and mi", text);

        if (text.length > 8) {

          const parts = text.split(' • ');

          if (text.includes('mi')) {
            distanceMiles = parseFloat(parts[1].replace(' mi', ''));
          } else if (text.includes('ft')) {
            const feet = parseFloat(parts[1].replace(' ft', ''));
            distanceMiles = (feet / 5280); // Convert feet to miles and fix to 2 decimal places
          }

          if (text.includes('min') && !text.includes('hr')) {
            timeMinutes = parseFloat(parts[0].replace(' min', ''));
          } else if (text.includes('hr')) {
            //TODO: convert hr min to minutes when you find example
            const splitEstimateTime = parts[0].split('hr');
            const estimateHours = parseFloat(splitEstimateTime[0]);
            const estimateMins = parseFloat(splitEstimateTime[1].replace('min', ''));
            timeMinutes = (estimateHours * 60 + estimateMins); // Convert feet to miles and fix to 2 decimal places
          }
        }

        console.log("🦊", distanceMiles, timeMinutes);


        if (boltJsonData[i - 1].text.includes('★')) {
          extract.pickupDistance = distanceMiles;
          extract.pickupTimeEstimate = timeMinutes;
          // pickup
        } else if (boltJsonData[i + 2].text.includes('Accept')) {
          // trip details
          extract.driverAppDistance = distanceMiles;
          extract.appTripTimeEstimate = timeMinutes;
        }

      }

      // Check multiple stops

      if (text.match(/\d+ stop/)) {
        extract.multipleStops = true;
      }

      // Check for the pickup time estimate (e.g., "1 min")
      if (text.endsWith(' min') && !boltJsonData[i + 1].text.includes('•')) {
        if (boltJsonData[i + 1].text.endsWith('ft') || boltJsonData[i + 1].text.includes('mi')) {
          extract.pickupTimeEstimate = parseInt(text.replace(' min', ''), 10); // Convert to integer
        }
      }

      // Check for the passenger rating (e.g., "5.0")
      if (text.includes('★')) {
        extract.passengerRating = parseFloat(text.match(/(\d\.\d)/)![1]);
      }
    }

    extract.destinationInfoString = getOutcodeDataString(extract.origin as string, extract.destination as string);

    return extract as ExtractBolt;
  } catch (error) {
    console.log('Data extraction failed', error);
    // return error;

  }
}
