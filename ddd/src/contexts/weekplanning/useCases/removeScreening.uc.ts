import { getWeekplanById, getWeekplanIdByScreeningId, saveWeekplan } from '../db/weekplan.repo.js';

export async function removeScreening(id: string) {
    const weekplanId = await getWeekplanIdByScreeningId(id);
    const weekplan = await getWeekplanById(weekplanId);

    weekplan.removeScreening(id);

    await saveWeekplan(weekplan);
}
