import { hallplans, screenings, type SelectScreening, type SelectWeekplan } from '../../../shared/db/schema.js';
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
        hallplanId: screening.hallplan?.id,
    };

    return mapped;
}
