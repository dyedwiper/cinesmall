import { db } from "../../../shared/db/index.js";
import { hallplans } from "../../../shared/db/schema.js";
import type { Hallplan } from "../domain/hallplan.js";
import type { HallplanId } from "../domain/value-objects.js";
import { createHall } from "../domain/value-objects.js";

export async function getHallplanDtoById(id: string) {
	const result = await db.query.hallplans.findFirst({ where: { id }, with: { screening: true } });
	if (!result) throw new Error("Hallplan not found.");
	return result;
}

export async function getHallplanById(id: string): Promise<Hallplan> {
	const result = await db.query.hallplans.findFirst({ where: { id } });
	if (!result) throw new Error("Hallplan not found.");

	// ponytail: reconstitute without re-validation — data from our own DB is trusted
	return {
		id: result.id as HallplanId,
		screeningId: result.screeningId,
		hall: createHall(result.hallNumber),
		reservedSeats: (result.reservedSeats as string[]) ?? [],
	};
}

export async function saveHallplan(hallplan: Hallplan) {
	const data = {
		id: hallplan.id,
		screeningId: hallplan.screeningId,
		hallNumber: hallplan.hall.number,
		reservedSeats: hallplan.reservedSeats as string[],
	};

	await db.insert(hallplans).values(data).onConflictDoUpdate({ target: hallplans.id, set: data });
}
