import { eq } from 'drizzle-orm';
import { db } from '../../../shared/db/index.js';
import { films } from '../../../shared/db/schema.js';
import { Film } from '../domain/film.js';

export async function getFilmById(id: string) {
    const result = await db.query.films.findFirst({ where: { id } });

    if (!result) {
        throw new Error('Film not found.');
    }

    const film = Film.create({ hasPoster: !!result.poster, ...result });

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

export async function getPosterByFilmId(id: string) {
    const result = await db.query.films.findFirst({ where: { id } });

    if (!result?.poster || !result.posterFileName) {
        throw new Error('Poster not found.');
    }

    const dto = {
        fileName: result.posterFileName,
        file: result.poster,
    };

    return dto;
}

export async function savePoster(filmId: string, file: File, fileName: string) {
    const buffer = Buffer.from(await file.arrayBuffer());

    await db.update(films).set({ poster: buffer, posterFileName: fileName }).where(eq(films.id, filmId));
}
