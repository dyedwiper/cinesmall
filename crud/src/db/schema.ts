import { defineRelations } from 'drizzle-orm';
import { date, integer, json, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

export const weekplans = pgTable('weekplans', {
    id: varchar().primaryKey().notNull(),
    startDate: date().notNull(),
});

export const screenings = pgTable('screenings', {
    id: varchar().primaryKey().notNull(),
    weekplanId: varchar('weekplan_id').notNull(),
    date: timestamp({ mode: 'string', withTimezone: true }).notNull(),
    hallNumber: integer('hall_number').notNull(),
    film: varchar().notNull(),
    duration: integer().notNull(),
});

export const advertisements = pgTable('advertisements', {
    id: varchar().primaryKey().notNull(),
    screeningId: varchar('screening_id').notNull(),
    name: varchar().notNull(),
    duration: integer().notNull(),
});

export const hallplans = pgTable('hallplans', {
    id: varchar().primaryKey().notNull(),
    screeningId: varchar('screening_id').notNull(),
    hallNumber: integer('hall_number').notNull(),
    soldSeats: json('sold_seats'),
});

export const relations = defineRelations({ weekplans, screenings, advertisements, hallplans }, (r) => ({
    weekplans: {
        screenings: r.many.screenings({
            from: r.weekplans.id,
            to: r.screenings.weekplanId,
        }),
    },
    screenings: {
        advertisements: r.many.advertisements({
            from: r.screenings.id,
            to: r.advertisements.screeningId,
        }),
        hallplans: r.many.hallplans({
            from: r.screenings.id,
            to: r.hallplans.screeningId,
        }),
    },
    hallplans: {
        screening: r.one.screenings(),
    },
}));
