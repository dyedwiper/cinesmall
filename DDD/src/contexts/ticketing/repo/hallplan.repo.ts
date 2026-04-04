import { db } from '../../../shared/db/index.js';
import { hallplans } from '../../../shared/db/schema.js';
import type { Hallplan } from '../domain/hallplan.js';
import { mapHallplanToDb } from './hallplan.mapper.js';

export async function saveHallplan(hallplan: Hallplan) {
    const existing = await db.query.hallplans.findFirst({ where: { uuid: hallplan.uuid }, with: { screenings: true } });

    const mappedHallplan = mapHallplanToDb(hallplan);

    if (existing) {
        await db.update(hallplans).set(mappedHallplan);
    } else {
        await db.insert(hallplans).values(mappedHallplan);
    }
}
