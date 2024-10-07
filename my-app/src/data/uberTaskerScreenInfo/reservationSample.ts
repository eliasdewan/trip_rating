// Reservation trip request, during trip might just be alright
// Doesn't have holiday pay line instead, reservation fee
// Exact pickup address and drop off address instead of outcode

export default [{ "text": "UberX Reserve" },
{ "text": "£22" },
{ "text": "4.87" },
{ "text": "£6.00 reservation fee included" }, // This is included in the pay text so the total pay is pay at the top
{ "text": "12 mins (3.1 mi) away" },
{ "text": "Avenue Road \u0026 Outer Circle, London" },
{ "text": "13 mins (2.4 mi) trip" },
{ "text": "London Euston Train Station (EUS), London" },
{ "text": "Confirm" }
]

const sample = [{ "text": "UberX" },
{ "text": "£34.61" },
{ "text": "4.64" }, // 22
{ "text": "£31.57 + est. holiday pay of £3.04" }, //23
{ "text": "2 mins (0.1 mi) away" }, //24
{ "text": "UB2, Southall" },    // 25
{ "text": "19.7 mi trip" },     // 26
{ "text": "E14, London" },      // 27
{ "text": "Long trip (60+ min)" },
{ "text": "Confirm" }]