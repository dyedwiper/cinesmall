import { getHallplanById, saveHallplan } from '../db/hallplan.repo.js';

export async function reserveSeats(hallplanId: string, seats: string[]) {
    const hallplan = await getHallplanById(hallplanId);

    seats.forEach((seat) => hallplan.reserveSeat(seat));

    await saveHallplan(hallplan);
}
