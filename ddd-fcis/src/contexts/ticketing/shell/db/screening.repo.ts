import { db } from '../../../../shared/shell/db/index.js';

export async function getScreeningsByWeekplanId(weekplanId: string) {
    const results = await db.query.screenings.findMany({ where: { weekplanId } });

    return results;
}
