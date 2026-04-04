import { eq } from 'drizzle-orm';
import { db } from '../../../shared/db/index.js';
import { advertisements, screenings, weekplans } from '../../../shared/db/schema.js';
import { Advertisement } from '../domain/advertisement.js';
import { Screening } from '../domain/screening.js';
import { Weekplan } from '../domain/weekplan.js';
import { mapAdvertisementToDb, mapScreeningToDb, mapWeekplanToDb } from './weekplan.mapper.js';

export async function getWeekplan(uuid: string) {
    const data = await db.query.weekplans.findFirst({
        where: { uuid },
        with: { screenings: { with: { advertisements: true } } },
    });

    if (!data) {
        throw new Error('Weekplan not found.');
    }

    // TODO: Write a dedicated mapper, but how to type?
    const screenings = data.screenings.map((sc) => {
        const advertisements = sc.advertisements.map((ad) => Advertisement.create(ad));

        return Screening.create({ ...sc, advertisements });
    });
    const weekplan = Weekplan.create({ startDate: data.startDate, screenings });

    return weekplan;
}

export async function getWeekplanUuidByScreeningUuid(screeningUuid: string) {
    const screeningData = await db.query.screenings.findFirst({
        where: { uuid: screeningUuid },
    });

    if (!screeningData) throw new Error('Screening not found.');

    return screeningData.weekplanUuid;
}

export async function saveWeekplan(weekplan: Weekplan) {
    const uuid = weekplan.uuid;
    const { screenings } = weekplan.getProps();

    const existing = await db.query.weekplans.findFirst({
        where: { uuid },
        with: { screenings: true },
    });

    const mappedWeekplan = mapWeekplanToDb(weekplan);

    if (existing) {
        await removeScreenings(
            existing.screenings.map((s) => s.uuid),
            screenings.map((s) => s.uuid),
        );

        await db.update(weekplans).set(mappedWeekplan).where(eq(weekplans.uuid, weekplan.uuid));
    } else {
        await db.insert(weekplans).values(mappedWeekplan);
    }

    const promises = screenings.map((screening) => saveScreening(screening));
    await Promise.all(promises);
}

async function saveScreening(screening: Screening) {
    const uuid = screening.uuid;

    const existing = await db.query.screenings.findFirst({
        where: { uuid },
    });

    const mappedScreening = mapScreeningToDb(screening);

    if (existing) {
        await db.update(screenings).set(mappedScreening).where(eq(screenings.uuid, uuid));
    } else {
        await db.insert(screenings).values(mappedScreening);
    }

    const props = screening.getProps();
    const promises = props.advertisements.map((ad) => saveAdvertisment(ad));
    await Promise.all(promises);
}

async function saveAdvertisment(advertisement: Advertisement) {
    const uuid = advertisement.uuid;

    const existing = await db.query.advertisements.findFirst({
        where: { uuid },
    });

    const mappedAdvertisment = mapAdvertisementToDb(advertisement);

    if (existing) {
        await db.update(advertisements).set(mappedAdvertisment).where(eq(advertisements.uuid, uuid));
    } else {
        await db.insert(advertisements).values(mappedAdvertisment);
    }
}

async function removeScreenings(existingUuids: string[], wantedUuids: string[]) {
    const screeningsToRemove = existingUuids.filter((uuid) => !wantedUuids.includes(uuid));

    const promises = screeningsToRemove.map((uuid) => db.delete(screenings).where(eq(screenings.uuid, uuid)));

    await Promise.all(promises);
}
