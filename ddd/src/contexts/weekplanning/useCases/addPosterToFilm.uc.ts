import { getFilmById, savePoster } from '../db/film.repo.js';

export async function addPosterToFilm(filmId: string, file: File, fileName: string) {
    const film = await getFilmById(filmId);

    if (film.hasPoster) {
        throw new Error('The film already has a poster.');
    }

    await savePoster(film.id, file, fileName);
}
