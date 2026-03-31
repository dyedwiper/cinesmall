import { date, integer, pgTable, varchar } from 'drizzle-orm/pg-core';

export const weekplans = pgTable('weekplans', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    uuid: varchar().notNull(),
    startDate: date({ mode: 'date' }).notNull(),
});
