import { Hono } from 'hono';
import { getWeekplanByStartDate } from '../db/weekplan.repo.js';
import { createHallplans } from '../useCases/createHallplans.uc.js';
import { getHallplanDtoById } from '../db/hallplan.repo.js';
import { reserveSeats } from '../useCases/reserveSeats.uc.js';

const app = new Hono();

app.post('/hallplans/:weekplanId', async (c) => {
    const weekplanId = c.req.param('weekplanId');
    await createHallplans(weekplanId);

    return c.text('ok');
});

app.get('/weekplan/:startDate', async (c) => {
    const startDate = c.req.param('startDate');
    const weekplan = await getWeekplanByStartDate(startDate);

    return c.json(weekplan);
});

app.get('hallplan/:id', async (c) => {
    const id = c.req.param('id');
    const hallplan = await getHallplanDtoById(id);

    return c.json(hallplan);
});

app.patch('hallplan/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();
    await reserveSeats(id, body.seats);

    return c.text('ok');
});

export default app;
