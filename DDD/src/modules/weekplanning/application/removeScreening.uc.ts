import { getWeekplan, saveWeekplan } from '../repo/weekplan.repo.js';

export async function removeScreening(
    screeningUuid: string,
    weekplanUuid: string,
) {
    const weekplan = await getWeekplan(weekplanUuid);

    weekplan.removeScreening(screeningUuid);

    await saveWeekplan(weekplan);
}
