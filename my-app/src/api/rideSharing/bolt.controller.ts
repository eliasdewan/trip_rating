import { Hono } from "hono";
import { env } from "hono/adapter";
import { getGoogleEstimatev2 } from "../../googleMapsCalls/googleDistancev2";
import { calculateScore } from "./data/score";
import { dummyGoogleJsonData } from "../../data/googleResultSample";

const app = new Hono()

app.post('/boltScore', async (c) => {
  const { GOOGLE_MAPS_API_KEY } = env<{ GOOGLE_MAPS_API_KEY: string }>(c)

  try {
    const boltJsonData = await c.req.json();

    let origin, destination, distance, pay, pickupDistance, pickupTimeEstimate, passengerRating;
    for (let i = 0; i < boltJsonData.length; i++) {
      const text = boltJsonData[i].text;

      // Check for the distance and destination string (e.g., "UB2 • 2.2 mi" or "UB2 • 404 ft")
      if (text.includes('•') && text.length > 8) {
        const parts = text.split(' • ');
        destination = parts[0];
        if (parts[1].includes('mi')) {
          distance = parseFloat(parts[1].replace(' mi', ''));
        } else if (parts[1].includes('ft')) {
          const feet = parseFloat(parts[1].replace(' ft', ''));
          distance = (feet / 5280).toFixed(2); // Convert feet to miles and fix to 2 decimal places
        }
      }

      // Check for the origin string (address) which is before the destination
      if (i > 0 && boltJsonData[i + 1] && boltJsonData[i + 1].text.includes('•')) {
        if (boltJsonData[i + 1].text.includes('ft') || boltJsonData[i + 1].text.includes('mi')) {
          origin = text;
        }
      }

      // Check for the pay string (e.g., "£5.59 · Net")
      if (text.includes('£') && text.includes('· Net')) {
        pay = Number(text.split(' ')[0].replace('£', ''));
      }

      // Check for the pickup distance (e.g., "404 ft" or "2.2 mi")
      if (!text.includes('•')) {
        if (text.includes('ft')) {
          const feet = parseFloat(text.replace(' ft', ''));
          pickupDistance = (feet / 5280).toFixed(2); // Convert feet to miles and fix to 2 decimal places
        } else if (text.includes('mi') && !text.includes('min')) {
          pickupDistance = Number(text.replace(' mi', '')).toFixed(2); // Already in miles
        }
      }

      // Check for the pickup time estimate (e.g., "1 min")
      if (text.includes('min') && !boltJsonData[i + 1].text.includes('•')) {
        if (boltJsonData[i + 1].text.includes('ft') || boltJsonData[i + 1].text.includes('mi')) {
          pickupTimeEstimate = parseInt(text.replace(' min', ''), 10); // Convert to integer
        }
      }

      // Check for the passenger rating (e.g., "5.0")
      if (parseFloat(text) >= 0 && parseFloat(text) <= 5 && text.includes('.') && boltJsonData[i + 1].text.includes('trip')) {
        passengerRating = Number(text);
      }


    }


    const extractedInfo = {
      origin,
      destination,
      distance, // Convert back to number
      pay,
      pickupDistance, // Convert back to number
      pickupTimeEstimate,
      passengerRating
    };


    let googleJsonData = await getGoogleEstimatev2(origin, destination, GOOGLE_MAPS_API_KEY); // TODO: INPUT KEY HERE
    const ratingResult = calculateScore(googleJsonData, passengerRating, pay, distance, pickupDistance, pickupTimeEstimate);
    // console.log(extractedInfo);
    return c.json({ message: "Success",  ...ratingResult , googleJsonData, extractedInfo })
  } catch (error) {
  return c.json({ message: "data extraction or google failed failed, aboring ", error })

}
})

export default app;