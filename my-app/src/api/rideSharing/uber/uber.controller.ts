import { Hono } from 'hono'
import { calculateScore } from '../common/score';
import { extractData } from './uber.service'
import { dummyGoogleJsonData } from '../../../data/googleResultSample'
import { GoogleMapsSimpleDistanceMatrixReturn, fetchGoogleMapsData } from '../../../googleMapsCalls/googleDistance'
import { computeRouteMatrixV2, computeRoutesV2, googleMatrixResponse as googleMatrixResponse, googleRouteResponse as googleRouteResponse } from '../../../googleMapsCalls/googleDistanceV2'
import { googleMockDistanceMatrixCall, googleMockDistanceRouteCall } from '../../../googleMapsCalls/staticGooglemockDistance';
import { Bindings } from '../../..';
import { fixSearchAddress, getOutcodeArea, getOutcodeDataString } from '../common/outCodes';

const app = new Hono<{ Bindings: Bindings }>()

app.post('/', (c) => {
  return c.text('Do you know what you are doing?')
}).get('/', (c) => {
  return c.text('Hello Uber!')
})

/**
 *  Uses dummy google data from takskerData without calling google maps api
 */
app.post('/testQuery', async (c) => {
  try {
    // 1. Get uber data from request and extract data 
    const uberJsonData = await c.req.json();
    let { origin, destination, passengerRating, pay, driverAppDistance, pickupDistance, pickupTimeEstimate } = extractData(uberJsonData);
    console.log(origin, destination, passengerRating, pay, pickupDistance, pickupTimeEstimate)
    // 2. Get data from google maps api
    //const data = await getGoogleEstimateV2()
    // 3. Calculate the result for desired output
    const ratingResult = calculateScore(dummyGoogleJsonData, passengerRating, pay, driverAppDistance, pickupDistance, pickupTimeEstimate);
    return c.json(ratingResult);

  } catch (error) {
    console.error('Error fetching Google estimate:', error);
    return c.json({ error: 'Failed to fetch Google estimate from test query' }); // TODO; Change this to use dynamic 
  }

})

/**
 * @Header: key for google maps api key
 */
