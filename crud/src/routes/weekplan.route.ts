import { Hono } from 'hono';
import { createWeekplan, getWeekplanByStartDate } from '../services/weekplan.service.js';

const app = new Hono();

app.get('/:startDate', async (c) => {
    const startDate = c.req.param('startDate');
    const weekplan = await getWeekplanByStartDate(startDate);

    return c.json(weekplan);
});

app.post('/', async (c) => {
    const body = await c.req.json();
    await createWeekplan(body.startDate);

    return c.text('ok');
});

export default app;
