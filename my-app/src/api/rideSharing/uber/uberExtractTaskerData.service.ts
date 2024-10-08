
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


  tripLengthPass: boolean,
  tripLength: number,
  tripLengthIndex: number,

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
  // Reservation scenario
  let awayIndex: number = textList.findIndex(line => line.includes("away"));


  status.payStructureIndexPass = awayIndex - payStructureIndex === 1 ? true : false // checking the order is right
  status.payStructureIndex = payStructureIndex;
  status.payStructureString = textList[payStructureIndex];
  status.awayIndex = awayIndex;
  status.away = textList[awayIndex];

  // Pickup distance and time estimate in minutes and miles
  let pickupDistance = Number(decimalRegex.exec(textList[awayIndex]))
  let pickupTimeEstimate = Number(integerRegex.exec(textList[awayIndex]))
  status.pickupDistance = pickupDistance;
  status.pickupTimeEstimate = pickupTimeEstimate;

  // TODO: uber could have only one address or no origin, only destination.

  // Address array finding with regex match [-- string comma string --]
  // most likely not safe !!! it will fail if there is more than 2
  let regFindAddresses = textList.filter(i => i.match(stringCommaString))
  status.regFindAddressArrayPass = regFindAddresses.length === 2 ? true : false // checking the order is right
  status.regFindAddresses = regFindAddresses;

  // Trip length finding with string [-- mi trip --]
  let tripLengthIndex = textList.findIndex(line => line.includes("mi trip") || line.includes("mi) trip"))

  //console.log(textList[tripLengthIndex])
  status.tripLengthPass = tripLengthIndex - awayIndex === 2 ? true : false // checking the order is right
  status.tripLengthIndex = tripLengthIndex;
  status.tripLength = Number(decimalRegex.exec(textList[tripLengthIndex])?.find(Number));

  //Address index based extraction TODO: data can have address origin specific on the next line after outcode, in plcae of diatance
  let indexedAddress: string[] = [];
  // Extra precise origin
  if (textList[awayIndex + 3].includes("mi trip")) {
    indexedAddress.push(textList[awayIndex + 2] + ", " + textList[awayIndex + 1]);
    indexedAddress.push(textList[awayIndex + 4]);
  } 
  // No origin provided
  else if (textList[awayIndex + 1].includes("mi trip")) {
    status.noOrigin = true;
    indexedAddress = ["London", textList[awayIndex + 2]];
  } else {
    indexedAddress = [textList[awayIndex + 1], textList[awayIndex + 3]];
  }

  // No origin given


  status.indexedAddressPass = indexedAddress.length === 2 ? true : false // checking the order is right
  status.indexedAddress = indexedAddress;

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

  const payStructureNumbers = textList[payStructureIndex].match(/[\d.]+/g).map(Number).filter(i => i > 0);
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