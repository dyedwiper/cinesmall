import { date, integer, pgTable, varchar } from 'drizzle-orm/pg-core';

export const weekplanTable = pgTable('weekplans', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    startDate: date({ mode: 'date' }).notNull(),
});
