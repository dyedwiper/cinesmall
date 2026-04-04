import { getWeekplanByStartDate } from '../repo/weekplan.repo.js';

export async function getWeekplan(startDate: string) {
    const dto = await getWeekplanByStartDate(startDate);

    return dto;
}
