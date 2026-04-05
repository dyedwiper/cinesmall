import type { Hallplan } from '../domain/hallplan.js';

export function mapHallplanToDb(hallplan: Hallplan) {
    const { id, hall, screeningId, soldSeats } = hallplan.getProps();

    const mapped = {
        id: id.value,
        screeningId: screeningId.value,
        hallNumber: hall.number,
        soldSeats,
    };

    return mapped;
}
