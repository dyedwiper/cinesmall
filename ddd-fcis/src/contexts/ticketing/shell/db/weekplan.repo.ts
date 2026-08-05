import { db } from '../../../../shared/shell/db/index.js';

export async function getWeekplanByStartDate(startDate: string) {
    const weekplan = await db.query.weekplans.findFirst({ where: { startDate }, with: { screenings: true } });

    if (!weekplan) throw new Error('Weekplan not found.');

    return weekplan;
}
