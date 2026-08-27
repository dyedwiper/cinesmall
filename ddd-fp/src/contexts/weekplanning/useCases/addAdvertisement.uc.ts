import { getWeekplanById, getWeekplanIdByScreeningId, saveWeekplan } from "../db/weekplan.repo.js";
import { buildAdvertisement } from "../domain/advertisement.js";
import * as Weekplan from "../domain/weekplan.js";
import type { AddAdvertisementDto } from "./dtos/addAdvertisement.dto.js";

export async function addAdvertisement(dto: AddAdvertisementDto) {
	const advertisement = buildAdvertisement(dto);
	const weekplanId = await getWeekplanIdByScreeningId(dto.screeningId);
	const weekplan = await getWeekplanById(weekplanId);

	const updated = Weekplan.addAdvertisementToScreening(weekplan, advertisement, dto.screeningId);

	await saveWeekplan(updated);
}
