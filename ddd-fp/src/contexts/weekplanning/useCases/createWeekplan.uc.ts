import { existsWeekplanForStartDate, saveWeekplan } from "../db/weekplan.repo.js";
import { buildWeekplan } from "../domain/weekplan.js";
import type { CreateWeekplanDto } from "./dtos/createWeekplan.dto.js";

export async function createWeekplan(dto: CreateWeekplanDto) {
	if (await existsWeekplanForStartDate(dto.startDate)) {
		throw new Error("Weekplan for this start date already exists.");
	}

	const weekplan = buildWeekplan(dto);

	await saveWeekplan(weekplan);
}
