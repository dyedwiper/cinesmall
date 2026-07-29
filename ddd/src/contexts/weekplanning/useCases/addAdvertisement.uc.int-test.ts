import crypto from 'node:crypto';
import { db } from '../../../shared/db/index.js';
import { screenings, weekplans } from '../../../shared/db/schema.js';
import { addAdvertisement } from './addAdvertisement.uc.js';

describe('addAdvertisement', () => {
    test('db is cleared after each test', async () => {
        const screenings = await db.query.screenings.findMany();

        expect(screenings).toHaveLength(0);
    });

    test('adds an advertisment', async () => {
        const weekplanId = crypto.randomUUID();
        await db.insert(weekplans).values({ id: weekplanId, startDate: '2026-07-16' });
        const screeningId = crypto.randomUUID();
        await db.insert(screenings).values({
            id: screeningId,
            weekplanId,
            date: '2026-07-16',
            hallNumber: 2,
            film: 'Die Siebtelbauern',
            duration: 90,
        });

        const dto = { screeningId, name: 'Glump', duration: 3 };
        await addAdvertisement(dto);

        const result = await db.query.weekplans.findFirst({
            where: { id: weekplanId },
            with: { screenings: { with: { advertisements: true } } },
        });
        expect(result?.screenings[0].advertisements.length).toEqual(1);
    });

    test('db is cleared after each test', async () => {
        const screenings = await db.query.screenings.findMany();

        expect(screenings).toHaveLength(0);
    });
});
