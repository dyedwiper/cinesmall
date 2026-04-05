import type { Advertisement } from '../domain/advertisement.js';
import type { Screening } from '../domain/screening.js';
import type { Weekplan } from '../domain/weekplan.js';

export function mapWeekplanToDb(weekplan: Weekplan) {
    const { id, startDate } = weekplan.getProps();

    const mapped = {
        id: id.value,
        startDate: startDate.value.toISOString(),
    };

    return mapped;
}

export function mapScreeningToDb(screening: Screening) {
    const { id, weekplanId, date, hallNumber, film, duration } = screening.getProps();

    const mapped = {
        id: id.value,
        weekplanId: weekplanId.value,
        date: date.toISOString(),
        hallNumber: hallNumber.value,
        film: film.title,
        duration: duration.value,
    };

    return mapped;
}

export function mapAdvertisementToDb(advertisement: Advertisement) {
    const { id, screeningId, name, duration } = advertisement.getProps();

    const mapped = {
        id: id.value,
        screeningId: screeningId.value,
        name,
        duration: duration.value,
    };

    return mapped;
}
