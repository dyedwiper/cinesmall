import { Hono } from 'hono';
import { createAdvertisment } from '../services/advertisement.service.js';

const app = new Hono();

app.post('/', async (c) => {
    const body = await c.req.json();
    await createAdvertisment(body);

    return c.text('ok');
});

export default app;
