import type { Advertisement } from '../domain/advertisement.js';
import type { Screening } from '../domain/screening.js';
import type { Weekplan } from '../domain/weekplan.js';

export function mapWeekplanToDb(weekplan: Weekplan) {
    const { uuid, startDate } = weekplan.getProps();

    const mapped = {
        uuid: uuid.value,
        startDate: startDate.value.toISOString(),
    };

    return mapped;
}

export function mapScreeningToDb(screening: Screening) {
    const { uuid, weekplanUuid, date, hallNumber, film, duration } = screening.getProps();

    const mapped = {
        uuid: uuid.value,
        weekplanUuid: weekplanUuid.value,
        date: date.toISOString(),
        hallNumber: hallNumber.value,
        film,
        duration: duration.value,
    };

    return mapped;
}

export function mapAdvertisementToDb(advertisement: Advertisement) {
    const { uuid, screeningUuid, name, duration } = advertisement.getProps();

    const mapped = {
        uuid: uuid.value,
        screeningUuid: screeningUuid.value,
        name,
        duration: duration.value,
    };

    return mapped;
}
