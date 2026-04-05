import { db } from '../../../shared/db/index.js';

export async function getScreeningsByWeekplanUuid(weekplanUuid: string) {
    const results = await db.query.screenings.findMany({ where: { weekplanUuid } });

    return results;
}
