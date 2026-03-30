import { Hono } from 'hono';
import { createWeekplan } from '../application/weekplan.service.js';

const app = new Hono();

app.post('/weekplan', async (c) => {
    const body = await c.req.json();
    const startDate = body.startDate;
    createWeekplan({ startDate });
});

app.patch('/weekplan', (c) => {
    return c.text('weekplan updated');
});

export default app;
