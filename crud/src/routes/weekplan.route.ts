import { Hono } from 'hono';
import {
    createWeekplan,
    getCompleteWeekplanByStartDate,
    getWeekplanByStartDateWithoutAdvertisements,
} from '../services/weekplan.service.js';

const app = new Hono();

app.get('/:startDate/complete', async (c) => {
    const startDate = c.req.param('startDate');
    const weekplan = await getCompleteWeekplanByStartDate(startDate);

    return c.json(weekplan);
});

app.get('/:startDate/without-advertisements', async (c) => {
    const startDate = c.req.param('startDate');
    const weekplan = await getWeekplanByStartDateWithoutAdvertisements(startDate);

    return c.json(weekplan);
});

app.post('/', async (c) => {
    const body = await c.req.json();
    await createWeekplan(body.startDate);

    return c.text('ok');
});

export default app;
