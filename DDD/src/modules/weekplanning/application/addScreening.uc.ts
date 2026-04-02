import { Screening } from '../domain/screening.js';
import { getWeekplan } from '../repo/weekplan.repo.js';
import type { AddScreeningDto } from './addScreening.dto.js';

export async function addScreening(dto: AddScreeningDto) {
    const screening = Screening.create(dto);
    const weekplan = await getWeekplan(dto.weekplanUuid);

    weekplan.addScreening(screening);
}
