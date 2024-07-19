import { Hono } from 'hono'
import uberController from './api/uber/uber.ontroller'
import { logger } from 'hono/logger'
import { awayResult } from './data/validator/capture.validator'


const app = new Hono()

app.use(logger())
app.route('/api', uberController)

console.log('Hono running')

awayResult

export default app


// Need to validate the data contains useful information before making COSTING API CALLS
//  check away and holiday,

// create routes for different types or formats of request


// Auto detect json format and routing

