/**
 *  Data from uber app , trip request sample
 */
export const failedRequest = [
  { "text": "UberX" },
  { "text": "£12.49" },
  { "text": "4.47" },
  { "text": "£15.83 + est. holiday pay of £1.08" },
  { "text": "2 mins (0.3 mi) away" },
  { "text": "UB2, London" },
  { "text": "6.0 mi trip" },
  { "text": "W3, London" },
  { "text": "Confirm" }
]

export const dummyJsonData = [
  { "text": "UberX" },
  { "text": "£38.91" },
  { "text": "4.34" }, // 22
  { "text": "£36.57 + est. holiday pay of £3.04" }, //23
  { "text": "2 mins (0.5 mi) away" }, //24
  { "text": "UB2, Southall" },    // 25
  { "text": "13.7 mi trip" },     // 26
  { "text": "E14, London" },      // 27
  { "text": "Long trip (60+ min)" },
  { "text": "Confirm" }]

const strangeUberFormat = [
  {"text": "UberX"},
  {"text": "£56.20"},
  {"text": "5.00"},
  {"text": "£51.58 + est. holiday pay of £4.62"},
  {"text": "1 min (0.1 mi) away"},
  {"text": "40.5 mi trip"}, // Instead of origin , its just destination // FIXME: solution to no origin
  {"text": "AL7, Welwyn Garden City"},
  {"text": "Long trip (60+ min)"},
  {"text": "Confirm"}
]