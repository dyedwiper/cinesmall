import { Hono } from 'hono';
import { createScreening, getScreeningById } from '../services/screening.service.js';

const app = new Hono();

app.get('/:id', async (c) => {
    const id = c.req.param('id');
    const screening = await getScreeningById(id);

    return c.json(screening);
});

app.post('/', async (c) => {
    const body = await c.req.json();
    await createScreening(body);

    return c.text('ok');
});

export default app;
