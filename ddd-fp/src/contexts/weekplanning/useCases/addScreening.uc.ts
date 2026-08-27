import { getWeekplanById, saveWeekplan } from "../db/weekplan.repo.js";
import { buildScreening } from "../domain/screening.js";
import * as Weekplan from "../domain/weekplan.js";
import type { AddScreeningDto } from "./dtos/addScreening.dto.js";

export async function addScreening(dto: AddScreeningDto) {
	const screening = buildScreening(dto);
	const weekplan = await getWeekplanById(dto.weekplanId);

	const updated = Weekplan.addScreening(weekplan, screening);

	await saveWeekplan(updated);
}
