import test, { describe } from 'node:test';
import { Screening } from './screening.js';
import { Weekplan } from './weekplan.js';
import assert from 'node:assert';

describe('addScreening', () => {
    test('adds a screening', () => {
        const weekplan = Weekplan.create({ startDate: '2026-07-16' });
        const screening = Screening.create({
            weekplanId: weekplan.id,
            date: '2026-07-17',
            hallNumber: 1,
            film: 'La Rupture',
            duration: 90,
        });

        weekplan.addScreening(screening);

        assert.strictEqual(weekplan.getProps().screenings.length, 1);
    });

    test('throws an error if screening date does not belong to weekplan', () => {
        const weekplan = Weekplan.create({ startDate: '2026-07-16' });
        const screening = Screening.create({
            weekplanId: weekplan.id,
            date: '2026-08-17',
            hallNumber: 1,
            film: 'La Rupture',
            duration: 90,
        });

        assert.throws(() => weekplan.addScreening(screening));
    });
});
