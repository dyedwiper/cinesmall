import { defineRelations } from 'drizzle-orm';
import { date, pgTable, varchar } from 'drizzle-orm/pg-core';

export const weekplans = pgTable('weekplans', {
    uuid: varchar().primaryKey().notNull(),
    startDate: date({ mode: 'date' }).notNull(),
});

export const screenings = pgTable('screenings', {
    uuid: varchar().primaryKey().notNull(),
    weekplanUuid: varchar('weekplan_uuid').notNull(),
    date: date({ mode: 'date' }).notNull(),
    film: varchar().notNull(),
});

export const relations = defineRelations({ weekplans, screenings }, (r) => ({
    weekplans: {
        screenings: r.many.screenings({
            from: r.weekplans.uuid,
            to: r.screenings.weekplanUuid,
        }),
    },
}));
