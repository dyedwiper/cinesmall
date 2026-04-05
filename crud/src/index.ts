import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import advertisementRoute from './routes/advertisement.route.js';
import hallplanRoute from './routes/hallplan.route.js';
import screeningRoute from './routes/screening.route.js';
import weekplanRoute from './routes/weekplan.route.js';

const app = new Hono();

app.get('/', async (c) => {
    return c.text('Success');
});

app.route('/weekplan', weekplanRoute);
app.route('/screening', screeningRoute);
app.route('/advertisement', advertisementRoute);
app.route('/hallplan', hallplanRoute);

serve(
    {
        fetch: app.fetch,
        port: 2301,
    },
    (info) => {
        console.log(`Server is running on http://localhost:${info.port}`);
    },
);
