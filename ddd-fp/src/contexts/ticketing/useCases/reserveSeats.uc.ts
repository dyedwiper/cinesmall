import { getHallplanById, saveHallplan } from "../db/hallplan.repo.js";
import * as Hallplan from "../domain/hallplan.js";

export async function reserveSeats(hallplanId: string, seats: string[]) {
	const hallplan = await getHallplanById(hallplanId);

	const updated = seats.reduce((hp, seat) => Hallplan.reserveSeat(hp, seat), hallplan);

	await saveHallplan(updated);
}
