import { eq } from 'drizzle-orm';
import { db } from '../../../shared/db/index.js';
import { hallplans } from '../../../shared/db/schema.js';
import { Hallplan } from '../domain/hallplan.js';
import { mapHallplanToDb } from './hallplan.mapper.js';

export async function getHallplanDtoByUuid(uuid: string) {
    const result = await db.query.hallplans.findFirst({ where: { uuid }, with: { screening: true } });

    if (!result) throw new Error('Hallplan not found.');

    return result;
}

export async function getHallplanByUuid(uuid: string) {
    const result = await db.query.hallplans.findFirst({ where: { uuid } });

    if (!result) throw new Error('Hallplan not found.');

    // TODO: Is there a better way to assert the type?
    const soldSeats = result.soldSeats as string[];
    const hallplan = Hallplan.create({ ...result, soldSeats });

    return hallplan;
}

export async function saveHallplan(hallplan: Hallplan) {
    const existing = await db.query.hallplans.findFirst({ where: { uuid: hallplan.uuid } });

    const mappedHallplan = mapHallplanToDb(hallplan);

    if (existing) {
        await db.update(hallplans).set(mappedHallplan).where(eq(hallplans.uuid, hallplan.uuid));
    } else {
        await db.insert(hallplans).values(mappedHallplan);
    }
}
