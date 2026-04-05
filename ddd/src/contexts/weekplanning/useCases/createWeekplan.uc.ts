import { Weekplan } from '../domain/weekplan.js';
import { existsWeekplanForStartDate, saveWeekplan } from '../db/weekplan.repo.js';
import type { CreateWeekplanDto } from './dtos/createWeekplan.dto.js';

export async function createWeekplan(dto: CreateWeekplanDto) {
    // authorization

    if (await existsWeekplanForStartDate(dto.startDate)) {
        throw new Error('Weekplan for this start date already exists.');
    }

    const weekplan = Weekplan.create(dto);

    await saveWeekplan(weekplan);
}
