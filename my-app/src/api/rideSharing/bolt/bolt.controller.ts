import { Hono } from "hono";
import { getGoogleEstimateV2 } from "../../../googleMapsCalls/googleDistanceV2";
import { CalculatedData, calculateScore, googleMatrixReturn } from "../common/score";
import { ExtractBolt, extractBoltData } from "./bolt.service";
import { Bindings } from "../../..";


const app = new Hono<{ Bindings: Bindings }>()

/**
 *  @Header : key for google maps api key
 */
app.post('/boltScore', async (c) => {
  // const { GOOGLE_MAPS_API_KEY } = env<{ GOOGLE_MAPS_API_KEY: string }>(c);
  const GOOGLE_MAPS_API_KEY = c.req.header('key') as string;
  if (!GOOGLE_MAPS_API_KEY) {
    return c.json('No key provided', 400)
  }
  const boltJsonData = await c.req.json();
  await c.env.TRIP_LOG.put(`${new Date().toISOString()} boltScore:Request`, JSON.stringify(boltJsonData));

  try {
    const { origin, destination, distance, pay, pickupDistance, pickupTimeEstimate, passengerRating }: ExtractBolt = extractBoltData(boltJsonData);

    let googleJsonData = await getGoogleEstimateV2(origin, destination, GOOGLE_MAPS_API_KEY) as googleMatrixReturn; // TODO: INPUT KEY HERE
    const ratingResult: CalculatedData = calculateScore(googleJsonData, passengerRating, pay, distance, pickupDistance, pickupTimeEstimate);

    const successResponse = { message: "Success", ...ratingResult, googleJsonData, extract: { origin, destination, distance, pay, pickupDistance, pickupTimeEstimate, passengerRating } };
    await c.env.TRIP_LOG.put(`${new Date().toISOString()} boltScore:SuccessResponse`, JSON.stringify(successResponse));
    
    return c.json(successResponse);

  } catch (error) {
    
    const errorResponse = { message: "data extraction or google  failed, aborting ", error };
    await c.env.TRIP_LOG.put(`${new Date().toISOString()} boltScore:ErrorResponse}`, JSON.stringify(errorResponse));

    return c.json(errorResponse, 400);

  }
})

// Testing endpoints 
app.post('/extractBoltData', async (c) => {
  const extract = extractBoltData(await c.req.json());
  // const key = c.req.header('key');
  // // If key in undefined 
  // if (!key) {
  //   return c.json('No key provided', 400)
  // }
  return c.json(extract);
})

export default app;