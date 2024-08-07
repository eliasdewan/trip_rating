import { Hono } from 'hono'
import { calculateScore, googleMatrixReturn } from '../common/score';
import { extractData } from './uber.service'
import { dummyGoogleJsonData } from '../../../data/googleResultSample'
import { GoogleMapsSimpleDistanceMatrixReturn, fetchGoogleMapsData } from '../../../googleMapsCalls/googleDistance'
import { getGoogleEstimateV2 } from '../../../googleMapsCalls/googleDistanceV2'
import { googleMockDistanceMatrixCall } from '../../../googleMapsCalls/googleMockDistanceMatrix';
import { Bindings } from '../../..';

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

    // 2. Extract data from the request data
    ({ origin, destination, passengerRating, pay, driverAppDistance, pickupDistance, pickupTimeEstimate } = extractData(uberJsonData));

    // 3. Get data from google maps api or use static 
    let googleJsonData;

    // If origin and destination are same, don't call google api, for uber 
    if (origin === destination) {
      googleJsonData = googleMockDistanceMatrixCall(driverAppDistance, pickupDistance, pickupTimeEstimate) as googleMatrixReturn;
      destination = "Same as origin " + destination;
    } else {
      googleJsonData = await getGoogleEstimateV2(origin, destination, GOOGLE_MAPS_API_KEY) as googleMatrixReturn; // FIXME: Origin and destination are same scenario
    }

    // TODO: Check distance difference and make traffic unaware google maps api call to see if the route distance matches with the given uberDistance
    let googleDistanceMiles = googleJsonData[0].distanceMeters / 1.609;
    let combinedGivenDistanceMiles = driverAppDistance + pickupDistance;
    let estimateFactor = googleDistanceMiles / combinedGivenDistanceMiles;
    if (estimateFactor > 1.05) {
      // over estimating (could be diversion due to traffic). Need to check with google estimate with traffic unaware.
    } else if(estimateFactor < 0.95){
      // under estimating (could be short journey, just crossing one district or driverApp not taking some road closure into account)
      // may need to consider traffic conditions
    }

    // 4. Calculate the result for desired output
    const ratingResult = calculateScore(googleJsonData, +passengerRating, pay, driverAppDistance, pickupDistance, pickupTimeEstimate);
    console.log(ratingResult);

    const successResponse = { ...ratingResult, scoreParameters: { googleJsonData, passengerRating, pay, driverAppDistance, pickupDistance, pickupTimeEstimate }, googleApiParameters: { origin, destination, key: "secretKey" } };
    await c.env.TRIP_LOG.put(`${new Date().toISOString()} uberScore:SuccessResponse}`, JSON.stringify(successResponse));
    return c.json(successResponse);

  } catch (error) {

    console.error('Error running score api:', error);
    const errorResponse = { error: `${error} Failed to fetch Google estimate from google v2 score api `, usedLocation: [origin, destination] };
    await c.env.TRIP_LOG.put(`${new Date().toISOString()} uberScore:ErrorResponse}`, JSON.stringify(errorResponse));

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
