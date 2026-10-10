import { getWeekplanDtoByStartDate } from '../db/weekplan.repo.js';

export async function getWeekplanByStartDate(startDate: string) {
    const dto = await getWeekplanDtoByStartDate(startDate);

    return dto;
}
