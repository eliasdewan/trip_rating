import { Hono } from "hono";
import { env } from "hono/adapter";
import { getGoogleEstimatev2 } from "../../../googleMapsCalls/googleDistancev2";
import { CalculatedData, calculateScore, googleMatrixReturn } from "../common/score";
import { dummyGoogleJsonData } from "../../../data/googleResultSample";
import { ExtractBolt, extractBoltData } from "./bolt.service";

const app = new Hono()

app.post('/boltScore', async (c) => {
  // const { GOOGLE_MAPS_API_KEY } = env<{ GOOGLE_MAPS_API_KEY: string }>(c);
  const GOOGLE_MAPS_API_KEY = c.req.header('key') as string;
  if (!GOOGLE_MAPS_API_KEY) {
    return c.json('No key provided', 400)
  }

  const boltJsonData = await c.req.json();
  try {
    const { origin, destination, distance, pay, pickupDistance, pickupTimeEstimate, passengerRating }: ExtractBolt = extractBoltData(boltJsonData);

    let googleJsonData = await getGoogleEstimatev2(origin, destination, GOOGLE_MAPS_API_KEY) as googleMatrixReturn; // TODO: INPUT KEY HERE
    const ratingResult: CalculatedData = calculateScore(googleJsonData, passengerRating, pay, distance, pickupDistance, pickupTimeEstimate);
    return c.json({ message: "Success", ...ratingResult, googleJsonData, extract: { origin, destination, distance, pay, pickupDistance, pickupTimeEstimate, passengerRating } })
  } catch (error) {
    return c.json({ message: "data extraction or google  failed, aborting ", error })

  }
})

// Testing endpoints 
app.post('/extractBoltData', async (c) => {
  const extract = extractBoltData(await c.req.json());
  const key = c.req.header('key');
  // If key in undefined 
  if (!key) {
    return c.json('No key provided', 400)
  }
  return c.json({ ...extract, providedKey: key });
})

export default app;