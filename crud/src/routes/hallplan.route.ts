import { Hono } from 'hono';
import { createHallplans } from '../services/hallplan.service.js';

const app = new Hono();

app.post('/:weekplanId', async (c) => {
    const weekplanId = c.req.param('weekplanId');
    await createHallplans(weekplanId);

    return c.text('ok');
});

export default app;
