import { db } from '../../../shared/db/index.js';
import { films } from '../../../shared/db/schema.js';
import { Film } from '../domain/film.js';

export async function getFilmById(id: string) {
    const result = await db.query.films.findFirst({ where: { id } });

    if (!result) {
        throw new Error('Film not found.');
    }

    const film = Film.create(result);

    return film;
}

export async function saveFilm(film: Film) {
    const props = film.getProps();

    const mapped = {
        id: props.id.value,
        title: props.title.value,
        duration: props.duration.value,
    };

    await db.insert(films).values(mapped);
}
