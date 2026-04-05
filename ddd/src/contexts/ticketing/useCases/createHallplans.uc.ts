import { Hallplan } from '../domain/hallplan.js';
import { saveHallplan } from '../db/hallplan.repo.js';
import { getScreeningsByWeekplanUuid } from '../db/screening.repo.js';

export async function createHallplans(weekplanUuid: string) {
    const screenings = await getScreeningsByWeekplanUuid(weekplanUuid);
    const hallplans = screenings.map((screening) =>
        Hallplan.create({ screeningUuid: screening.uuid, hallNumber: screening.hallNumber }),
    );

    const promises = hallplans.map((hallplan) => saveHallplan(hallplan));
    await Promise.all(promises);
}
