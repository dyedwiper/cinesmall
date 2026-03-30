import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import wochenplanung from './modules/wochenplanung/route/wochenplanung.route.js'
import kartenverkauf from './modules/kartenverkauf/kartenverkauf.route.js'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/wochenplanung', wochenplanung)
app.route('kartenverkauf', kartenverkauf)

serve({
  fetch: app.fetch,
  port: 2300
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
