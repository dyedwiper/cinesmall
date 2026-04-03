import { eq } from 'drizzle-orm';
import { db } from '../../../db/index.js';
import { screenings, weekplans } from '../../../db/schema.js';
import { Screening } from '../domain/screening.js';
import { Weekplan } from '../domain/weekplan.js';

export async function getWeekplan(uuid: string) {
    const data = await db.query.weekplans.findFirst({
        where: { uuid },
        with: { screenings: true },
    });

    if (!data) {
        throw new Error('Weekplan not found.');
    }

    // TODO: Write a dedicated mapper
    const screenings = data.screenings.map((item) =>
        Screening.create(
            {
                weekplanUuid: item.weekplanUuid,
                date: item.date,
                hallNumber: item.hallNumber,
                film: item.film,
                duration: item.duration,
            },
            item.uuid,
        ),
    );
    const weekplan = Weekplan.create(
        { startDate: data.startDate, screenings },
        data.uuid,
    );

    return weekplan;
}

export async function saveWeekplan(weekplan: Weekplan) {
    const uuid = weekplan.uuid;
    const props = weekplan.getProps();

    const existing = await db.query.weekplans.findFirst({
        where: { uuid },
        with: { screenings: true },
    });

    if (existing) {
        await removeScreenings(
            existing.screenings.map((s) => s.uuid),
            props.screenings?.map((s) => s.uuid) ?? [],
        );

        await db
            .update(weekplans)
            .set(props)
            .where(eq(weekplans.uuid, weekplan.uuid));
    } else {
        await db.insert(weekplans).values({ ...props, uuid });
    }

    const promises =
        props.screenings?.map((screening) => saveScreening(screening)) ?? [];
    await Promise.all(promises);
}

async function saveScreening(screening: Screening) {
    const uuid = screening.uuid;
    const props = screening.getProps();

    const existing = await db.query.screenings.findFirst({
        where: { uuid },
    });

    if (existing) {
        await db.update(screenings).set(props).where(eq(screenings.uuid, uuid));
    } else {
        await db.insert(screenings).values({ ...props, uuid });
    }
}

async function removeScreenings(
    existingUuids: string[],
    wantedUuids: string[],
) {
    const screeningsToRemove = existingUuids.filter(
        (uuid) => !wantedUuids.includes(uuid),
    );

    const promises = screeningsToRemove.map((uuid) =>
        db.delete(screenings).where(eq(screenings.uuid, uuid)),
    );

    await Promise.all(promises);
}
