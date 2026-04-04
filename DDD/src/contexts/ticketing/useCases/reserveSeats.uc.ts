import { getHallplanByUuid, saveHallplan } from '../repo/hallplan.repo.js';

export async function reserveSeats(hallplanUuid: string, seats: string[]) {
    const hallplan = await getHallplanByUuid(hallplanUuid);

    seats.forEach((seat) => hallplan.reserveSeat(seat));

    await saveHallplan(hallplan);
}
