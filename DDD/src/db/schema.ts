import { defineRelations } from 'drizzle-orm';
import {
    date,
    integer,
    pgTable,
    timestamp,
    varchar,
} from 'drizzle-orm/pg-core';

export const weekplans = pgTable('weekplans', {
    uuid: varchar().primaryKey().notNull(),
    startDate: date({ mode: 'date' }).notNull(),
});

export const screenings = pgTable('screenings', {
    uuid: varchar().primaryKey().notNull(),
    weekplanUuid: varchar('weekplan_uuid').notNull(),
    date: timestamp({ mode: 'date', withTimezone: true }).notNull(),
    hallNumber: integer('hall_number').notNull(),
    film: varchar().notNull(),
    duration: integer().notNull(),
});

export const relations = defineRelations({ weekplans, screenings }, (r) => ({
    weekplans: {
        screenings: r.many.screenings({
            from: r.weekplans.uuid,
            to: r.screenings.weekplanUuid,
        }),
    },
}));
