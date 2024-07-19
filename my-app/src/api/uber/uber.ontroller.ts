import { Hono } from 'hono'
import { calculateScore } from './data/score'
import { extractData } from './data/uber.service'
import { dummyGoogleJsonData } from '../../data/googleResultSample'
import { fetchGoogleMapsData } from '../../googleMapsCalls/googleDistance'
import { getGoogleEstimatev2 } from '../../googleMapsCalls/googleDistancev2'


const app = new Hono()

//let { origin, destination, passengerRating, pay, pickupDistance, pickupTimeEstimate } = extractData(dummyUbberJsonData);
// console.log(origin, destination, passengerRating, pay, pickupDistance, pickupTimeEstimate);


app.get('/',  (c) => {
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
    let { origin, destination, passengerRating, pay, pickupDistance, pickupTimeEstimate } = extractData(uberJsonData);
    console.log(origin, destination, passengerRating, pay, pickupDistance, pickupTimeEstimate)
    // 2. Get data from google maps api
    //const data = await getGoogleEstimatev2()
    // 3. Calculate the result for desired output
    const ratingResult = calculateScore(dummyGoogleJsonData, passengerRating, pay, pickupDistance, pickupTimeEstimate);
    return c.json(ratingResult);

  } catch (error) {
    console.error('Error fetching Google estimate:', error);
    return c.json({ error: 'Failed to fetch Google estimate' });
  }

})

app.post('/score', async (c) => {

  try {
    // 1. Get uber data from request and extract data 
    const uberJsonData = await c.req.json()
    let { origin, destination, passengerRating, pay, pickupDistance, pickupTimeEstimate } = extractData(uberJsonData);
    // 2. Get data from google maps api
    let googleJsonData = await getGoogleEstimatev2(origin, destination);
    // 3. Calculate the result for desired output
    const ratingResult = calculateScore(googleJsonData, passengerRating, pay, pickupDistance, pickupTimeEstimate);
    return c.json(ratingResult);

  } catch (error) {
    console.error('Error fetching Google estimate:', error);
    return c.json({ error: 'Failed to fetch Google estimate' });
  }

})

/**
 *  @UberJsonData
 * -> makes request to google maps for data
 */
app.post('/static', async (c) => {
  console.log("Youre trying the approximate method 📕")
  try {
    // Historiacal search - non dynamic
    const uberJsonData = await c.req.json()
    let { origin, destination, passengerRating, pay, pickupDistance, pickupTimeEstimate } = extractData(uberJsonData);
    const data = await fetchGoogleMapsData(origin, destination);
    // console.log(data.rows[0].elements.distance.values);
    const distanceDuration = data.rows[0].elements[0];
    const distance = distanceDuration.distance
    const duration = distanceDuration.duration

    // console.log(data.rows[0].elements);
    console.log(distance);
    console.log(duration);

    // console.log(data.rows[0].elements.duration.values);
    return c.json({ data, some: "here" });
  } catch (error) {
    console.error('Error fetching Google estimate:', error);
    return c.json({ error: 'Failed to fetch Google estimate' });
  }
})

// Get string for HTTP request
//console.log(fetchGoogleMapsData(origin, destination,  false)); // get url without calling

export default app
