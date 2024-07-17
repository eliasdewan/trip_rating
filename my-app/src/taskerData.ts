const jsonData = [
  { "text": "Finding trips" },
  { "text": "Trip planner" },
  { "text": "Uber Pro Blue" },
  { "text": "Elias Roni" },
  { "text": "4.94" },
  { "text": "Inbox" },
  { "text": "7" },
  { "text": "Refer friends" },
  { "text": "0" },
  { "text": "Opportunities" },
  { "text": "0" },
  { "text": "Earnings" },
  { "text": "0" },
  { "text": "Uber Pro" },
  { "text": "0" },
  { "text": "Wallet" },
  { "text": "0" },
  { "text": "Account" },
  { "text": "Help" },
  { "text": "Tips \u0026 Info" },
  { "text": "UberX" },
  { "text": "£34.61" },
  { "text": "4.64" }, // 22
  { "text": "£31.57 + est. holiday pay of £3.04" }, //23
  { "text": "2 mins (0.1 mi) away" }, //24
  { "text": "2 mins (0.1 mi) away" }, //24
  { "text": "UB2, Southall" },    // 25
  { "text": "19.7 mi trip" },     // 26
  { "text": "E14, London" },      // 27
  { "text": "Long trip (60+ min)" },
  { "text": "Confirm" }]

// Dummy data, tasker format
const textList: string[] = jsonData.map(item => item.text)

export function extractData() {
  const locations = { origin: textList[25], destination: textList[27] } // current index in this data
  const passengerRating: number = +textList[22]
  const dicimalRegex = /\d+\.\d+/
  const pay: number = Number(dicimalRegex.exec(textList[23]))  // first decimal number
  const pickupDistance = Number(dicimalRegex.exec(textList[24]))
  const integerRegex = /\b\d+\b/

  const pickupTimeEstimate = Number(integerRegex.exec(textList[24]))

  // returns string for http requrest and other
  return { ...locations, passengerRating , pay , pickupDistance, pickupTimeEstimate}
}