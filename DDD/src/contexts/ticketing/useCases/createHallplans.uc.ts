import { Hallplan } from '../domain/hallplan.js';
import { saveHallplan } from '../repo/hallplan.repo.js';
import { getScreeningsByWeekplanUuid } from '../repo/screening.repo.js';

export async function createHallplans(weekplanUuid: string) {
    const screenings = await getScreeningsByWeekplanUuid(weekplanUuid);
    const hallplans = screenings.map((screening) => Hallplan.create({ screening }));

    const promises = hallplans.map((hallplan) => saveHallplan(hallplan));
    await Promise.all(promises);
}
