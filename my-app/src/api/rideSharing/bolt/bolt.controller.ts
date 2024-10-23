import { Hono } from "hono";
import { computeRouteMatrixV2, computeRoutesV2, googleRouteResponse } from "../../../googleMapsCalls/googleDistanceV2";
import { CalculatedDataType, calculateScore } from "../common/score";
import { ExtractBolt, extractBoltData } from "./bolt.service";
import { Bindings } from "../../..";
import { getOutcodeDataString } from "../common/outCodes";


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
  await c.env.TRIPLOG.prepare('INSERT INTO successlogs (entry,data,timestamp) VALUES (?,?,CURRENT_TIMESTAMP)').bind(`${new Date().toISOString()} boltScore:Request`, JSON.stringify(boltJsonData)).run();

  try {
    const { origin, destination, distance, pay, pickupDistance, pickupTimeEstimate, passengerRating }: ExtractBolt = extractBoltData(boltJsonData);

    let googleJsonData = await computeRoutesV2(origin, destination, GOOGLE_MAPS_API_KEY) as googleRouteResponse; // TODO: INPUT KEY HERE
    const ratingResult: CalculatedDataType = calculateScore(googleJsonData, passengerRating, pay, distance, pickupDistance, pickupTimeEstimate);
    const destinationInfoString = getOutcodeDataString(origin, destination);
    const successResponse = { message: "Success", ...ratingResult, destinationInfoString, googleJsonData, extract: { origin, destination, distance, pay, pickupDistance, pickupTimeEstimate, passengerRating } };
    await c.env.TRIP_LOG.put(`${new Date().toISOString()} boltScore:SuccessResponse`, JSON.stringify(successResponse));
    await c.env.TRIPLOG.prepare('INSERT INTO successlogs (entry,data,timestamp) VALUES (?,?,CURRENT_TIMESTAMP)').bind(`${new Date().toISOString()} boltScore:SuccessResponse`, JSON.stringify(successResponse)).run();


    return c.json(successResponse);

  } catch (error) {
    const errorResponse = { message: "data extraction or google  failed, aborting ", error };
    await c.env.TRIP_LOG.put(`${new Date().toISOString()} boltScore:ErrorResponse}`, JSON.stringify(errorResponse));
    await c.env.TRIPLOG.prepare('INSERT INTO successlogs (entry,data,timestamp) VALUES (?,?,CURRENT_TIMESTAMP)').bind(`${new Date().toISOString()} boltScore:ErrorResponse}`, JSON.stringify(errorResponse)).run();


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