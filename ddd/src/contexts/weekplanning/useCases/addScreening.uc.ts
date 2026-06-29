import { Screening } from '../domain/screening.js';
import { getWeekplanById, saveWeekplan } from '../db/weekplan.repo.js';
import type { AddScreeningDto } from './dtos/addScreening.dto.js';

export async function addScreening(dto: AddScreeningDto) {
    // authorization

    const screening = Screening.create(dto);
    const weekplan = await getWeekplanById(dto.weekplanId);

    weekplan.addScreening(screening);

    await saveWeekplan(weekplan);
}
