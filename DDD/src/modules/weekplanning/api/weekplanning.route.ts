import { Hono } from 'hono';
import { addScreening } from '../useCases/addScreening.uc.js';
import { createWeekplan } from '../useCases/createWeekplan.uc.js';
import { removeScreening } from '../useCases/removeScreening.uc.js';

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

app.delete('/screening/:screeningUuid/weekplan/:weekplanUuid', async (c) => {
    const screeningUuid = c.req.param('screeningUuid');
    const weekplanUuid = c.req.param('weekplanUuid');
    await removeScreening(screeningUuid, weekplanUuid);

    return c.text('ok');
});

export default app;
