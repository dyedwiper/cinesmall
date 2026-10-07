import { saveFilm } from '../db/film.repo.js';
import { Film } from '../domain/film.js';
import type { CreateFilmDto } from './dtos/createFilm.dto.js';

export async function createFilm(dto: CreateFilmDto) {
    const film = Film.create(dto);

    await saveFilm(film);
}
