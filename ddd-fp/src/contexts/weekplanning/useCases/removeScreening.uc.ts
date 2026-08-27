import { getWeekplanById, getWeekplanIdByScreeningId, saveWeekplan } from "../db/weekplan.repo.js";
import * as Weekplan from "../domain/weekplan.js";

export async function removeScreening(id: string) {
	const weekplanId = await getWeekplanIdByScreeningId(id);
	const weekplan = await getWeekplanById(weekplanId);

	const updated = Weekplan.removeScreening(weekplan, id);

	await saveWeekplan(updated);
}
