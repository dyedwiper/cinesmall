import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import ticketing from './modules/ticketing/route/ticketing.route.js';
import weekplanning from './modules/weekplanning/route/weekplanning.route.js';

const app = new Hono();

app.get('/', (c) => {
    return c.text('Hello Hono!');
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
