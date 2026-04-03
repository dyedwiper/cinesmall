import { getWeekplan, getWeekplanUuidByScreeningUuid, saveWeekplan } from '../repo/weekplan.repo.js';

export async function removeScreening(uuid: string) {
    const weekplanUuid = await getWeekplanUuidByScreeningUuid(uuid);
    const weekplan = await getWeekplan(weekplanUuid);

    weekplan.removeScreening(uuid);

    await saveWeekplan(weekplan);
}
