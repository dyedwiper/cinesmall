import { getHallplanDtoById } from '../db/hallplan.repo.js';

export async function getHallplanById(id: string) {
    const dto = await getHallplanDtoById(id);

    return dto;
}
