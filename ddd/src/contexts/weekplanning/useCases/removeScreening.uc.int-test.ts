import crypto from 'node:crypto';
import { db } from '../../../shared/db/index.js';
import { screenings, weekplans } from '../../../shared/db/schema.js';
import { removeScreening } from './removeScreening.uc.js';

describe('removeScreening', () => {
    test('db is cleared after each test', async () => {
        const screenings = await db.query.screenings.findMany();

        expect(screenings).toHaveLength(0);
    });

    test('removes a screening', async () => {
        const weekplanId = crypto.randomUUID();
        await db.insert(weekplans).values({ id: weekplanId, startDate: '2026-07-16' });
        const screeningId = crypto.randomUUID();
        await db.insert(screenings).values({
            id: screeningId,
            weekplanId,
            date: '2026-07-16',
            hallNumber: 2,
            film: 'Triumph of the Nerds',
            duration: 180,
        });

        await removeScreening(screeningId);

        const result = await db.query.weekplans.findFirst({
            where: { id: weekplanId },
            with: { screenings: true },
        });
        expect(result?.screenings).toHaveLength(0);
    });

    test('db is cleared after each test', async () => {
        const screenings = await db.query.screenings.findMany();

        expect(screenings).toHaveLength(0);
    });
});
