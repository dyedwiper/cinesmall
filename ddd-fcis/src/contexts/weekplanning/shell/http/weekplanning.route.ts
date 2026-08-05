import { Hono } from 'hono';
import {
    existsWeekplanForStartDate,
    getWeekplanById,
    getWeekplanDtoByStartDate,
    getWeekplanIdByScreeningId,
    saveWeekplan,
} from '../db/weekplan.repo.js';
import { Weekplan } from '../../core/weekplan.js';
import { Screening } from '../../core/screening.js';
import { Advertisement } from '../../core/advertisement.js';

const app = new Hono();

app.get('/weekplan/:startDate', async (c) => {
    const startDate = c.req.param('startDate');
    const weekplan = await getWeekplanDtoByStartDate(startDate);

    return c.json(weekplan);
});

app.post('/weekplan', async (c) => {
    const body = await c.req.json();

    if (await existsWeekplanForStartDate(body.startDate)) {
        throw new Error('Weekplan for this start date already exists.');
    }

    const weekplan = Weekplan.create(body);

    await saveWeekplan(weekplan);

    return c.text('ok');
});

app.post('/screening', async (c) => {
    const body = await c.req.json();

    const screening = Screening.create(body);
    const weekplan = await getWeekplanById(body.weekplanId);

    weekplan.addScreening(screening);

    await saveWeekplan(weekplan);
    return c.text('ok');
});

app.delete('/screening/:id', async (c) => {
    const id = c.req.param('id');

    const weekplanId = await getWeekplanIdByScreeningId(id);
    const weekplan = await getWeekplanById(weekplanId);

    weekplan.removeScreening(id);

    await saveWeekplan(weekplan);

    return c.text('ok');
});

app.post('/advertisement', async (c) => {
    const body = await c.req.json();

    const advertisment = Advertisement.create(body);
    const weekplanId = await getWeekplanIdByScreeningId(body.screeningId);
    const weekplan = await getWeekplanById(weekplanId);

    weekplan.addAdvertismentToScreening(advertisment, body.screeningId);

    await saveWeekplan(weekplan);

    return c.text('ok');
});

export default app;
