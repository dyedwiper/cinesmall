import { Screening } from '../domain/screening.js';
import { getWeekplan } from '../repo/weekplan.repo.js';
import type { AddScreeningDto } from './addScreening.dto.js';

export async function addScreening(dto: AddScreeningDto) {
    const weekplan = await getWeekplan(dto.weekplanUuid);
    const screening = Screening.create({
        weekplanUuid: weekplan.uuid,
        date: dto.date,
        film: dto.film,
    });

    weekplan.addScreening(screening);
}
