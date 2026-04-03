import crypto from 'node:crypto';
import { Advertisement } from '../domain/advertisement.js';
import type { AddAdvertisementDto } from './addAdvertisement.dto.js';
import {
    getWeekplan,
    getWeekplanUuidByScreeningUuid,
    saveWeekplan,
} from '../repo/weekplan.repo.js';

export async function addAdvertisement(dto: AddAdvertisementDto) {
    // authorization

    const advertisment = Advertisement.create(dto, crypto.randomUUID());
    const weekplanUuid = await getWeekplanUuidByScreeningUuid(
        dto.screeningUuid,
    );
    const weekplan = await getWeekplan(weekplanUuid);

    weekplan.addAdvertismentToScreening(advertisment, dto.screeningUuid);

    await saveWeekplan(weekplan);
}
