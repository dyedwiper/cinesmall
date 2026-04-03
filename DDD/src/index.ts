import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import ticketing from './contexts/ticketing/api/ticketing.route.js';
import weekplanning from './contexts/weekplanning/api/weekplanning.route.js';

const app = new Hono();

app.get('/', async (c) => {
    return c.text('Success');
});

app.route('/weekplanning', weekplanning);
app.route('/ticketing', ticketing);

serve(
    {
        fetch: app.fetch,
        port: 2300,
    },
    (info) => {
        console.log(`Server is running on http://localhost:${info.port}`);
    },
);
