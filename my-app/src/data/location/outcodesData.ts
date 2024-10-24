import { postCodelocality } from "./postCodeArea";

// This approach is o(1) for searching. looking up an object by key is most efficient
export interface DetailedOutcode {
  TFLZone: number,
  congestionZone: boolean,
  distanceFromLondon: number,
  directionFromLondon: "N" | "E" | "S" | "W" | "NE" | "NW" | "SE" | "SW",
  areaName: areaName,
  localityName: string,




  // Add area names
}

interface OutcodeData {
  [outcode: string]: DetailedOutcode;
}

// for each area -> days -> hours with earningRating
type area = {
  areaName: areaName,
  areaEarning: {
    day: day, // day of week
    times: {
      [hour: string]: number
    }[]
  }
}

type day = "Monday" |
  "Tuesday" |
  "Wednesday" |
  "Wednesday" |
  "Thursday" |
  "Friday" |
  "Saturday" |
  "Sunday";

// Area names from uber trends
type areaName =
  "West London" |
  "North West London" |
  "Congestion Charge Zone" |
  "South West London" |
  "North London" |
  "Outer West London" |
  "South East London" |
  "North East London" |
  "Outer North London" |
  "Redhill & Crawley" |
  "Luton & Milton Keynes" |
  "Outer East London"


// one example area
let WestLondon: area = {
  areaName: "West London",
  areaEarning: {
    day: "Friday",
    times: [{ "1pm": 3 }, { "1pm": 2 }]
  }
}

// Access using 
// const info = londonCodes[lookupPostcode];
// londonCodes.get
// Keys are automatically converted to string


const londonOutcodes = {
  "EC1": ["EC1A", "EC1M", "EC1N", "EC1R", "EC1V", "EC1Y"],
  "EC2": ["EC2A", "EC2M", "EC2N", "EC2R", "EC2V", "EC2Y"],
  "EC3": ["EC3A", "EC3M", "EC3N", "EC3R", "EC3V"],
  "EC4": ["EC4A", "EC4M", "EC4N", "EC4R", "EC4V", "EC4Y"],
  "WC1": ["WC1A", "WC1B", "WC1E", "WC1H", "WC1N", "WC1R", "WC1V", "WC1X"],
  "WC2": ["WC2A", "WC2B", "WC2E", "WC2H", "WC2N", "WC2R"],
  "W1": ["W1A", "W1B", "W1C", "W1D", "W1F", "W1G", "W1H", "W1J", "W1K", "W1M", "W1S", "W1T", "W1U", "W1W"],
  "SW1": ["SW1A", "SW1E", "SW1H", "SW1P", "SW1V", "SW1W", "SW1X", "SW1Y"],
  "SE1": ["SE1A", "SE1P", "SE1X"],
  "NW1": ["NW1A", "NW1B", "NW1C"],
  "N1": ["N1A", "N1B", "N1C"],
  "E1": ["E1A", "E1B", "E1C", "E1W"]
}

export const multiCentralLondonOutcodes: OutcodeData = {
  "EC1": { TFLZone: 1, congestionZone: true, directionFromLondon: "E", distanceFromLondon: 1.0, areaName: "Congestion Charge Zone", localityName: "Clerkenwell" },
  "EC2": { TFLZone: 1, congestionZone: true, directionFromLondon: "E", distanceFromLondon: 1.0, areaName: "Congestion Charge Zone", localityName: "Finsbury" },
  "EC3": { TFLZone: 1, congestionZone: true, directionFromLondon: "E", distanceFromLondon: 1.0, areaName: "Congestion Charge Zone", localityName: "Aldgate" },
  "EC4": { TFLZone: 1, congestionZone: true, directionFromLondon: "E", distanceFromLondon: 1.0, areaName: "Congestion Charge Zone", localityName: "Fleet Street" },
  "WC1": { TFLZone: 1, congestionZone: true, directionFromLondon: "W", distanceFromLondon: 1.0, areaName: "Congestion Charge Zone", localityName: "Bloomsbury" },
  "WC2": { TFLZone: 1, congestionZone: true, directionFromLondon: "W", distanceFromLondon: 1.0, areaName: "Congestion Charge Zone", localityName: "Covent Garden" },
  "W1": { TFLZone: 1, congestionZone: true, directionFromLondon: "W", distanceFromLondon: 1.0, areaName: "Congestion Charge Zone", localityName: "Marylebone" },
  "SW1": { TFLZone: 1, congestionZone: true, directionFromLondon: "SW", distanceFromLondon: 1.0, areaName: "Congestion Charge Zone", localityName: "Westminster" },
  "SE1": { TFLZone: 1, congestionZone: true, directionFromLondon: "SE", distanceFromLondon: 1.0, areaName: "Congestion Charge Zone", localityName: "Southwark" },
  "NW1": { TFLZone: 1, congestionZone: false, directionFromLondon: "NW", distanceFromLondon: 2.0, areaName: "North West London", localityName: "Camden" },
  "N1": { TFLZone: 1, congestionZone: false, directionFromLondon: "N", distanceFromLondon: 2.0, areaName: "North London", localityName: "Islington" },
  "E1": { TFLZone: 1, congestionZone: false, directionFromLondon: "E", distanceFromLondon: 2.0, areaName: "North East London", localityName: "Whitechapel" },

}

