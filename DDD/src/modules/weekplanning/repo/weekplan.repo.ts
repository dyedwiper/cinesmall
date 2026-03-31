import { eq } from 'drizzle-orm';
import { db } from '../../../db/index.js';
import { weekplans } from '../../../db/schema.js';
import { Weekplan } from '../domain/weekplan.js';

export async function getWeekplan(uuid: string) {
    const data = await db
        .select()
        .from(weekplans)
        .where(eq(weekplans.uuid, uuid));

    const weekplan = Weekplan.create(data[0]);

    return weekplan;
}

export async function insertWeekplan(weekplan: Weekplan) {
    await db.insert(weekplans).values({
        uuid: weekplan.uuid,
        startDate: weekplan.getProps().startDate,
    });
}

export async function updateWeekplan(weekplan: Weekplan) {}
