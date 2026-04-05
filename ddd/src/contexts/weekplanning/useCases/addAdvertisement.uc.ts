import { Advertisement } from '../domain/advertisement.js';
import { getWeekplan, getWeekplanUuidByScreeningUuid, saveWeekplan } from '../repo/weekplan.repo.js';
import type { AddAdvertisementDto } from './dtos/addAdvertisement.dto.js';

export async function addAdvertisement(dto: AddAdvertisementDto) {
    // authorization

    const advertisment = Advertisement.create(dto);
    const weekplanUuid = await getWeekplanUuidByScreeningUuid(dto.screeningUuid);
    const weekplan = await getWeekplan(weekplanUuid);

    weekplan.addAdvertismentToScreening(advertisment, dto.screeningUuid);

    await saveWeekplan(weekplan);
}
