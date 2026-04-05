import { Hallplan } from '../domain/hallplan.js';
import { saveHallplan } from '../db/hallplan.repo.js';
import { getScreeningsByWeekplanId } from '../db/screening.repo.js';

export async function createHallplans(weekplanId: string) {
    const screenings = await getScreeningsByWeekplanId(weekplanId);
    const hallplans = screenings.map((screening) =>
        Hallplan.create({ screeningId: screening.id, hallNumber: screening.hallNumber }),
    );

    const promises = hallplans.map((hallplan) => saveHallplan(hallplan));
    await Promise.all(promises);
}
