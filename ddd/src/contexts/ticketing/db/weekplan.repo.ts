import { db } from '../../../shared/db/index.js';
import { mapWeekplanToDto } from './weekplan.mapper.js';

export async function getWeekplanByStartDate(startDate: string) {
    const weekplan = await db.query.weekplans.findFirst({
        where: { startDate },
        with: { screenings: { with: { hallplan: true } } },
    });

    if (!weekplan) throw new Error('Weekplan not found.');

    const dto = mapWeekplanToDto(weekplan);

    return dto;
}
