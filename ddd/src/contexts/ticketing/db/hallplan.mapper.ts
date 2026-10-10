import type { SelectHallplan } from '../../../shared/db/schema.js';
import type { Hallplan } from '../domain/hallplan.js';

export function mapHallplanToDto(hallplan: SelectHallplan) {
    const mapped = {
        id: hallplan.id,
        screeningId: hallplan.screeningId,
        hallNumber: hallplan.hallNumber,
        reservedSeats: hallplan.reservedSeats as string[],
    };

    return mapped;
}

export function mapHallplanToDb(hallplan: Hallplan) {
    const { id, hall, screeningId, reservedSeats } = hallplan.getProps();

    const mapped = {
        id: id.value,
        screeningId: screeningId.value,
        hallNumber: hall.number,
        reservedSeats,
    };

    return mapped;
}
