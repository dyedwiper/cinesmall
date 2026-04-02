import { eq } from 'drizzle-orm';
import { db } from '../../../db/index.js';
import { weekplans } from '../../../db/schema.js';
import { Weekplan } from '../domain/weekplan.js';
import type { Screening } from '../domain/screening.js';

export async function getWeekplan(uuid: string) {
    // const data = await db
    //     .select()
    //     .from(weekplans)
    //     .where(eq(weekplans.uuid, uuid));

    const data = await db.query.weekplans.

    const weekplan = Weekplan.create(data[0]);

    return weekplan;
}

export async function insertWeekplan(weekplan: Weekplan) {
    await db.insert(weekplans).values({
        uuid: weekplan.uuid,
        startDate: weekplan.getProps().startDate,
    });
}

export async function saveWeekplan(weekplan: Weekplan) {
    weekplan.
}

function saveScreening(screening: Screening){

}