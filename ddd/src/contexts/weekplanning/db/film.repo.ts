import { db } from '../../../shared/db/index.js';
import { films } from '../../../shared/db/schema.js';
import type { Film } from '../domain/film.js';

export async function saveFilm(film: Film) {
    const props = film.getProps();

    const mapped = {
        id: props.id.value,
        title: props.title.value,
        duration: props.duration.value,
    };

    await db.insert(films).values(mapped);
}
