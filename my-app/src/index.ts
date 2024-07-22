import { Context, Hono } from 'hono'
import uberController from './api/uber/uber.ontroller'
import { logger } from 'hono/logger'
import { awayResult } from './data/validator/capture.validator'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { env } from 'hono/adapter'


const app = new Hono()

app.use(logger())
app.route('/api', uberController)

console.log('Hono running')

app.post('/test',
  zValidator('json', z.record(z.string())),
  // zValidator('json', z.object({ text: z.string() })),
  (c) => {
    const validated = c.req.valid('json')

    // ENV41456546
    const { GOOGLE_MAPS_API_KEY } = env<{ GOOGLE_MAPS_API_KEY: string }>(c)
   
    //const { GOOGLE_MAPS_API_KEY } = env<{ GOOGLE_MAPS_API_KEY: string }>(c)
    return c.json({ validated, GOOGLE_MAPS_API_KEY })
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

