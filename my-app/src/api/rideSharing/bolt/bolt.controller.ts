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
  await c.env.TRIPLOG.prepare('INSERT INTO successlogs (entry,data,timestamp) VALUES (?,?,?)').bind('boltScore:Request', JSON.stringify(boltJsonData), new Date().toISOString()).run();

  try {
    const { origin, destination, driverAppDistance, pay, pickupDistance, pickupTimeEstimate, passengerRating, multipleStops, destinationInfoString }: ExtractBolt = extractBoltData(boltJsonData);

    let googleJsonData = await computeRoutesV2(origin, destination, GOOGLE_MAPS_API_KEY) as googleRouteResponse; // TODO: INPUT KEY HERE

    const scoreParameters = {
      googleJsonData, passengerRating, pay, driverAppDistance, pickupDistance, pickupTimeEstimate, multipleStops //uberTripMinutes, uberTripDurationArrayHourMinutes
    }

    const ratingResult: CalculatedDataType = calculateScore(googleJsonData, passengerRating, pay, driverAppDistance, pickupDistance, pickupTimeEstimate, multipleStops);

    const googleApiParameters = { origin, destination, key: "secretKey" };

    const successResponse = { ...ratingResult, destinationInfoString, scoreParameters, googleApiParameters };
    await c.env.TRIPLOG.prepare('INSERT INTO successlogs (entry,data,timestamp) VALUES (?,?,?)').bind('boltScore:SuccessResponse', JSON.stringify(successResponse), new Date().toISOString()).run();


    return c.json(successResponse);

  } catch (error) {
    const errorResponse = { message: "data extraction or google  failed, aborting ", error };
    await c.env.TRIPLOG.prepare('INSERT INTO successlogs (entry,data,timestamp) VALUES (?,?,?)').bind('boltScore:ErrorResponse', JSON.stringify(errorResponse), new Date().toISOString()).run();


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

//FIXME: check error logs are working 