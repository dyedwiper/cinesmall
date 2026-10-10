import { eq } from 'drizzle-orm';
import { db } from '../../../shared/db/index.js';
import { hallplans } from '../../../shared/db/schema.js';
import { Hallplan } from '../domain/hallplan.js';
import { mapHallplanToDb, mapHallplanToDto } from './hallplan.mapper.js';
import type { getHallplanDto } from '../useCases/dtos/getHallplan.dto.js';

export async function getHallplanDtoById(id: string): Promise<getHallplanDto> {
    const result = await db.query.hallplans.findFirst({ where: { id }, with: { screening: true } });

    if (!result) throw new Error('Hallplan not found.');

    const dto = mapHallplanToDto(result);

    return dto;
}

export async function getHallplanById(id: string) {
    const result = await db.query.hallplans.findFirst({ where: { id } });

    if (!result) throw new Error('Hallplan not found.');

    // TODO: Is there a better way to assert the type?
    const reservedSeats = result.reservedSeats as string[];
    const hallplan = Hallplan.create({ ...result, reservedSeats });

    return hallplan;
}

export async function saveHallplan(hallplan: Hallplan) {
    const existing = await db.query.hallplans.findFirst({ where: { id: hallplan.id } });

    const mappedHallplan = mapHallplanToDb(hallplan);

    if (existing) {
        await db.update(hallplans).set(mappedHallplan).where(eq(hallplans.id, hallplan.id));
    } else {
        await db.insert(hallplans).values(mappedHallplan);
    }
}
