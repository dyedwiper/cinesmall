import { Hono } from 'hono';
import { createWeekplan } from '../application/createWeekplan.uc.js';
import { addScreening } from '../application/addScreening.uc.js';

const app = new Hono();

app.post('/weekplan', async (c) => {
    const body = await c.req.json();
    await createWeekplan(body);

    return c.status(201);
});

app.post('/screening', async (c) => {
    const body = await c.req.json();
    await addScreening(body);

    return c.status(200);
});

export default app;
