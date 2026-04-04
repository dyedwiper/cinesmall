import type { Hallplan } from '../domain/hallplan.js';

export function mapHallplanToDb(hallplan: Hallplan) {
    const { uuid, hall, screeningUuid, soldSeats } = hallplan.getProps();

    const mapped = {
        uuid: uuid.value,
        screeningUuid: screeningUuid.value,
        hallNumber: hall.number,
        soldSeats,
    };

    return mapped;
}
