import { Hono } from 'hono'
import uberController from './api/rideSharing/uber/uber.controller'
import boltController from './api/rideSharing/bolt/bolt.controller'
import clientController from './client/client.controller'
import { logger } from 'hono/logger'
import { searchResult } from './data/validator/capture.validator'
import { zValidator } from '@hono/zod-validator'
import { input, object, z } from 'zod'
import { env } from 'hono/adapter'
import { failedRequest } from './data/uberTaskerScreenInfo/uberDataSample'
import { cache } from 'hono/cache'
import { html } from 'hono/html'
import { fixSearchAddress, getOutcodeArea, getOutcodeData, getOutcodeDataString, localitySearch } from './api/rideSharing/common/outCodes';



export type Bindings = {
  SECRET_KEY: string;
  FROM: string;
  GOOGLE_MAPS_API_KEY: string;
  TRIP_LOG: KVNamespace;
  TRIPLOG: D1Database;
}

//TODO: Add a way to check for duplicate request , and not make the same request again
const app = new Hono<{ Bindings: Bindings }>();
app.route('/api', uberController);
app.route('/api', boltController);
app.route('/client', clientController);

console.log('Hono running');

app.get('/var', async (c) => {
  // In development both .toml and .dev.vars are used, .dev.vars is used when duplicate
  // dev.vars are hidden on development run terminal 
  const some = env(c);
  const ENV = c.env;
   // ENV (assuming `env` function exists and returns the correct type)
    // const { GOOGLE_MAPS_API_KEY } = env<{ GOOGLE_MAPS_API_KEY: string }>(c);
  // let value = await c.env.TESTING.get('key')
  // let set = await c.env.TESTING.put('key','new Item 44')
  //  console.log(value);
  //  console.log(set);
  const key = new Date().toISOString()
  console.log(key);

  // use this for testing bindings
  // return c.json({ "env.(c)": some, "Binding c.env": ENV, KV: key })
  return c.text('private');
})




// console.log("###",getOutcodeDataString("EC4M, London","281 Green Lanes, London N4 2EX"));
// console.log("@@",getOutcodeData("12 Queenstown Road, London EC2E 3RX"));
// console.log("@@",getOutcodeData("12 Queenstown Road, London EC2 3RX"));
// console.log("@@",getOutcodeData("12 Queenstown Road, London UB2 3RX"));
// console.log("@@",getOutcodeData("12 Queenstown Road, London UB2 3RX"));


// no outcode , only name of the location
// console.log("Locality search>>>>",fixSearchAddress("HA4 , Harov"));


 



// UNUSED VALIDATORS
// ["string"] as body
app.post('/testContains', async c => {
  return c.req.json().
    then(json => {
      const valid = searchResult(Object.values(json)[0] as string, failedRequest);
      return c.json({ valid })
    }).catch(error => {
      return c.json({ message: "failed", error })
    })
})

// Validator test currently not implemented
// Tests the json body format is string record inside array : Tasker screen context format
app.post('/test',
  // Validation middleware, if not valid sends 404 Bad Request
  zValidator('json', z.array(z.record(z.string()))),

  async (c) => {
    // Ensure that `req.valid` correctly reflects the expected type
    const validated = c.req.valid('json');
    // Return the validated data
    console.log('Validated');
    // c.status(400);
    return c.json(validated);
  }
);

// Automatically doesn't cache if there was an error (with status code)
app.use(cache({
  cacheName: 'my-app',
  cacheControl: 'max-age=10', // Set the max-age to 3600 seconds (1 hour)
  // keyGenerator: async (c) => {
  //   // Generate a key based on the request body or other parameters
  //   const body = await c.req.text();
  //   return `${c.req.url}-${body}`;
  // },
  // wait: true
}))

app.notFound((c) => {
  return c.text('Page not found, but server is working 😁', 404)
})

app.onError((err, c) => {
  console.error(`${err}`)
  return c.text(`An error occurred: ${err}`, 500,)
})

app.use(logger());
// console.log(getOutcodeDataString("SE1X, dfgsdfg"));
// console.log(getOutcodeDataString("WC1 sdfgsdfgAEDFG"));
// console.log(getOutcodeDataString("HG5 sdfgsdfgAEDFG"));
// console.log(getOutcodeDataString("sdfasdfs,  UB5 dfgsdfgsdfg","W4 sdfgsdfgAEDFG"));

 
export default app


// TODO: Need to validate the data contains useful information before making COSTING API CALLS
//  TODO: check away and holiday,



