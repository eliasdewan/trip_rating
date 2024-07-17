import { Hono } from 'hono'
import { fetchGoogleMapsData } from './googleDistance'
import { extractData } from './taskerData'
import { getGoogleEstimatev2 } from './googleDistancev2'
import { calculateScore } from './score'



const app = new Hono()

const { origin, destination, passengerRating, pay, pickupDistance, pickupTimeEstimate } = extractData();
console.log(origin, destination, passengerRating, pay, pickupDistance, pickupTimeEstimate);


app.get('/', (c) => {
  return c.text('Hello Uber!')
})

app.post('/', async (c) => {

  //let response; 
  try {
    //const data = await getGoogleEstimatev2()
    const data = [
      {
        originIndex: 0,
        destinationIndex: 0,
        status: {},
        distanceMeters: 31456,
        duration: '4216s',
        condition: 'ROUTE_EXISTS'
      }
    ]

    //response = c.json({ data })
    calculateScore(data, passengerRating, pay, pickupDistance, pickupTimeEstimate);
    //console.log();
    return c.json({ data })

  } catch (error) {
    console.error('Error fetching Google estimate:', error)
    return c.json({ error: 'Failed to fetch Google estimate' })
  }

})

// 🍉 old style
app.post('/static', async (c) => {
  const response =
    // Historiacal search - non dynamic
    await fetchGoogleMapsData(origin, destination)
      .then(data => console.log('Google Maps API response:', data))
      .catch(error => console.error('Error:', error));
  return c.json([response]);
})

// Get string for HTTP request
//console.log(fetchGoogleMapsData(origin, destination,  false)); // get url without calling


export default app
