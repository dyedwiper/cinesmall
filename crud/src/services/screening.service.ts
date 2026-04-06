import crypto from 'node:crypto';
import { db } from '../db/index.js';
import { screenings } from '../db/schema.js';
import { ScreeningSchema } from '../validation/screening.schema.js';
import { checkForOverlappingScreenings } from '../utils/screening.utils.js';
import type { CreateScreeningDto } from './dtos/createScreening.dto.js';
import type { Screening, Weekplan } from '../db/types.js';

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

    checkIfDateBelongsToWeekplan(screening, weekplan);
    checkForOverlappingScreenings(screening, weekplan);

    await db.insert(screenings).values(screening);
}

function checkIfDateBelongsToWeekplan(screening: Screening, weekplan: Weekplan) {
    const startOfWeek = new Date(weekplan.startDate).getTime();
    const endOfWeek = startOfWeek + 7 * 24 * 60 * 60 * 1000;

    const screeningTime = new Date(screening.date).getTime();

    if (screeningTime < startOfWeek || screeningTime > endOfWeek) {
        throw new Error("The screening's date does not belong in the weekplan.");
    }
}
