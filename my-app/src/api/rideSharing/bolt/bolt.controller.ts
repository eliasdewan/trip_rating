import { Hono } from "hono";
import { env } from "hono/adapter";
import { getGoogleEstimatev2 } from "../../../googleMapsCalls/googleDistancev2";
import { CalculatedData, calculateScore, googleMatrixReturn } from "../common/score";
import { dummyGoogleJsonData } from "../../../data/googleResultSample";
import { ExtractBolt, extractBoltData } from "./bolt.service";

const app = new Hono()

app.post('/boltScore', async (c) => {
  const { GOOGLE_MAPS_API_KEY } = env<{ GOOGLE_MAPS_API_KEY: string }>(c);
  const boltJsonData = await c.req.json();
  try {
    const { origin, destination, distance, pay, pickupDistance, pickupTimeEstimate, passengerRating }: ExtractBolt = extractBoltData(boltJsonData);

    let googleJsonData = await getGoogleEstimatev2(origin, destination, GOOGLE_MAPS_API_KEY) as googleMatrixReturn; // TODO: INPUT KEY HERE
    const ratingResult: CalculatedData = calculateScore(googleJsonData, passengerRating, pay, distance, pickupDistance, pickupTimeEstimate);
    return c.json({ message: "Success", ...ratingResult, googleJsonData, extract: { origin, destination, distance, pay, pickupDistance, pickupTimeEstimate, passengerRating }})
  } catch (error) {
    return c.json({ message: "data extraction or google  failed, aborting ", error })

  }
})

export default app;