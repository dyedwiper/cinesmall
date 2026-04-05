import { Advertisement } from '../domain/advertisement.js';
import { getWeekplanById, getWeekplanIdByScreeningId, saveWeekplan } from '../db/weekplan.repo.js';
import type { AddAdvertisementDto } from './dtos/addAdvertisement.dto.js';

export async function addAdvertisement(dto: AddAdvertisementDto) {
    // authorization

    const advertisment = Advertisement.create(dto);
    const weekplanId = await getWeekplanIdByScreeningId(dto.screeningId);
    const weekplan = await getWeekplanById(weekplanId);

    weekplan.addAdvertismentToScreening(advertisment, dto.screeningId);

    await saveWeekplan(weekplan);
}
