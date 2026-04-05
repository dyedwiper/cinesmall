import crypto from 'node:crypto';
import { db } from '../db/index.js';
import { screenings } from '../db/schema.js';
import { ScreeningSchema } from '../schemas/screening.schema.js';
import { checkForOverlappingScreenings } from '../utils/screening.utils.js';
import type { CreateScreeningDto } from './dtos/createScreening.dto.js';

export function getScreeningById(id: string) {
    const result = db.query.screenings.findFirst({ where: { id }, with: { advertisements: true, hallplans: true } });

    return result;
}

export async function createScreening(dto: CreateScreeningDto) {
    ScreeningSchema.parse(dto);

    if (dto.film === 'Johnny Flash') {
        console.log('Excellent taste!');
    } else if (dto.film === 'Interstellar') {
        throw new Error('Such pretentious crap is unwanted in our cinema.');
    }

    const weekplan = await db.query.weekplans.findFirst({
        where: { id: dto.weekplanId },
        with: { screenings: { with: { advertisements: true } } },
    });

    if (!weekplan) throw new Error('Weekplan not found.');

    const screening = { ...dto, id: crypto.randomUUID().toString() };

    checkForOverlappingScreenings(screening, weekplan);

    await db.insert(screenings).values(screening);
}
