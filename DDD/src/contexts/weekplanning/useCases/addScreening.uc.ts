import crypto from 'node:crypto';
import { Screening } from '../domain/screening.js';
import { getWeekplan, saveWeekplan } from '../repo/weekplan.repo.js';
import type { AddScreeningDto } from './dtos/addScreening.dto.js';

export async function addScreening(dto: AddScreeningDto) {
    // authorization

    const screening = Screening.create({ ...dto, date: new Date(dto.date) }, crypto.randomUUID());
    const weekplan = await getWeekplan(dto.weekplanUuid);

    weekplan.addScreening(screening);

    await saveWeekplan(weekplan);
}