app.post('/uberScore', async (c) => {
  // TODO: Multiple stop trips - use factoring and maybe use the static duration if needed. As you only receive two different addresses and the middle points can be further than last point.
  // Use static 5 min per mile for this. 
  // TODO: Move logic in the service file
  // TODO: On one occasion tasker data had missing origin (usually comes before miles trip)
  let origin, destination, passengerRating, pay, driverAppDistance, pickupDistance, pickupTimeEstimate;
  // const { GOOGLE_MAPS_API_KEY } = env<{ GOOGLE_MAPS_API_KEY: string }>(c)
  const GOOGLE_MAPS_API_KEY = c.req.header('key') as string;
  if (!GOOGLE_MAPS_API_KEY) {
    return c.json('No key provided', 400)
  }
  try {
    // 1. Get uber data from request
    const uberJsonData = await c.req.json();

    // Store the request in database
    await c.env.TRIP_LOG.put(`${new Date().toISOString()} uberScore:Request`, JSON.stringify(uberJsonData));
    await c.env.TRIPLOG.prepare('INSERT INTO successlogs (entry,data,timestamp) VALUES (?,?,?)').bind('uberScore:Request', JSON.stringify(uberJsonData), new Date().toISOString()).run();


    // 2. Extract data from the request data
    ({ origin, destination, passengerRating, pay, driverAppDistance, pickupDistance, pickupTimeEstimate } = extractData(uberJsonData));
    const destinationInfoString = getOutcodeDataString(origin as string, destination as string);

    // 3. Get data from google maps api or use static 
    let googleJsonData;

    // If origin and destination are same, don't call google api, for uber 
    // There can be same outcode but different location. (UB2, Southall and UB2, London or UB2, Southall and UB2 Norwood Green)
    // FIXME: the destination area is not enough to make google maps routing search address

    // TODO: Move this to services
    origin = fixSearchAddress(origin);
    if (origin === destination) {
      const destinationArea = getOutcodeArea(destination);
      if (destinationArea) {
        destination = destinationArea;
      }
    } else {
      destination = fixSearchAddress(destination);
    }
    googleJsonData = await computeRoutesV2(origin, destination, GOOGLE_MAPS_API_KEY) as googleRouteResponse;
    // TODO : there could be other cases where the route did not work anything, using static when there is no distance
    if (!googleJsonData.routes[0].distanceMeters) {
      console.log("Found no distance from google maps, possibly same origin and destination");
      googleJsonData = googleMockDistanceRouteCall(driverAppDistance, pickupDistance, pickupTimeEstimate) as googleRouteResponse;
      destination = "Same as origin " + destination;
    }


    // 4. Calculate the result for desired output
    const ratingResult = calculateScore(googleJsonData, +passengerRating, pay, driverAppDistance, pickupDistance, pickupTimeEstimate);
    console.log(ratingResult);

    const successResponse = { ...ratingResult, destinationInfoString, scoreParameters: { googleJsonData, passengerRating, pay, driverAppDistance, pickupDistance, pickupTimeEstimate }, googleApiParameters: { origin, destination, key: "secretKey" } };
    await c.env.TRIP_LOG.put(`${new Date().toISOString()} uberScore:SuccessResponse}`, JSON.stringify(successResponse));
    await c.env.TRIPLOG.prepare('INSERT INTO successlogs (entry,data,timestamp) VALUES (?,?,?)').bind('uberScore:SuccessResponse', JSON.stringify(successResponse), new Date().toISOString()).run();

    return c.json(successResponse);

  } catch (error) {

    console.error('Error running score api:', error);
    const errorResponse = { error: `${error} Failed to fetch Google estimate from google v2 score api `, usedLocation: [origin, destination] };
    await c.env.TRIP_LOG.put(`${new Date().toISOString()} uberScore:ErrorResponse}`, JSON.stringify(errorResponse));
    await c.env.TRIPLOG.prepare('INSERT INTO successlogs (entry,data,timestamp) VALUES (?,?,?)').bind('uberScore:ErrorResponse', JSON.stringify(errorResponse), new Date().toISOString()).run();


    return c.json(errorResponse, 400); // TODO Change to this dynamic routing string
  }

})



/**
 *  @UberJsonData
 *  @Header with key 
 * -> makes request to google maps for data
 */
app.post('/static', async (c) => {
  console.log("You're trying the approximate method 📕")
  try {
    // Historical search - non dynamic
    const uberJsonData = await c.req.json()
    const GOOGLE_MAPS_API_KEY: string = c.req.header('key') as string;
    if (!GOOGLE_MAPS_API_KEY) {
      return c.json('No key provided', 400)
    }

    let { origin, destination, passengerRating, pay, pickupDistance, pickupTimeEstimate } = extractData(uberJsonData);
    const data = await fetchGoogleMapsData(origin, destination, true, GOOGLE_MAPS_API_KEY) as GoogleMapsSimpleDistanceMatrixReturn;
    // console.log(data.rows[0].elements.distance.values);
    const distanceDuration = data.rows[0].elements[0];
    const distance = distanceDuration.distance
    const duration = distanceDuration.duration
    return c.json({ data, some: "here" });
  } catch (error) {
    console.error('Error fetching Google estimate:', error);
    return c.json({ error: 'Failed to fetch Google estimate from estimate' }); // TODO: make this routing dynamic to match the current route
  }
})

// Get string for HTTP request
//console.log(fetchGoogleMapsData(origin, destination,  false)); // get url without calling


/**
 * For testing the data extraction part only.
 */
app.post('/extractUberData', async (c) => {
  const extract = extractData(await c.req.json());
  return c.json(extract);
})
export default app;
