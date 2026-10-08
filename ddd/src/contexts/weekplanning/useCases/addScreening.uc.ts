import { getFilmById } from '../db/film.repo.js';
import { getWeekplanById, saveWeekplan } from '../db/weekplan.repo.js';
import { Screening } from '../domain/screening.js';
import type { AddScreeningDto } from './dtos/addScreening.dto.js';

export async function addScreening(dto: AddScreeningDto) {
    // authorization

    const film = await getFilmById(dto.filmId);
    const screening = Screening.create({ film, ...dto });
    const weekplan = await getWeekplanById(dto.weekplanId);

    weekplan.addScreening(screening);

    await saveWeekplan(weekplan);
}
