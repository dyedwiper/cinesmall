import crypto from 'node:crypto';
import { Weekplan } from '../domain/weekplan.js';
import { saveWeekplan } from '../repo/weekplan.repo.js';
import type { CreateWeekplanDto } from './createWeekplan.dto.js';

export async function createWeekplan(dto: CreateWeekplanDto) {
    // authorization

    const weekplan = Weekplan.create(dto, crypto.randomUUID());

    await saveWeekplan(weekplan);
}
