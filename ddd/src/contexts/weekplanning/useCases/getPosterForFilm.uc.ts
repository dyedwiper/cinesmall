import { getPosterByFilmId } from '../db/film.repo.js';

export async function getPosterForFilm(filmId: string) {
    const poster = await getPosterByFilmId(filmId);

    return poster;
}
