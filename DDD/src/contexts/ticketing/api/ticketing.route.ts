import { Hono } from 'hono';
import { getWeekplanByStartDate } from '../repo/weekplan.repo.js';
import { createHallplans } from '../useCases/createHallplans.uc.js';
import { getHallplanDtoByUuid } from '../repo/hallplan.repo.js';
import { reserveSeats } from '../useCases/reserveSeats.uc.js';

const app = new Hono();

app.post('/hallplans/:weekplanUuid', async (c) => {
    const weekplanUuid = c.req.param('weekplanUuid');
    await createHallplans(weekplanUuid);

    return c.text('ok');
});

app.get('/weekplan/:startDate', async (c) => {
    const startDate = c.req.param('startDate');
    const weekplan = await getWeekplanByStartDate(startDate);

    return c.json(weekplan);
});

app.get('hallplan/:uuid', async (c) => {
    const uuid = c.req.param('uuid');
    const hallplan = await getHallplanDtoByUuid(uuid);

    return c.json(hallplan);
});

app.patch('hallplan/:uuid', async (c) => {
    const uuid = c.req.param('uuid');
    const body = await c.req.json();
    await reserveSeats(uuid, body.seats);

    return c.text('ok');
});

export default app;
