import { Hono } from 'hono';
import { getWeekplanByStartDate } from '../db/weekplan.repo.js';
import { getScreeningsByWeekplanId } from '../db/screening.repo.js';
import { Hallplan } from '../../core/hallplan.js';
import { getHallplanById, getHallplanDtoById, saveHallplan } from '../db/hallplan.repo.js';

const app = new Hono();

app.post('/hallplans/:weekplanId', async (c) => {
    const weekplanId = c.req.param('weekplanId');

    const screenings = await getScreeningsByWeekplanId(weekplanId);
    const hallplans = screenings.map((screening) =>
        Hallplan.create({ screeningId: screening.id, hallNumber: screening.hallNumber }),
    );

    const promises = hallplans.map((hallplan) => saveHallplan(hallplan));
    await Promise.all(promises);

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

    const hallplan = await getHallplanById(id);

    const seats = body.seats as string[];
    seats.forEach((seat) => hallplan.reserveSeat(seat));

    await saveHallplan(hallplan);

    return c.text('ok');
});

export default app;
