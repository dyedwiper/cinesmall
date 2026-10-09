import { Id } from '../../../shared/domain/valueObjects/id.js';
import { getFilmById, saveFilm, savePoster } from '../db/film.repo.js';

export async function addPosterToFilm(filmId: string, poster: Buffer) {
    const film = await getFilmById(filmId);
    const posterId = Id.create();
    film.addPoster(posterId);

    await savePoster(film.id, poster);

    await saveFilm(film);
}
