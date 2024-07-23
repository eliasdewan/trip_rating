export class Trip {
  private origin: string;
  private drop: string | Array<string>; // When there is multiple drops
  private cutomerRating: number;
  private pay: number;
  private rideCategory?: string; // change this to the other types once you know all the types
  private distance: number;
  private milesAway?: number;
  private minutesAway?: number;
  private holidayPayAndPay: string;




  constructor(addresses: string[], customerRating: number, pay: number, miles: number, awayMinutesandMiles?: string, holidayPayAndPay?: string) {
    this.origin = addresses[0];
    this.drop = addresses.slice(1);
    this.cutomerRating = customerRating;
    this.pay = pay;
    this.distance = miles;
    
    // Calculate this
    this.milesAway = 0;
    this.minutesAway = 0;
    this.holidayPayAndPay = '';
  }
}

// Make needed functions