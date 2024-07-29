import { Hono } from 'hono'
import { calculateScore, googleMatrixReturn } from './common/score';
import { extractData } from './uber/uber.service'
import { dummyGoogleJsonData } from '../../data/googleResultSample'
import { fetchGoogleMapsData } from '../../googleMapsCalls/googleDistance'
import { getGoogleEstimatev2 } from '../../googleMapsCalls/googleDistancev2'
import { env } from 'hono/adapter'
import multiplePoints from '../../data/uberTaskerScreenInfo/multiplePoints'
import boltExample from '../../data/boltTaskerScreenInfo/boltExample'


const app = new Hono()

app.post('/', (c) => {
  return c.text('Do you know what you are doing?')
}).get('/', (c) => {
  return c.text('Hello Uber!')
})

/**
 *  Uses dummy gogle data from takskerData withouth calling google maps api
 */
app.post('/testQuery', async (c) => {
  try {
    // 1. Get uber data from request and extract data 
    const uberJsonData = await c.req.json()
    let { origin, destination, passengerRating, pay, uberDistance, pickupDistance, pickupTimeEstimate } = extractData(uberJsonData);
    console.log(origin, destination, passengerRating, pay, pickupDistance, pickupTimeEstimate)
    // 2. Get data from google maps api
    //const data = await getGoogleEstimatev2()
    // 3. Calculate the result for desired output
    const ratingResult = calculateScore(dummyGoogleJsonData, passengerRating, pay, uberDistance, pickupDistance, pickupTimeEstimate);
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
  let origin, destination, passengerRating, pay, uberDistance, pickupDistance, pickupTimeEstimate;
  // const { GOOGLE_MAPS_API_KEY } = env<{ GOOGLE_MAPS_API_KEY: string }>(c)
  const GOOGLE_MAPS_API_KEY = c.req.header('key') as string;
  if (!GOOGLE_MAPS_API_KEY) {
    return c.json('No key provided', 400)
  }
  try {
    // 1. Get uber data from request and extract data 
    const uberJsonData = await c.req.json();
    ({ origin, destination, passengerRating, pay, uberDistance, pickupDistance, pickupTimeEstimate } = extractData(uberJsonData));
    // 2. Get data from google maps api
    let googleJsonData = await getGoogleEstimatev2(origin, destination, GOOGLE_MAPS_API_KEY) as googleMatrixReturn; // TODO: INPUT KEY HERE
    // 3. Calculate the result for desired output
    const ratingResult = calculateScore(googleJsonData, +passengerRating, pay, uberDistance, pickupDistance, pickupTimeEstimate);
    console.log(ratingResult);

    return c.json({ ...ratingResult, scoreParameters: { googleJsonData, passengerRating, pay, uberDistance, pickupDistance, pickupTimeEstimate }, googleApiParameters: { origin, destination, key: "secretKey" } });

  } catch (error) {
    console.error('Error running score api:', error);
    return c.json({ error: 'Failed to fetch Google estimate from google v2 score api', usedLocation: [origin, destination] }); // TODO Change to this dynamic routing string
  }

})



/**
 *  @UberJsonData
 *  @Header with key 
 * -> makes request to google maps for data
 */
app.post('/static', async (c) => {
  console.log("Youre trying the approximate method 📕")
  try {
    // Historiacal search - non dynamic
    const uberJsonData = await c.req.json()
    const GOOGLE_MAPS_API_KEY: string = c.req.header('key') as string;
    if (!GOOGLE_MAPS_API_KEY) {
      return c.json('No key provided', 400)
    }

    let { origin, destination, passengerRating, pay, pickupDistance, pickupTimeEstimate } = extractData(uberJsonData);
    const data = await fetchGoogleMapsData(origin, destination, true, GOOGLE_MAPS_API_KEY);
    // console.log(data.rows[0].elements.distance.values);
    const distanceDuration = data.rows[0].elements[0];
    const distance = distanceDuration.distance
    const duration = distanceDuration.duration
    return c.json({ data, some: "here" });
  } catch (error) {
    console.error('Error fetching Google estimate:', error);
    return c.json({ error: 'Failed to fetch Google estimate from estimate' }); // TODO: make this routing dynamic to match the curret route
  }
})

// Get string for HTTP request
//console.log(fetchGoogleMapsData(origin, destination,  false)); // get url without calling



app.post('/extractUberData', async (c) => {
  const extract = extractData(await c.req.json());
  return c.json(extract);
})
export default app
