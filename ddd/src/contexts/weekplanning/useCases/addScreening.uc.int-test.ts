import crypto from 'node:crypto';
import { db } from '../../../shared/db/index.js';
import { weekplans } from '../../../shared/db/schema.js';
import { addScreening } from './addScreening.uc.js';

describe('addScreening', () => {
    test('db is cleared after each test', async () => {
        const screenings = await db.query.screenings.findMany();

        expect(screenings).toHaveLength(0);
    });

    test('adds a screening', async () => {
        const weekplanId = crypto.randomUUID();
        await db.insert(weekplans).values({ id: weekplanId, startDate: '2026-07-16' });

        const dto = {
            weekplanId: weekplanId,
            date: '2026-07-17',
            hallNumber: 1,
            film: 'Xaver - Mein außerirdischer Freund',
            duration: 90,
        };
        await addScreening(dto);

        const result = await db.query.weekplans.findFirst({
            where: { id: weekplanId },
            with: { screenings: true },
        });
        expect(result?.screenings).toHaveLength(1);
    });

    test('db is cleared after each test', async () => {
        const screenings = await db.query.screenings.findMany();

        expect(screenings).toHaveLength(0);
    });
});
