import { Hono } from 'hono';
import { getWeekplanByStartDate } from '../repo/weekplan.repo.js';
import { createHallplans } from '../useCases/createHallplans.uc.js';

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

app.get('hallplan/:uuid', (c) => {
    return c.text('Saalplan für Vorstellung' + c.req.param('id'));
});

app.patch('saalplan/:id', (c) => {
    return c.text('Sitzplatz in Saalplan reserviert');
});

export default app;
