import {
    type InsertAdvertisement,
    type InsertScreening,
    type InsertWeekplan,
    type SelectAdvertisement,
    type SelectScreening,
    type SelectWeekplan,
} from '../../../shared/db/schema.js';
import type { Advertisement } from '../domain/advertisement.js';
import type { Screening } from '../domain/screening.js';
import type { Weekplan } from '../domain/weekplan.js';
import type { GetWeekplanDto } from '../useCases/dtos/getWeekplan.dto.js';

export function mapWeekplanToDto(weekplan: SelectWeekplan): GetWeekplanDto {
    const mapped = {
        id: weekplan.id,
        startDate: weekplan.startDate,
        screenings: weekplan.screenings?.map((screening) => mapScreeningToDto(screening)) ?? [],
    };

    return mapped;
}

function mapScreeningToDto(screening: SelectScreening) {
    const mapped = {
        id: screening.id,
        date: screening.date,
        hallNumber: screening.hallNumber,
        film: screening.film,
        duration: screening.duration,
        advertisements: screening.advertisements?.map((ad) => mapAdvertisementToDto(ad)) ?? [],
    };

    return mapped;
}

function mapAdvertisementToDto(advertisement: SelectAdvertisement) {
    const mapped = {
        id: advertisement.id,
        name: advertisement.name,
        duration: advertisement.duration,
    };

    return mapped;
}

export function mapWeekplanToDb(weekplan: Weekplan): InsertWeekplan {
    const { id, startDate } = weekplan.getProps();

    const mapped = {
        id: id.value,
        startDate: startDate.value.toISOString(),
    };

    return mapped;
}

export function mapScreeningToDb(screening: Screening): InsertScreening {
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

export function mapAdvertisementToDb(advertisement: Advertisement): InsertAdvertisement {
    const { id, screeningId, name, duration } = advertisement.getProps();

    const mapped = {
        id: id.value,
        screeningId: screeningId.value,
        name,
        duration: duration.value,
    };

    return mapped;
}
