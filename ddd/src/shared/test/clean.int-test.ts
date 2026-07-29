import { db } from '../db/index.js';

test('db is cleared after each test', async () => {
    const screenings = await db.query.screenings.findMany();

    expect(screenings).toHaveLength(0);
});
