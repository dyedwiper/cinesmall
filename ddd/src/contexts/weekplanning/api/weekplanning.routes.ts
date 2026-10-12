import { Hono } from 'hono';
import { stream } from 'hono/streaming';
import { addAdvertisement } from '../useCases/addAdvertisement.uc.js';
import { addPosterToFilm } from '../useCases/addPosterToFilm.uc.js';
import { addScreening } from '../useCases/addScreening.uc.js';
import { createFilm } from '../useCases/createFilm.uc.js';
import { createWeekplan } from '../useCases/createWeekplan.uc.js';
import { getPosterForFilm } from '../useCases/getPosterForFilm.uc.js';
import { getWeekplanByStartDate } from '../useCases/getWeekplanByStartDate.uc.js';
import { removeScreening } from '../useCases/removeScreening.uc.js';

const app = new Hono();

app.get('/weekplan/:startDate', async (c) => {
    const startDate = c.req.param('startDate');
    const weekplan = await getWeekplanByStartDate(startDate);

    return c.json(weekplan);
});

app.post('/weekplan', async (c) => {
    const body = await c.req.json();
    await createWeekplan(body);

    return c.text('ok');
});

app.post('film', async (c) => {
    const body = await c.req.json();
    await createFilm(body);

    return c.text('ok');
});

app.get('poster/filmId/:filmId', async (c) => {
    const filmId = c.req.param('filmId');

    const poster = await getPosterForFilm(filmId);

    // See: https://hono.dev/docs/helpers/streaming#stream
    return stream(c, async (stream) => {
        // Write a process to be executed when aborted.
        stream.onAbort(() => {
            console.log('Aborted!');
        });

        if (!poster) {
            return stream.abort();
        }

        // Write a Uint8Array.
        await stream.write(new Uint8Array(poster));
    });
});

app.post('poster', async (c) => {
    const body = await c.req.parseBody();
    const filmId = body['filmId'] as string;
    const poster = body['file'] as File;
    addPosterToFilm(filmId, poster);

    return c.text('ok');
});

app.post('/screening', async (c) => {
    const body = await c.req.json();
    await addScreening(body);

    return c.text('ok');
});

app.delete('/screening/:id', async (c) => {
    const id = c.req.param('id');
    await removeScreening(id);

    return c.text('ok');
});

app.post('/advertisement', async (c) => {
    const body = await c.req.json();
    await addAdvertisement(body);

    return c.text('ok');
});

export default app;
