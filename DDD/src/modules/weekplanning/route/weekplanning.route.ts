import { Hono } from 'hono'

const app = new Hono()

app.post('/weekplan', (c) => {
    return c.text('weekplan created')
})

app.patch('/weekplan', (c) => {
    return c.text('weekplan updated')
})

export default app