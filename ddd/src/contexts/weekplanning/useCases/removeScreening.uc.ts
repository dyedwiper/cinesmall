import { getWeekplan, getWeekplanUuidByScreeningUuid, saveWeekplan } from '../db/weekplan.repo.js';

export async function removeScreening(uuid: string) {
    const weekplanUuid = await getWeekplanUuidByScreeningUuid(uuid);
    const weekplan = await getWeekplan(weekplanUuid);

    weekplan.removeScreening(uuid);

    await saveWeekplan(weekplan);
}
