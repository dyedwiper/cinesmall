import crypto from 'node:crypto';
import { db } from '../db/index.js';
import { weekplans } from '../db/schema.js';
import type { CreateWeekplanDto } from './dtos/createWeekplan.dto.js';
import { WeekplanSchema } from '../schemas/weekplan.schema.js';

export async function getWeekplanByStartDate(startDate: string) {
    const result = await db.query.weekplans.findFirst({
        where: { startDate },
        with: { screenings: { with: { advertisements: true, hallplans: true } } },
    });

    return result;
}

export async function createWeekplan(dto: CreateWeekplanDto) {
    WeekplanSchema.parse(dto);

    const existing = await db.query.weekplans.findFirst({ where: { startDate: dto.startDate } });

    if (existing) throw new Error('Weekplan for this start date already exists.');

    let startDate;

    try {
        startDate = new Date(dto.startDate);
    } catch (error) {
        throw error;
    }

    if (startDate.getDay() !== 4) {
        throw new Error('The weekplan must start on a Thursday.');
    }

    await db.insert(weekplans).values({ id: crypto.randomUUID(), ...dto });
}
