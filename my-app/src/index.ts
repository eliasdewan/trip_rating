import { Hono } from 'hono'
import uberController from './api/rideSharing/uber/uber.controller'
import boltController from './api/rideSharing/bolt/bolt.controller'
import { logger } from 'hono/logger'
import { searchResult } from './data/validator/capture.validator'
import { zValidator } from '@hono/zod-validator'
import { object, z } from 'zod'
import { env } from 'hono/adapter'
import { failedRequest } from './data/uberTaskerScreenInfo/uberDataSample'
import { cache } from 'hono/cache'
import { getOutcodeData } from './api/rideSharing/common/outCodes'


export type Bindings = {
  SECRET_KEY: string;
  FROM: string;
  GOOGLE_MAPS_API_KEY: string;
  TRIP_LOG: KVNamespace;
}

const app = new Hono<{ Bindings: Bindings }>();
app.route('/api', uberController);
app.route('/api', boltController);

console.log('Hono running');

app.get('/var', async (c) => {
  // In development both .toml and .dev.vars are used, .dev.vars is used when duplicate
  // dev.vars are hidden on development run terminal 
  const some = env(c);
  const ENV = c.env;
  // let value = await c.env.TESTING.get('key')
  // let set = await c.env.TESTING.put('key','new Item 44')
  //  console.log(value);
  //  console.log(set);
  const key = new Date().toISOString()
  console.log(key);
  
  
  return c.json({ "env.(c)": some, "Binding c.env": ENV, KV:key })
})


app.post('/testContains', async c => {
  return c.req.json().
    then(json => {
      const valid = searchResult(Object.values(json)[0] as string, failedRequest);
      return c.json({ valid })
    }).catch(error => {
      return c.json({ message: "failed", error })
    })
})

app.use(cache({
  cacheName: 'my-app',
  cacheControl: 'max-age=2', // Set the max-age to 3600 seconds (1 hour)
  // keyGenerator: async (c) => {
  //   // Generate a key based on the request body or other parameters
  //   const body = await c.req.text();
  //   return `${c.req.url}-${body}`;
  // },
  // wait: true
}))


app.post('/test',
  // Validation middleware, if not valid sends 404 Bad Request
  zValidator('json', z.array(z.record(z.string()))),
  // Automatically doesn't cache if there was an error (with status code)
  
  async (c) => {
    // Ensure that `req.valid` correctly reflects the expected type
    const validated = c.req.valid('json');

    // ENV (assuming `env` function exists and returns the correct type)
    // const { GOOGLE_MAPS_API_KEY } = env<{ GOOGLE_MAPS_API_KEY: string }>(c);

    // Return the validated data
    console.log('Validated');
    // c.status(400);
    return c.json(validated);
  }
);


//awayResult


app.notFound((c) => {
  return c.text('Page not found, but server is working 😁', 404)
})

app.onError((err, c) => {
  console.error(`${err}`)
  return c.text(`An error occurred: ${err}`, 500,)
})

app.use(logger());
console.log(getOutcodeData("EC1"));
console.log(getOutcodeData("EX1"));

export default app


// TODO: Need to validate the data contains useful information before making COSTING API CALLS
//  TODO: check away and holiday,

// TODO: create routes for different types or formats of request
// ocr and screen grab
// TODO : Traffic info , use normal distance matrix and then use that time to compare with v2 matrix - use percentage , maye even compae distance and and show inrease in minites
// OR use thhe traffic unaware mod to do the computing - traffc aware and model
// https://developers.google.com/maps/documentation/routes/traffic-model
// https://developers.google.com/maps/documentation/routes/config_trade_offs
// https://developers.google.com/maps/documentation/distance-matrix

// Auto detect json format and routing

