import { Screening } from '../domain/screening.js';
import { getWeekplan, saveWeekplan } from '../db/weekplan.repo.js';
import type { AddScreeningDto } from './dtos/addScreening.dto.js';

export async function addScreening(dto: AddScreeningDto) {
    // authorization

    const screening = Screening.create({ ...dto, date: new Date(dto.date) });
    const weekplan = await getWeekplan(dto.weekplanUuid);

    weekplan.addScreening(screening);

    await saveWeekplan(weekplan);
}
