import { eq } from 'drizzle-orm';
import { db } from '../../../shared/db/index.js';
import { advertisements, screenings, weekplans } from '../../../shared/db/schema.js';
import { Advertisement } from '../domain/advertisement.js';
import { Screening } from '../domain/screening.js';
import { Weekplan } from '../domain/weekplan.js';
import { mapAdvertisementToDb, mapScreeningToDb, mapWeekplanToDb } from './weekplan.mapper.js';

export async function getWeekplanById(id: string) {
    const data = await db.query.weekplans.findFirst({
        where: { id },
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

export async function getWeekplanIdByScreeningId(screeningId: string) {
    const screeningData = await db.query.screenings.findFirst({
        where: { id: screeningId },
    });

    if (!screeningData) throw new Error('Screening not found.');

    return screeningData.weekplanId;
}

export async function saveWeekplan(weekplan: Weekplan) {
    const id = weekplan.id;
    const { screenings } = weekplan.getProps();

    const existing = await db.query.weekplans.findFirst({
        where: { id },
        with: { screenings: true },
    });

    const mappedWeekplan = mapWeekplanToDb(weekplan);

    if (existing) {
        await removeScreenings(
            existing.screenings.map((s) => s.id),
            screenings.map((s) => s.id),
        );

        await db.update(weekplans).set(mappedWeekplan).where(eq(weekplans.id, weekplan.id));
    } else {
        await db.insert(weekplans).values(mappedWeekplan);
    }

    const promises = screenings.map((screening) => saveScreening(screening));
    await Promise.all(promises);
}

async function saveScreening(screening: Screening) {
    const id = screening.id;

    const existing = await db.query.screenings.findFirst({
        where: { id },
    });

    const mappedScreening = mapScreeningToDb(screening);

    if (existing) {
        await db.update(screenings).set(mappedScreening).where(eq(screenings.id, id));
    } else {
        await db.insert(screenings).values(mappedScreening);
    }

    const props = screening.getProps();
    const promises = props.advertisements.map((ad) => saveAdvertisment(ad));
    await Promise.all(promises);
}

async function saveAdvertisment(advertisement: Advertisement) {
    const id = advertisement.id;

    const existing = await db.query.advertisements.findFirst({
        where: { id },
    });

    const mappedAdvertisment = mapAdvertisementToDb(advertisement);

    if (existing) {
        await db.update(advertisements).set(mappedAdvertisment).where(eq(advertisements.id, id));
    } else {
        await db.insert(advertisements).values(mappedAdvertisment);
    }
}

async function removeScreenings(existingIds: string[], wantedIds: string[]) {
    const screeningsToRemove = existingIds.filter((id) => !wantedIds.includes(id));

    const promises = screeningsToRemove.map((id) => db.delete(screenings).where(eq(screenings.id, id)));

    await Promise.all(promises);
}
