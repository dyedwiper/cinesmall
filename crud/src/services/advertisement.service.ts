import crypto from 'node:crypto';
import { db } from '../db/index.js';
import { advertisements } from '../db/schema.js';
import { AdvertisementSchema } from '../validation/advertisement.schema.js';
import type { CreateAdvertisementDto } from './dtos/createAdvertisement.dto.js';
import { checkForOverlappingScreenings } from '../validation/screening-overlap-check.js';

export async function createAdvertisment(dto: CreateAdvertisementDto) {
    AdvertisementSchema.parse(dto);

    const screening = await db.query.screenings.findFirst({
        where: { id: dto.screeningId },
        with: { advertisements: true },
    });

    if (!screening) throw new Error('Screening not found.');

    const weekplan = await db.query.weekplans.findFirst({
        where: { id: screening.weekplanId },
        with: { screenings: { with: { advertisements: true } } },
    });

    if (!weekplan) throw new Error('Weekplan not found.');

    const advertisement = { id: crypto.randomUUID(), ...dto };
    screening.advertisements.push(advertisement);

    checkForOverlappingScreenings(screening, weekplan);

    await db.insert(advertisements).values(advertisement);
}
