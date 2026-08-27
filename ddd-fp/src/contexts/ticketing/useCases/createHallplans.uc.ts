import { saveHallplan } from "../db/hallplan.repo.js";
import { getScreeningsByWeekplanId } from "../db/screening.repo.js";
import { buildHallplan } from "../domain/hallplan.js";

export async function createHallplans(weekplanId: string) {
	const screenings = await getScreeningsByWeekplanId(weekplanId);

	const hallplans = screenings.map((s) => buildHallplan({ screeningId: s.id, hallNumber: s.hallNumber }));

	await Promise.all(hallplans.map(saveHallplan));
}
