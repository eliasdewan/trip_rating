export interface ExtractBolt {
  origin: string,
  destination: string,
  driverAppDistance: number,
  pay: number,
  pickupDistance: number,
  pickupTimeEstimate: number,
  passengerRating: number
  multipleStops: boolean,
}



export function extractBoltData(boltJsonData: { [key: string]: string }[]): ExtractBolt | any {
  const extract: Partial<ExtractBolt> = { multipleStops: false };
  try {
    for (let i = 0; i < boltJsonData.length; i++) {
      // console.log(extract);
      const text = boltJsonData[i].text;
      // console.log(text);

      if (i > 3 && boltJsonData[i + 3] && boltJsonData[i + 3]?.text.includes('•')) {
        if (boltJsonData[i - 1].text.includes('ft') || boltJsonData[i - 1].text.includes('mi')) {
          extract.origin = text;
        }
      }
      if (i > 4 && boltJsonData[i + 2] && boltJsonData[i + 2]?.text.includes('•')) {
        if (text.includes('•') && text.length > 8) {
          const parts = text.split(' • ');
          extract.destination = parts[0];
          if (parts[1].includes('mi')) {
            extract.driverAppDistance = parseFloat(parts[1].replace(' mi', ''));


          } else if (parts[1].includes('ft')) {
            const feet = parseFloat(parts[1].replace(' ft', ''));
            extract.driverAppDistance = (feet / 5280); // Convert feet to miles and fix to 2 decimal places


          }
        } else {
          extract.destination = text;
          extract.driverAppDistance = 0.404;


        }
        extract.destination = extract.destination.concat(" UK"); //  Mitigation for when the postcode like N5 and used in uk
      }

      // Check for the pay string (e.g., "£5.59 · Net")
      if (text.includes('£') && text.includes('· Net')) {
        extract.pay = Number(text.split(' ')[0].replace('£', ''));
        if (extract.driverAppDistance === 0.404) {
          extract.driverAppDistance = extract.pay;
          // FIXME: Adapt in score, so this distance could be ignored

        }
      }

      // Check multiple stops
      
      if (text.match(/\+ \d+ stops/)) {
        extract.multipleStops = true;
      }

      // Check for the pickup distance (e.g., "404 ft" or "2.2 mi")
      console.log(">", text);
      console.log("#", extract.pickupDistance);

      if (!text.includes('•')) {
        if (text.includes('ft')) {
          const feet = parseFloat(text.replace(' ft', ''));
          extract.pickupDistance = (feet / 5280); // Convert feet to miles and fix to 2 decimal places
        } else if (text.endsWith(' mi') && !text.endsWith(' min')) {
          console.log("trigger mi");
          extract.pickupDistance = parseFloat(text.replace(' mi', '')); // Already in miles
        }
      }

      // Check for the pickup time estimate (e.g., "1 min")
      if (text.endsWith(' min') && !boltJsonData[i + 1].text.includes('•')) {
        if (boltJsonData[i + 1].text.endsWith('ft') || boltJsonData[i + 1].text.includes('mi')) {
          extract.pickupTimeEstimate = parseInt(text.replace(' min', ''), 10); // Convert to integer
        }
      }

      // Check for the passenger rating (e.g., "5.0")
      if (parseFloat(text) >= 0 && parseFloat(text) <= 5 && text.includes('.') && boltJsonData[i + 1].text.includes('trip')) {
        extract.passengerRating = parseFloat(text);
      }


    }

    return extract as ExtractBolt;
  } catch (error) {
    console.log('Data extraction failed', error);
    // return error;

  }
}
