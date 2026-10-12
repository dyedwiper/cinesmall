import { getPosterByFilmId } from '../db/film.repo.js';

export async function getPosterForFilm(filmId: string) {
    const dto = await getPosterByFilmId(filmId);

    return dto;
}