export const aroundLondonOutcodes: OutcodeData = {
  "SE11": { TFLZone: 1, congestionZone: true, directionFromLondon: "SE", distanceFromLondon: 2.0, areaName: "South East London", localityName: "Kennington" },//
  "SW8": { TFLZone: 1, congestionZone: false, directionFromLondon: "SW", distanceFromLondon: 2.0, areaName: "South West London", localityName: "Vauxhall" },
  "W2": { TFLZone: 1, congestionZone: false, directionFromLondon: "W", distanceFromLondon: 2.0, areaName: "West London", localityName: "Paddington" },
  "W8": { TFLZone: 1, congestionZone: false, directionFromLondon: "W", distanceFromLondon: 2.0, areaName: "West London", localityName: "Kensington" },
  // The above might be in just area 1
  "E2": { TFLZone: 2, congestionZone: false, directionFromLondon: "E", distanceFromLondon: 2.0, areaName: "North East London", localityName: "Bethnal Green" },
  "E3": { TFLZone: 2, congestionZone: false, directionFromLondon: "E", distanceFromLondon: 2.5, areaName: "North East London", localityName: "Bow" },
  "E4": { TFLZone: 3, congestionZone: false, directionFromLondon: "E", distanceFromLondon: 5.0, areaName: "North East London", localityName: "Chingford" },
  "E5": { TFLZone: 2, congestionZone: false, directionFromLondon: "E", distanceFromLondon: 5.0, areaName: "North East London", localityName: "Hackney" },
  "E6": { TFLZone: 3, congestionZone: false, directionFromLondon: "E", distanceFromLondon: 7.0, areaName: "North East London", localityName: "East Ham" },
  "E7": { TFLZone: 3, congestionZone: false, directionFromLondon: "E", distanceFromLondon: 6.5, areaName: "North East London", localityName: "Upton Park" },
  "E8": { TFLZone: 2, congestionZone: false, directionFromLondon: "E", distanceFromLondon: 3.0, areaName: "North East London", localityName: "Dalston" },
  "E9": { TFLZone: 2, congestionZone: false, directionFromLondon: "E", distanceFromLondon: 4.5, areaName: "North East London", localityName: "Homerton" },
  "E10": { TFLZone: 3, congestionZone: false, directionFromLondon: "E", distanceFromLondon: 6.0, areaName: "North East London", localityName: "Leyton" },
  "E11": { TFLZone: 3, congestionZone: false, directionFromLondon: "E", distanceFromLondon: 6.0, areaName: "North East London", localityName: "Wanstead" },
  "E13": { TFLZone: 3, congestionZone: false, directionFromLondon: "E", distanceFromLondon: 7.5, areaName: "North East London", localityName: "Plaistow" },
  "E15": { TFLZone: 3, congestionZone: false, directionFromLondon: "E", distanceFromLondon: 5.5, areaName: "North East London", localityName: "Stratford" },
  "E16": { TFLZone: 3, congestionZone: false, directionFromLondon: "E", distanceFromLondon: 8.0, areaName: "North East London", localityName: "Canning Town" },
  "E17": { TFLZone: 3, congestionZone: false, directionFromLondon: "E", distanceFromLondon: 8.0, areaName: "North East London", localityName: "Walthamstow" },
  "E18": { TFLZone: 4, congestionZone: false, directionFromLondon: "E", distanceFromLondon: 10.0, areaName: "North East London", localityName: "South Woodford" },
  "N4": { TFLZone: 2, congestionZone: false, directionFromLondon: "N", distanceFromLondon: 3.0, areaName: "North London", localityName: "Finsbury Park" },
  "N5": { TFLZone: 2, congestionZone: false, directionFromLondon: "N", distanceFromLondon: 4.0, areaName: "North London", localityName: "Highbury" },
  "N7": { TFLZone: 2, congestionZone: false, directionFromLondon: "N", distanceFromLondon: 3.5, areaName: "North London", localityName: "Holloway" },
  "N8": { TFLZone: 3, congestionZone: false, directionFromLondon: "N", distanceFromLondon: 6.0, areaName: "North London", localityName: "Crouch End" },
  "N9": { TFLZone: 3, congestionZone: false, directionFromLondon: "N", distanceFromLondon: 7.0, areaName: "North London", localityName: "Lower Edmonton" },
  "N11": { TFLZone: 3, congestionZone: false, directionFromLondon: "N", distanceFromLondon: 8.0, areaName: "North London", localityName: "New Southgate" },
  "N12": { TFLZone: 4, congestionZone: false, directionFromLondon: "N", distanceFromLondon: 9.0, areaName: "North London", localityName: "North Finchley" },
  "N13": { TFLZone: 3, congestionZone: false, directionFromLondon: "N", distanceFromLondon: 7.5, areaName: "North London", localityName: "Palmers Green" },
  "N14": { TFLZone: 4, congestionZone: false, directionFromLondon: "N", distanceFromLondon: 9.5, areaName: "North London", localityName: "Southgate" },
  "N15": { TFLZone: 2, congestionZone: false, directionFromLondon: "N", distanceFromLondon: 6.5, areaName: "North London", localityName: "Seven Sisters" },
  "N16": { TFLZone: 3, congestionZone: false, directionFromLondon: "N", distanceFromLondon: 5.5, areaName: "North London", localityName: "Stamford Hill" },
  "N17": { TFLZone: 3, congestionZone: false, directionFromLondon: "N", distanceFromLondon: 8.0, areaName: "North London", localityName: "Tottenham" },
  "N18": { TFLZone: 3, congestionZone: false, directionFromLondon: "N", distanceFromLondon: 9.0, areaName: "North London", localityName: "Edmonton" },
  "N20": { TFLZone: 4, congestionZone: false, directionFromLondon: "N", distanceFromLondon: 10.0, areaName: "North London", localityName: "Whetstone" },
  "N22": { TFLZone: 3, congestionZone: false, directionFromLondon: "N", distanceFromLondon: 8.5, areaName: "North London", localityName: "Wood Green" },
  "NW2": { TFLZone: 2, congestionZone: false, directionFromLondon: "NW", distanceFromLondon: 5.0, areaName: "North West London", localityName: "Dollis Hill" },
  "NW3": { TFLZone: 2, congestionZone: false, directionFromLondon: "NW", distanceFromLondon: 4.0, areaName: "North West London", localityName: "Hampstead" },
  "NW4": { TFLZone: 3, congestionZone: false, directionFromLondon: "NW", distanceFromLondon: 6.5, areaName: "North West London", localityName: "Hendon" },
  "NW5": { TFLZone: 2, congestionZone: false, directionFromLondon: "NW", distanceFromLondon: 4.0, areaName: "North West London", localityName: "Kentish Town" },
  "NW6": { TFLZone: 2, congestionZone: false, directionFromLondon: "NW", distanceFromLondon: 5.0, areaName: "North West London", localityName: "Kilburn" },
  "NW7": { TFLZone: 3, congestionZone: false, directionFromLondon: "NW", distanceFromLondon: 7.0, areaName: "North West London", localityName: "Mill Hill" },
  "NW8": { TFLZone: 2, congestionZone: false, directionFromLondon: "NW", distanceFromLondon: 3.0, areaName: "North West London", localityName: "St John's Wood" },
  "NW9": { TFLZone: 3, congestionZone: false, directionFromLondon: "NW", distanceFromLondon: 8.0, areaName: "North West London", localityName: "Colindale" },
  "NW10": { TFLZone: 2, congestionZone: false, directionFromLondon: "NW", distanceFromLondon: 7.0, areaName: "North West London", localityName: "Harlesden" },
  "NW11": { TFLZone: 3, congestionZone: false, directionFromLondon: "NW", distanceFromLondon: 8.0, areaName: "North West London", localityName: "Golders Green" },
  "SE2": { TFLZone: 4, congestionZone: false, directionFromLondon: "S", distanceFromLondon: 11.0, areaName: "South East London", localityName: "Abbey Wood" },
  "SE3": { TFLZone: 3, congestionZone: false, directionFromLondon: "S", distanceFromLondon: 7.5, areaName: "South East London", localityName: "Blackheath" },
  "SE4": { TFLZone: 2, congestionZone: false, directionFromLondon: "S", distanceFromLondon: 6.0, areaName: "South East London", localityName: "Brockley" },
  "SE5": { TFLZone: 2, congestionZone: false, directionFromLondon: "S", distanceFromLondon: 2.5, areaName: "South East London", localityName: "Camberwell" },
  "SE6": { TFLZone: 3, congestionZone: false, directionFromLondon: "S", distanceFromLondon: 7.0, areaName: "South East London", localityName: "Catford" },
  "SE7": { TFLZone: 3, congestionZone: false, directionFromLondon: "S", distanceFromLondon: 8.0, areaName: "South East London", localityName: "Charlton" },
  "SE8": { TFLZone: 2, congestionZone: false, directionFromLondon: "S", distanceFromLondon: 4.5, areaName: "South East London", localityName: "Deptford" },
  "SE9": { TFLZone: 4, congestionZone: false, directionFromLondon: "S", distanceFromLondon: 10.0, areaName: "South East London", localityName: "Eltham" },
  "SE10": { TFLZone: 2, congestionZone: false, directionFromLondon: "S", distanceFromLondon: 5.5, areaName: "South East London", localityName: "Greenwich" },
  "SE12": { TFLZone: 3, congestionZone: false, directionFromLondon: "S", distanceFromLondon: 9.0, areaName: "South East London", localityName: "Lee" },
  "SE13": { TFLZone: 3, congestionZone: false, directionFromLondon: "S", distanceFromLondon: 6.5, areaName: "South East London", localityName: "Lewisham" },
  "SE14": { TFLZone: 2, congestionZone: false, directionFromLondon: "S", distanceFromLondon: 5.5, areaName: "South East London", localityName: "New Cross" },
  "SE15": { TFLZone: 2, congestionZone: false, directionFromLondon: "S", distanceFromLondon: 4.5, areaName: "South East London", localityName: "Peckham" },
  "SE16": { TFLZone: 2, congestionZone: false, directionFromLondon: "S", distanceFromLondon: 4.0, areaName: "South East London", localityName: "Rotherhithe" },
  "SE17": { TFLZone: 2, congestionZone: false, directionFromLondon: "S", distanceFromLondon: 2.0, areaName: "South East London", localityName: "Walworth" },
  "SE18": { TFLZone: 3, congestionZone: false, directionFromLondon: "S", distanceFromLondon: 8.5, areaName: "South East London", localityName: "Woolwich" },
  "SE19": { TFLZone: 3, congestionZone: false, directionFromLondon: "S", distanceFromLondon: 8.0, areaName: "South East London", localityName: "Upper Norwood" },
  "SE20": { TFLZone: 4, congestionZone: false, directionFromLondon: "S", distanceFromLondon: 10.0, areaName: "South East London", localityName: "Penge" },
  "SE21": { TFLZone: 3, congestionZone: false, directionFromLondon: "S", distanceFromLondon: 6.5, areaName: "South East London", localityName: "Dulwich" },
  "SE22": { TFLZone: 2, congestionZone: false, directionFromLondon: "S", distanceFromLondon: 5.0, areaName: "South East London", localityName: "East Dulwich" },
  "SE23": { TFLZone: 3, congestionZone: false, directionFromLondon: "S", distanceFromLondon: 7.5, areaName: "South East London", localityName: "Forest Hill" },
  "SE24": { TFLZone: 2, congestionZone: false, directionFromLondon: "S", distanceFromLondon: 4.0, areaName: "South East London", localityName: "Herne Hill" },
  "SE25": { TFLZone: 4, congestionZone: false, directionFromLondon: "S", distanceFromLondon: 9.0, areaName: "South East London", localityName: "South Norwood" },
  "SE26": { TFLZone: 3, congestionZone: false, directionFromLondon: "S", distanceFromLondon: 8.0, areaName: "South East London", localityName: "Sydenham" },
  "SE27": { TFLZone: 3, congestionZone: false, directionFromLondon: "S", distanceFromLondon: 6.0, areaName: "South East London", localityName: "West Norwood" },
  "SE28": { TFLZone: 4, congestionZone: false, directionFromLondon: "S", distanceFromLondon: 9.0, areaName: "South East London", localityName: "Thamesmead" },
  "SW1": { TFLZone: 1, congestionZone: true, directionFromLondon: "SW", distanceFromLondon: 1.0, areaName: "South West London", localityName: "Westminster" },
  "SW2": { TFLZone: 2, congestionZone: false, directionFromLondon: "SW", distanceFromLondon: 3.0, areaName: "South West London", localityName: "Brixton" },
  "SW3": { TFLZone: 1, congestionZone: true, directionFromLondon: "SW", distanceFromLondon: 2.5, areaName: "South West London", localityName: "Chelsea" },
  "SW4": { TFLZone: 2, congestionZone: false, directionFromLondon: "SW", distanceFromLondon: 3.5, areaName: "South West London", localityName: "Clapham" },
  "SW5": { TFLZone: 1, congestionZone: true, directionFromLondon: "SW", distanceFromLondon: 3.0, areaName: "South West London", localityName: "Earls Court" },
  "SW6": { TFLZone: 2, congestionZone: false, directionFromLondon: "SW", distanceFromLondon: 4.0, areaName: "South West London", localityName: "Fulham" },
  "SW7": { TFLZone: 1, congestionZone: true, directionFromLondon: "SW", distanceFromLondon: 3.0, areaName: "South West London", localityName: "South Kensington" },
  "SW9": { TFLZone: 2, congestionZone: false, directionFromLondon: "SW", distanceFromLondon: 2.0, areaName: "South West London", localityName: "Stockwell" },
  "SW10": { TFLZone: 2, congestionZone: false, directionFromLondon: "SW", distanceFromLondon: 4.0, areaName: "South West London", localityName: "West Brompton" },
  "SW11": { TFLZone: 2, congestionZone: false, directionFromLondon: "SW", distanceFromLondon: 2.5, areaName: "South West London", localityName: "Battersea" },
  "SW12": { TFLZone: 3, congestionZone: false, directionFromLondon: "SW", distanceFromLondon: 6.5, areaName: "South West London", localityName: "Balham" },
  "SW13": { TFLZone: 2, congestionZone: false, directionFromLondon: "SW", distanceFromLondon: 6.5, areaName: "South West London", localityName: "Barnes" },
  "SW14": { TFLZone: 3, congestionZone: false, directionFromLondon: "SW", distanceFromLondon: 8.0, areaName: "South West London", localityName: "Mortlake" },
  "SW15": { TFLZone: 3, congestionZone: false, directionFromLondon: "SW", distanceFromLondon: 7.5, areaName: "South West London", localityName: "Putney" },
  "SW16": { TFLZone: 3, congestionZone: false, directionFromLondon: "SW", distanceFromLondon: 6.5, areaName: "South West London", localityName: "Streatham" },
  "SW17": { TFLZone: 3, congestionZone: false, directionFromLondon: "SW", distanceFromLondon: 7.0, areaName: "South West London", localityName: "Tooting" },
  "SW18": { TFLZone: 3, congestionZone: false, directionFromLondon: "SW", distanceFromLondon: 5.0, areaName: "South West London", localityName: "Wandsworth" },
  "SW19": { TFLZone: 3, congestionZone: false, directionFromLondon: "SW", distanceFromLondon: 8.0, areaName: "South West London", localityName: "Wimbledon" },
  "SW20": { TFLZone: 4, congestionZone: false, directionFromLondon: "SW", distanceFromLondon: 10.0, areaName: "South West London", localityName: "Raynes Park" },
  "W1": { TFLZone: 1, congestionZone: true, directionFromLondon: "W", distanceFromLondon: 1.0, areaName: "West London", localityName: "West End" },
  "W3": { TFLZone: 2, congestionZone: false, directionFromLondon: "W", distanceFromLondon: 4.5, areaName: "West London", localityName: "Acton" },
  "W4": { TFLZone: 3, congestionZone: false, directionFromLondon: "W", distanceFromLondon: 5.5, areaName: "West London", localityName: "Chiswick" },
  "W5": { TFLZone: 3, congestionZone: false, directionFromLondon: "W", distanceFromLondon: 7.5, areaName: "West London", localityName: "Ealing" },
  "W6": { TFLZone: 2, congestionZone: false, directionFromLondon: "W", distanceFromLondon: 5.5, areaName: "West London", localityName: "Hammersmith" },
  "W7": { TFLZone: 4, congestionZone: false, directionFromLondon: "W", distanceFromLondon: 10.0, areaName: "West London", localityName: "Hanwell" },
  "W9": { TFLZone: 2, congestionZone: false, directionFromLondon: "W", distanceFromLondon: 4.0, areaName: "West London", localityName: "Maida Vale" },
  "W10": { TFLZone: 2, congestionZone: false, directionFromLondon: "W", distanceFromLondon: 5.0, areaName: "West London", localityName: "North Kensington" },
  "W11": { TFLZone: 1, congestionZone: true, directionFromLondon: "W", distanceFromLondon: 3.5, areaName: "West London", localityName: "Notting Hill" },
  "W12": { TFLZone: 2, congestionZone: false, directionFromLondon: "W", distanceFromLondon: 6.5, areaName: "West London", localityName: "Shepherds Bush" },
  "W13": { TFLZone: 3, congestionZone: false, directionFromLondon: "W", distanceFromLondon: 7.0, areaName: "West London", localityName: "West Ealing" },
  "W14": { TFLZone: 2, congestionZone: false, directionFromLondon: "W", distanceFromLondon: 6.0, areaName: "West London", localityName: "West Kensington" },
  "WC1": { TFLZone: 1, congestionZone: true, directionFromLondon: "W", distanceFromLondon: 1.0, areaName: "West London", localityName: "Bloomsbury" },
  "WC2": { TFLZone: 1, congestionZone: true, directionFromLondon: "W", distanceFromLondon: 1.5, areaName: "West London", localityName: "Holborn" },
  "TW1": { TFLZone: 2, congestionZone: false, directionFromLondon: "W", distanceFromLondon: 10.0, areaName: "Outer West London", localityName: "Twickenham" },
  "TW2": { TFLZone: 4, congestionZone: false, directionFromLondon: "W", distanceFromLondon: 11.0, areaName: "Outer West London", localityName: "Isleworth" },
  "TW3": { TFLZone: 4, congestionZone: false, directionFromLondon: "W", distanceFromLondon: 12.0, areaName: "Outer West London", localityName: "Hounslow" },
  "TW4": { TFLZone: 4, congestionZone: false, directionFromLondon: "W", distanceFromLondon: 13.0, areaName: "Outer West London", localityName: "Hounslow" },
  "TW5": { TFLZone: 5, congestionZone: false, directionFromLondon: "W", distanceFromLondon: 14.0, areaName: "Outer West London", localityName: "Hounslow" },
  "TW6": { TFLZone: 5, congestionZone: false, directionFromLondon: "W", distanceFromLondon: 15.0, areaName: "Outer West London", localityName: "Heathrow" },
  "TW7": { TFLZone: 4, congestionZone: false, directionFromLondon: "W", distanceFromLondon: 12.5, areaName: "Outer West London", localityName: "Isleworth" },
  "TW8": { TFLZone: 3, congestionZone: false, directionFromLondon: "W", distanceFromLondon: 8.5, areaName: "Outer West London", localityName: "Brentford" },
  "TW9": { TFLZone: 5, congestionZone: false, directionFromLondon: "W", distanceFromLondon: 9.0, areaName: "Outer West London", localityName: "Richmond" },
  "TW10": { TFLZone: 5, congestionZone: false, directionFromLondon: "W", distanceFromLondon: 9.0, areaName: "Outer West London", localityName: "Richmond" },
  "TW11": { TFLZone: 5, congestionZone: false, directionFromLondon: "W", distanceFromLondon: 10.0, areaName: "Outer West London", localityName: "Teddington" },
  "TW12": { TFLZone: 5, congestionZone: false, directionFromLondon: "W", distanceFromLondon: 11.0, areaName: "Outer West London", localityName: "Hampton" },
  "TW13": { TFLZone: 6, congestionZone: false, directionFromLondon: "W", distanceFromLondon: 12.0, areaName: "Outer West London", localityName: "Feltham" },
  "TW14": { TFLZone: 6, congestionZone: false, directionFromLondon: "W", distanceFromLondon: 13.0, areaName: "Outer West London", localityName: "Feltham" },
  "TW15": { TFLZone: 6, congestionZone: false, directionFromLondon: "W", distanceFromLondon: 14.0, areaName: "Outer West London", localityName: "Ashford" },
  "TW16": { TFLZone: 6, congestionZone: false, directionFromLondon: "W", distanceFromLondon: 15.0, areaName: "Outer West London", localityName: "Sunbury" },
  "TW17": { TFLZone: 6, congestionZone: false, directionFromLondon: "W", distanceFromLondon: 16.0, areaName: "Outer West London", localityName: "Shepperton" },
  "UB1": { TFLZone: 5, congestionZone: false, directionFromLondon: "W", distanceFromLondon: 10.0, areaName: "Outer West London", localityName: "Southall" },
  "UB2": { TFLZone: 5, congestionZone: false, directionFromLondon: "W", distanceFromLondon: 10.0, areaName: "Outer West London", localityName: "Southall" },
  "UB3": { TFLZone: 5, congestionZone: false, directionFromLondon: "W", distanceFromLondon: 10.0, areaName: "Outer West London", localityName: "Hayes" },
  "UB4": { TFLZone: 5, congestionZone: false, directionFromLondon: "W", distanceFromLondon: 10.0, areaName: "Outer West London", localityName: "Hayes" },
  "UB5": { TFLZone: 5, congestionZone: false, directionFromLondon: "W", distanceFromLondon: 10.0, areaName: "Outer West London", localityName: "Northolt" },
  "UB6": { TFLZone: 5, congestionZone: false, directionFromLondon: "W", distanceFromLondon: 10.0, areaName: "Outer West London", localityName: "Greenford" },
  "BR1": { TFLZone: 6, congestionZone: false, directionFromLondon: "SE", distanceFromLondon: 13.0, areaName: "South East London", localityName: "Bromley" },
  "BR2": { TFLZone: 6, congestionZone: false, directionFromLondon: "SE", distanceFromLondon: 14.0, areaName: "South East London", localityName: "Bromley" },
  "BR3": { TFLZone: 6, congestionZone: false, directionFromLondon: "SE", distanceFromLondon: 14.0, areaName: "South East London", localityName: "Beckenham" },
  "CR0": { TFLZone: 6, congestionZone: false, directionFromLondon: "SE", distanceFromLondon: 15.0, areaName: "South East London", localityName: "Croydon" },
  "CR2": { TFLZone: 6, congestionZone: false, directionFromLondon: "SE", distanceFromLondon: 14.5, areaName: "South East London", localityName: "South Croydon" },
  "CR4": { TFLZone: 6, congestionZone: false, directionFromLondon: "SE", distanceFromLondon: 14.5, areaName: "South East London", localityName: "Mitcham" },
  "CR7": { TFLZone: 6, congestionZone: false, directionFromLondon: "SE", distanceFromLondon: 15.0, areaName: "South East London", localityName: "Thornton Heath" },
  "DA1": { TFLZone: 6, congestionZone: false, directionFromLondon: "SE", distanceFromLondon: 17.0, areaName: "South East London", localityName: "Dartford" },
  "DA5": { TFLZone: 6, congestionZone: false, directionFromLondon: "SE", distanceFromLondon: 18.0, areaName: "South East London", localityName: "Bexley" },
  "DA6": { TFLZone: 6, congestionZone: false, directionFromLondon: "SE", distanceFromLondon: 17.5, areaName: "South East London", localityName: "Bexleyheath" },
  "EN1": { TFLZone: 5, congestionZone: false, directionFromLondon: "N", distanceFromLondon: 11.0, areaName: "North East London", localityName: "Enfield" },
  "EN2": { TFLZone: 5, congestionZone: false, directionFromLondon: "N", distanceFromLondon: 12.0, areaName: "North East London", localityName: "Enfield" },
  "EN3": { TFLZone: 5, congestionZone: false, directionFromLondon: "N", distanceFromLondon: 12.5, areaName: "North East London", localityName: "Enfield" },
  "HA9": { TFLZone: 4, congestionZone: false, directionFromLondon: "NW", distanceFromLondon: 7.0, areaName: "North West London", localityName: "Wembley" },
  "HA0": { TFLZone: 4, congestionZone: false, directionFromLondon: "NW", distanceFromLondon: 7.0, areaName: "North West London", localityName: "Wembley" },
  "HA1": { TFLZone: 4, congestionZone: false, directionFromLondon: "NW", distanceFromLondon: 8.0, areaName: "North West London", localityName: "Harrow" },
  "HA2": { TFLZone: 4, congestionZone: false, directionFromLondon: "NW", distanceFromLondon: 8.5, areaName: "North West London", localityName: "Harrow" },
  "HA3": { TFLZone: 4, congestionZone: false, directionFromLondon: "NW", distanceFromLondon: 8.5, areaName: "North West London", localityName: "Harrow" },
  "HA4": { TFLZone: 5, congestionZone: false, directionFromLondon: "NW", distanceFromLondon: 10.0, areaName: "North West London", localityName: "Ruislip" },
  "HA5": { TFLZone: 5, congestionZone: false, directionFromLondon: "NW", distanceFromLondon: 10.0, areaName: "North West London", localityName: "Pinner" },
  "HA6": { TFLZone: 5, congestionZone: false, directionFromLondon: "NW", distanceFromLondon: 11.0, areaName: "North West London", localityName: "Northwood" },
  "IG1": { TFLZone: 5, congestionZone: false, directionFromLondon: "E", distanceFromLondon: 12.0, areaName: "North East London", localityName: "Ilford" },
  "IG2": { TFLZone: 5, congestionZone: false, directionFromLondon: "E", distanceFromLondon: 12.5, areaName: "North East London", localityName: "Gants Hill" },
  "IG3": { TFLZone: 5, congestionZone: false, directionFromLondon: "E", distanceFromLondon: 13.0, areaName: "North East London", localityName: "Seven Kings" },
  "IG4": { TFLZone: 5, congestionZone: false, directionFromLondon: "E", distanceFromLondon: 13.5, areaName: "North East London", localityName: "Woodford" },
  "IG5": { TFLZone: 5, congestionZone: false, directionFromLondon: "E", distanceFromLondon: 14.0, areaName: "North East London", localityName: "Hainault" },
  "IG6": { TFLZone: 5, congestionZone: false, directionFromLondon: "E", distanceFromLondon: 14.5, areaName: "North East London", localityName: "Barkingside" },
  "IG7": { TFLZone: 6, congestionZone: false, directionFromLondon: "E", distanceFromLondon: 15.0, areaName: "North East London", localityName: "Chigwell" },
  "IG8": { TFLZone: 6, congestionZone: false, directionFromLondon: "E", distanceFromLondon: 15.5, areaName: "North East London", localityName: "Woodford Green" },
  "IG9": { TFLZone: 6, congestionZone: false, directionFromLondon: "E", distanceFromLondon: 16.0, areaName: "North East London", localityName: "Buckhurst Hill" },
  "KT1": { TFLZone: 6, congestionZone: false, directionFromLondon: "SW", distanceFromLondon: 15.0, areaName: "South West London", localityName: "Kingston" },
  "KT2": { TFLZone: 6, congestionZone: false, directionFromLondon: "SW", distanceFromLondon: 15.5, areaName: "South West London", localityName: "Kingston" },
  "KT3": { TFLZone: 6, congestionZone: false, directionFromLondon: "SW", distanceFromLondon: 16.0, areaName: "South West London", localityName: "New Malden" },
  "RM1": { TFLZone: 6, congestionZone: false, directionFromLondon: "E", distanceFromLondon: 16.0, areaName: "Outer East London", localityName: "Romford" },
  "RM2": { TFLZone: 6, congestionZone: false, directionFromLondon: "E", distanceFromLondon: 16.5, areaName: "Outer East London", localityName: "Romford" },
  "RM3": { TFLZone: 6, congestionZone: false, directionFromLondon: "E", distanceFromLondon: 17.0, areaName: "Outer East London", localityName: "Harold Hill" },
  "RM4": { TFLZone: 6, congestionZone: false, directionFromLondon: "E", distanceFromLondon: 17.5, areaName: "Outer East London", localityName: "Romford" },
  "SM1": { TFLZone: 6, congestionZone: false, directionFromLondon: "SW", distanceFromLondon: 15.0, areaName: "South West London", localityName: "Sutton" },
  "SM2": { TFLZone: 6, congestionZone: false, directionFromLondon: "SW", distanceFromLondon: 15.0, areaName: "South West London", localityName: "Sutton" },
  "SM3": { TFLZone: 6, congestionZone: false, directionFromLondon: "SW", distanceFromLondon: 15.5, areaName: "South West London", localityName: "Sutton" },
  "SM4": { TFLZone: 6, congestionZone: false, directionFromLondon: "SW", distanceFromLondon: 15.5, areaName: "South West London", localityName: "Morden" },
  "HA7": { TFLZone: 5, congestionZone: false, directionFromLondon: "NW", distanceFromLondon: 13.0, areaName: "North West London", localityName: "Stanmore" },
  "HA8": { TFLZone: 4, congestionZone: false, directionFromLondon: "NW", distanceFromLondon: 11.0, areaName: "North West London", localityName: "Edgware" },
  "RM5": { TFLZone: 6, congestionZone: false, directionFromLondon: "E", distanceFromLondon: 16.0, areaName: "Outer East London", localityName: "Collier Row" },
  "RM6": { TFLZone: 5, congestionZone: false, directionFromLondon: "E", distanceFromLondon: 15.0, areaName: "Outer East London", localityName: "Chadwell Heath" },
  "RM7": { TFLZone: 6, congestionZone: false, directionFromLondon: "E", distanceFromLondon: 16.5, areaName: "Outer East London", localityName: "Rush Green" },
  "UB7": { TFLZone: 6, congestionZone: false, directionFromLondon: "W", distanceFromLondon: 14.5, areaName: "West London", localityName: "West Drayton" },
  "WD6": { TFLZone: 6, congestionZone: false, directionFromLondon: "NW", distanceFromLondon: 15.0, areaName: "North West London", localityName: "Borehamwood" }
}