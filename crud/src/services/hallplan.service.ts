import crypto from 'node:crypto';
import { db } from '../db/index.js';
import type { Screening } from '../db/types.js';
import { hallplans } from '../db/schema.js';

export async function createHallplans(weekplanId: string) {
    const weekplan = await db.query.weekplans.findFirst({ where: { id: weekplanId }, with: { screenings: true } });

    if (!weekplan) throw new Error('Weekplan not found.');

    const promises = weekplan.screenings.map((screening) => createHallplan(screening));
    await Promise.all(promises);
}

async function createHallplan(screening: Screening) {
    const hallplan = {
        id: crypto.randomUUID().toString(),
        screeningId: screening.id,
        hallNumber: screening.hallNumber,
        reservedSeats: [],
    };

    await db.insert(hallplans).values(hallplan);
}
