import { db } from '../../../db/index.js';
import { weekplanTable } from '../../../db/schema.js';
import { Weekplan } from '../domain/weekplan.js';
import type { CreateWeekplanDto } from './weekplan.dto.js';

export async function createWeekplan(dto: CreateWeekplanDto) {
    // authorization

    const weekplan = Weekplan.create(dto.startDate);

    db.insert(weekplanTable).values(weekplan);
}
