import { Weekplan } from '../domain/weekplan.js';
import { insertWeekplan } from '../repo/weekplan.repo.js';
import type { CreateWeekplanDto } from './createWeekplan.dto.js';

export async function createWeekplan(dto: CreateWeekplanDto) {
    // authorization

    const weekplan = Weekplan.create(dto);

    await insertWeekplan(weekplan);
}
