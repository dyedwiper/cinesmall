import { Hono } from 'hono';
import { addScreening } from '../useCases/addScreening.uc.js';
import { createWeekplan } from '../useCases/createWeekplan.uc.js';
import { removeScreening } from '../useCases/removeScreening.uc.js';
import { addAdvertisement } from '../useCases/addAdvertisement.uc.js';

const app = new Hono();

app.post('/weekplan', async (c) => {
    const body = await c.req.json();
    await createWeekplan(body);

    return c.text('ok');
});

app.post('/screening', async (c) => {
    const body = await c.req.json();
    await addScreening(body);

    return c.text('ok');
});

app.delete('/screening/:id', async (c) => {
    const id = c.req.param('id');
    await removeScreening(id);

    return c.text('ok');
});

app.post('/advertisement', async (c) => {
    const body = await c.req.json();
    await addAdvertisement(body);

    return c.text('ok');
});

export default app;
