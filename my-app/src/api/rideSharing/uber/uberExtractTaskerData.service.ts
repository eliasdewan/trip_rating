
const stringCommaString = "^[^,]+,[^,]+$"
const integerRegex = /\b\d+\b/
const dicimalRegex = /\d+\.\d+/

export default function uberExtractData(jsonData: any) {
  const textList: string[] = jsonData.map(item => item.text)

  // Logging expected results
  let status: { [key: string]: any } = { "logging": true };

  // Holiday pay and away index [-- finding with words (holiday and away) --]
  let holidayPayIndex: number = textList.findIndex(line => line.includes("holiday pay"))
  let awayIndex: number = textList.findIndex(line => line.includes("away"))

  status.awayHolidayPass = awayIndex - holidayPayIndex === 1 ? true : false // cheecking the order is right
  status.holidayPayIndex = holidayPayIndex;
  status.holidayPayString = textList[holidayPayIndex];
  status.awayIndex = awayIndex;
  status.awayIndex = textList[awayIndex];

  // Pickup distance and time estimate
  let pickupDistance = Number(dicimalRegex.exec(textList[awayIndex]))
  let pickupTimeEstimate = Number(integerRegex.exec(textList[awayIndex]))
  status.pickupDistance = pickupDistance;
  status.pickupTimeEstimate = pickupTimeEstimate;

  // Address array finding with regex match [-- string comma string --]
  // most likely not safe !!! it will fail if thres mnore than 2
  let regfindAddresses = textList.filter(i => i.match(stringCommaString))
  //console.log(regfindAddresses);
  status.regFindaddressarrayPass = regfindAddresses.length === 2 ? true : false // cheecking the order is right
  status.regfindAddresses = regfindAddresses;

  //Address index based extraction
  let indexedAddress = [textList[awayIndex +1 ], textList[awayIndex +3 ]]
  status.regFindaddressarrayPass = regfindAddresses.length === 2 ? true : false // cheecking the order is right
  status.indexedAddress = indexedAddress;



  // Trip length fidning with string [-- mi trip --]
  let tripLenthIndex = textList.findIndex(line => line.includes("mi trip"))
  //console.log(textList[tripLenthIndex])
  status.tripLenthPass = tripLenthIndex - awayIndex === 2 ? true : false // cheecking the order is right
  status.tripLenthIndex = tripLenthIndex;
  status.tripLength = Number(dicimalRegex.exec(textList[tripLenthIndex])?.find(Number));


  // Pay find finding with string pound sign next to holiday pay[-- £ --]
  let payIndex = textList[holidayPayIndex - 2].includes("£") ? holidayPayIndex - 2 : 0;
  let pay = textList[payIndex];
  //console.log(textList[payIndex]);
  status.payPass = tripLenthIndex - awayIndex === 2 ? true : false; // cheecking the order is right
  status.pay = Number(pay.replace("£", ""));

  // Pay alternative from holiday calculating with regex and sum of holiday pay and normal pay
  const numbers = textList[holidayPayIndex].match(/[\d.]+/g).map(Number).filter(i => i > 0);
  let payWithHoliday = numbers.reduce((sum, num) => sum + num, 0);
   //console.log(payWithHoliday, "pay with holiday", numbers, textList[holidayPayIndex]);
  status.calculatedPayPass = payWithHoliday > 0 ? true : false // cheecking the order is right
  status.calculatedPayPass = payWithHoliday;

  // Customer rating fiding next to holiday pay [-- 0 to 5 rating --]
  let customerRating: number = Number(textList[holidayPayIndex - 1]);
  // console.log(customerRating);
  status.customerRating = Number(customerRating);
  status.customerRatingPass = customerRating > 0 && customerRating <= 5 ? true : false // cheecking the order is right


  //console.log(status);
  return status;
}

// console.log(textList[holidayPayIndex], textList[awayIndex]);
// const newList = textList.slice(holidayPayIndex-3,holidayPayIndex+6)
// console.log(newList);