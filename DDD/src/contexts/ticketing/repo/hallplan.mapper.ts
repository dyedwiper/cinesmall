import type { Hallplan } from '../domain/hallplan.js';

export function mapHallplanToDb(hallplan: Hallplan) {
    const { uuid, hall, screening, soldSeats } = hallplan.getProps();

    const mapped = {
        uuid: uuid.value,
        hallNumber: hall.number,
        screeningUuid: screening.uuid,
        soldSeats,
    };

    return mapped;
}
