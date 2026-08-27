import { getWeekplanByStartDate } from "../db/weekplan.repo.js";

export async function getWeekplan(startDate: string) {
	return getWeekplanByStartDate(startDate);
}
