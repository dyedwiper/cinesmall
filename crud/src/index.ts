import { serve } from '@hono/node-server';
import { Hono } from 'hono';

const app = new Hono();

app.get('/', async (c) => {
    return c.text('Success');
});

app.route('/weekplan', weekplan);
app.route('/screening', screening);

serve(
    {
        fetch: app.fetch,
        port: 2301,
    },
    (info) => {
        console.log(`Server is running on http://localhost:${info.port}`);
    },
);
