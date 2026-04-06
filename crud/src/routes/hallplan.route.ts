import { Hono } from 'hono';
import { createHallplans, reserveSeats } from '../services/hallplan.service.js';

const app = new Hono();

app.post('/:weekplanId', async (c) => {
    const weekplanId = c.req.param('weekplanId');
    await createHallplans(weekplanId);

    return c.text('ok');
});

app.patch('/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();

    await reserveSeats(id, body.seats);

    return c.text('ok');
});

export default app;
