import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { weekplanningRoute } from './modules/weekplanning/weekplanning.route';
import { ticketingRoute } from './modules/ticketing/ticketing.route';

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/schedule', weekplanningRoute);

app.route('/tickets', ticketingRoute);

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
