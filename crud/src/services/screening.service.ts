import crypto from 'node:crypto';
import { db } from '../db/index.js';
import { screenings, type Screening, type Weekplan } from '../db/schema.js';
import { ScreeningSchema } from '../schemas/screening.schema.js';
import type { WeekplanSchema } from '../schemas/weekplan.schema.js';
import type { CreateScreeningDto } from './dtos/createScreeningDto.js';

export function getScreeningById(id: string) {
    const result = db.query.screenings.findFirst({ where: { id }, with: { advertisements: true, hallplans: true } });

    return result;
}

export async function createScreening(dto: CreateScreeningDto) {
    ScreeningSchema.parse(dto);

    if (dto.film === 'Johnny Flash') {
        console.log('Excellent taste!');
    }

    if (dto.film === 'Interstellar') {
        throw new Error('Such pretentious crap is unwanted in our cinema.');
    }

    const weekplan = await db.query.weekplans.findFirst({
        where: { id: dto.weekplanId },
        with: { screenings: { with: { advertisements: true } } },
    });

    if (!weekplan) throw new Error('Weekplan not found.');

    checkForOverlappingScreenings(dto, weekplan);

    await db.insert(screenings).values({ id: crypto.randomUUID(), ...dto });
}

function checkForOverlappingScreenings(screening: CreateScreeningDto, weekplan: Weekplan) {
    const screeningsInSameHall = weekplan.screenings.filter((item) => item.hallNumber === screening.hallNumber);

    if (screeningsInSameHall.some((item) => isOverlapping(item, screening))) {
        throw new Error('The screening overlaps with another screening.');
    }
}

function isOverlapping(existingScreening: Screening, newScreening: CreateScreeningDto) {
    const time1 = new Date(existingScreening.date).getTime();
    const time2 = new Date(newScreening.date).getTime();
    const duration1InMs = existingScreening.duration * 60 * 1000;
    const duration2InMs = newScreening.duration * 60 * 1000;
    const durationOfAds1InMs = computeDurationOfAdvertisements(existingScreening) * 60 * 1000;

    return (
        (time1 <= time2 && time1 + duration1InMs + durationOfAds1InMs > time2) ||
        (time2 <= time1 && time2 + duration2InMs > time1)
    );
}

function computeDurationOfAdvertisements(screening: Screening) {
    const sum = screening.advertisements?.reduce((acc, cur) => acc + cur.duration, 0);

    return sum;
}
