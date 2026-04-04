import { db } from '../../../shared/db/index.js';
import { Screening } from '../domain/screening.js';

export async function getScreeningsByWeekplanUuid(weekplanUuid: string) {
    const results = await db.query.screenings.findMany({ where: { weekplanUuid } });
    const screenings = results.map((item) => Screening.create(item));

    return screenings;
}
