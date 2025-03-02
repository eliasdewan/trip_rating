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
import { getOutcodeData, getOutcodeDataString } from './api/rideSharing/common/outCodes'
import { html } from 'hono/html'



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
  // let value = await c.env.TESTING.get('key')
  // let set = await c.env.TESTING.put('key','new Item 44')
  //  console.log(value);
  //  console.log(set);
  const key = new Date().toISOString()
  console.log(key);


  return c.json({ "env.(c)": some, "Binding c.env": ENV, KV: key })
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
  cacheControl: 'max-age=10', // Set the max-age to 3600 seconds (1 hour)
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
// run to execute , all to retrive
app.post('/db', async (c) => {
  // const TB = await c.env.TRIPLOG.prepare('select * FROM successlogs').all();
  // const { results } = await c.env.TRIPLOG.prepare('select * FROM successlogs').all();
  // console.log(TB, "dt tb", results);

  let cursor = null;
  let smt; 
  let result;
  const limit = 20;
  do {
    let kvkeys = [];
    const kvResponse = await c.env.TRIP_LOG.list({ cursor, limit });
    const kvResponseKeys = kvResponse.keys;
    //Prepare for each part
    smt = 'INSERT INTO successlogs (entry,data) VALUES ';

    // For every key and value , build two binding positions
    let index = 1;
    for (const key of kvResponseKeys) {
      smt = smt.concat(`(?${index * 2 - 1},?${index * 2}),`)
      index++;

      const value = await c.env.TRIP_LOG.get(key.name);
      kvkeys.push(key.name, value);
    }


    // End of statement check for leading comma
    if (smt.endsWith(",")) {
      smt = smt.slice(0, -1);
      console.log(smt);
    }

    // Run the sql query
    result = await c.env.TRIPLOG.prepare(smt).bind(...kvkeys).run();
    cursor = kvResponse.cursor;
    console.log(">", cursor, "<");

  } while (cursor);

  return c.json({ statement: smt, result });
});

app.post('/dbtest', async c => {
  let smt = 'INSERT INTO successlogs (entry,data) VALUES'
  for (let i = 0; i < 2; i++) {

    let cc = i + 1;
    smt = smt.concat(`(?${cc * 2 - 1},?${cc * 2}),`)
  }
  if (smt.endsWith(",")) {
    smt = smt.slice(0, -1)
  }

  let bindList = [];

  for (let i = 0; i < 2; i++) {
    bindList.push(`'key${i}'`, `'val'ue${i}'`)
    // smt = smt.concat(`('key${i}', 'value${i}'),`)
  }
  const result = await c.env.TRIPLOG.prepare(smt).bind(...bindList).run();
  console.log(bindList.toString());
  console.log(bindList.length);
  console.log(result);

  console.log(smt);

  return c.json({ statement: smt });
})

app.use(logger());
// console.log(getOutcodeDataString("SE1X, dfgsdfg"));
// console.log(getOutcodeDataString("WC1 sdfgsdfgAEDFG"));
// console.log(getOutcodeDataString("HG5 sdfgsdfgAEDFG"));

export default app


// TODO: Need to validate the data contains useful information before making COSTING API CALLS
//  TODO: check away and holiday,



