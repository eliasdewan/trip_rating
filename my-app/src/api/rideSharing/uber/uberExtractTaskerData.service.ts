const stringCommaString = "^[^,]+,[^,]+$"
const integerRegex = /\b\d+\b/
const decimalRegex = /\d+\.\d+/

type cleanExtractedUberData = {
  awayIndex: number,
  away: string,
  payStructureIndex: number, // holiday pay or reservation fee
  payStructureString: string,
  payStructureIndexPass: boolean,

  reservation: boolean;

  pickupDistance: number,
  pickupTimeEstimate: number,

  multipleStops: boolean,

  regFindAddressArrayPass: boolean,
  regFindAddresses: string[],

  indexedAddressPass: boolean,
  indexedAddress: string[],
  noOrigin: boolean,


  tripLengthIndexPass: boolean,
  tripLength: number,
  tripLengthIndex: number,

  uberTripDurationMinutes: number,
  uberTripDurationArrayHourMinutes: number[],
  uberTripDurationPass: boolean,

  customerRating: number,
  customerRatingPass: boolean


  calculatedPay: number, // Pay with holiday or reservation fee
  calculatedPayPass: boolean,

  pay: number,
  payPass: boolean,

}



export default function uberExtractData(jsonData: any) {
  const textList: string[] = jsonData.map((item: { text: string; }) => item.text)

  // Logging expected results
  let status: Partial<cleanExtractedUberData> = {};

  // Holiday pay and away index [-- finding with words (holiday and away) --]
  let payStructureIndex: number = textList.findIndex(line => line.includes("holiday pay"));

  if (payStructureIndex === -1) {
    payStructureIndex = textList.findIndex(line => line.includes("reservation"));
    status.reservation = true;
  }

  // Find the first occurrence of time and distance, including "<1 min (0 mi)"
  let awayIndex = textList.findIndex(line =>
    line.match(/\d+\s*min(s)?\s*\(\d+(\.\d+)?\s*mi\)/)
  );

  if (awayIndex !== -1) {
    const awayMatch = textList[awayIndex].match(/(\d+)\s*min(?:s)?\s*\((\d+(\.\d+)?)\s*mi\)/) // Match "<1 min (0 mi)"

    if (awayMatch) {
      status.pickupTimeEstimate = awayMatch[1] ? Number(awayMatch[1]) : 0; // Extract time in minutes
      status.pickupDistance = Number(awayMatch[2]); // Extract distance in miles
    }
  }

  status.payStructureIndexPass = awayIndex - payStructureIndex === 1 ? true : false // checking the order is right
  status.payStructureIndex = payStructureIndex;
  status.payStructureString = textList[payStructureIndex];
  status.awayIndex = awayIndex;
  status.away = textList[awayIndex];

  // TODO: uber could have only one address or no origin, only destination.

  // Address array finding with regex match [-- string comma string --]
  // most likely not safe !!! it will fail if there is more than 2
  let regFindAddresses = textList.filter(i => i.match(stringCommaString))
  status.regFindAddressArrayPass = regFindAddresses.length === 2 ? true : false // checking the order is right
  status.regFindAddresses = regFindAddresses;

  // Find the next occurrence of "mins" or "hr min" and "mi" for trip length, starts after awayIndex
  let tripLengthIndex = textList.findIndex((line, index) =>
    index > awayIndex && line.match(/(\d+\s*hr\s*)?(\d+)\s*mins\s*\(\d+(\.\d+)?\s*mi\)/)
  );

  if (tripLengthIndex !== -1) {
    let tripMatch = textList[tripLengthIndex].match(/(?:(\d+)\s*hr\s*)?(\d+)\s*mins\s*\((\d+(\.\d+)?)\s*mi\)/);

    if (tripMatch) {
      const hours = tripMatch[1] ? Number(tripMatch[1]) : 0; // Extract hours if present
      const minutes = Number(tripMatch[2]); // Extract minutes
      status.uberTripDurationMinutes = hours * 60 + minutes; // Convert to total minutes
      status.tripLength = Number(tripMatch[3]); // Extract trip length in miles
    }
  }


  //Address index based extraction TODO: data can have address origin specific on the next line after outcode, in plcae of diatance
  let indexedAddress: string[] = [];
  if (awayIndex !== -1 && tripLengthIndex !== -1) {
    indexedAddress = [textList[awayIndex + 1], textList[tripLengthIndex + 1]];
  }
  status.indexedAddress = indexedAddress;
  status.indexedAddressPass = indexedAddress.length === 2;


  // Multiple Stops - if multiple stops are found, consider adding static duration
  status.multipleStops = false;
  if (textList.find(text => text.includes('Multiple stops'))) {
    status.multipleStops = true;
  }

  // Pay find finding with string pound sign next to holiday pay[-- £ --]
  let payIndex = textList[payStructureIndex - 2].includes("£") ? payStructureIndex - 2 : 0;

  let pay = textList[payIndex];
  //console.log(textList[payIndex]);
  status.payPass = tripLengthIndex - awayIndex === 2 ? true : false; // checking the order is right
  status.pay = Number(pay.replace("£", ""));

  const payStructureMatch = textList[payStructureIndex].match(/[\d.]+/g);
  const payStructureNumbers = payStructureMatch ? payStructureMatch.map(Number).filter(i => i > 0) : [];
  if (status.reservation) {
    status.calculatedPayPass = false;
    status.calculatedPay = status.pay;
  } else {
    // Pay alternative from holiday calculating with regex and sum of holiday pay and normal pay
    let payWithHoliday = payStructureNumbers.reduce((sum, num) => sum + num, 0);
    //console.log(payWithHoliday, "pay with holiday", numbers, textList[holidayPayIndex]);
    status.calculatedPayPass = payWithHoliday > 0 ? true : false // checking the order is right
    status.calculatedPay = payWithHoliday;

  }
  // Customer rating finding next to holiday pay [-- 0 to 5 rating --]
  let customerRating: number = Number(textList[payStructureIndex - 1]);
  // console.log(customerRating);
  status.customerRating = Number(customerRating);
  status.customerRatingPass = customerRating > 0 && customerRating <= 5 ? true : false // cheecking the order is right


  console.log(status, "++++++++++++++");
  return status;
}

// console.log(textList[holidayPayIndex], textList[awayIndex]);
// const newList = textList.slice(holidayPayIndex-3,holidayPayIndex+6)
// console.log(newList);