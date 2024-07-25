import { Context, Hono } from 'hono'
import uberController from './api/rideSharing/uber.ontroller'
import boltController from './api/rideSharing/bolt.controller'
import { logger } from 'hono/logger'
import { awayResult } from './data/validator/capture.validator'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { env } from 'hono/adapter'
import responseGoogleApiCall from './api/rideSharing/data/envVar.test'


type Bindings = {
  SECRET_KEY: string;
  FROM: string;
  GOOGLE_MAPS_API_KEY: string;
}


const app = new Hono<{ Bindings: Bindings }>()

app.notFound((c) => {
  return c.text('Page not found, but server is working 😁', 404)
})

app.onError((err, c) => {
  console.error(`${err}`)
  return c.text(`An error occurred: ${err}`, 500,)
})

app.use(logger())
app.route('/api', uberController);
app.route('/api', boltController)

console.log('Hono running');

addEventListener('fetch', event => {
  console.log('running event listener');
  event.respondWith(responseGoogleApiCall(event.request));
})

app.get('/var', (c) => {
  // In development both .toml and .dev.vars are used, .dev.vars is used when duplicate
  // dev.vars are hidden on development run terminal 


  const some = env(c);
  const ENV = c.env
  return c.json({ "env.(c)": some, "Binding c.env": ENV })
})


app.post('/test',
  zValidator('json', z.array(z.record(z.string()))),
  // zValidator('json', z.object({ text: z.string() })),
  (c) => {
    const validated = c.req.valid('json')

    // ENV
    const { GOOGLE_MAPS_API_KEY } = env<{ GOOGLE_MAPS_API_KEY: string }>(c)

    return c.json(validated)
  }
)


//awayResult





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

