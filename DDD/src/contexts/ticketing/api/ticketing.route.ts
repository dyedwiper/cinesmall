import { Hono } from 'hono';
import { getWeekplanByStartDate } from '../repo/weekplan.repo.js';

const app = new Hono();

app.post('/saalplaene', (c) => {
    return c.text('Saalpläne erzeugt');
});

app.get('/weekplan/:startDate', async (c) => {
    const startDate = c.req.param('startDate');
    const weekplan = await getWeekplanByStartDate(startDate);

    return c.json(weekplan);
});

app.get('saalplan/:id', (c) => {
    return c.text('Saalplan für Vorstellung' + c.req.param('id'));
});

app.patch('saalplan/:id', (c) => {
    return c.text('Sitzplatz in Saalplan reserviert');
});

export default app;
