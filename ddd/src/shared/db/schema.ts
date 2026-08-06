import { defineRelations } from 'drizzle-orm';
import { date, integer, json, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

const timestamps = {
    createdAt: timestamp('created_at', { mode: 'string', withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string', withTimezone: true })
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date().toISOString()),
};

export const weekplans = pgTable('weekplans', {
    id: varchar().primaryKey().notNull(),
    ...timestamps,
    startDate: date().notNull(),
});

export const screenings = pgTable('screenings', {
    id: varchar().primaryKey().notNull(),
    ...timestamps,
    weekplanId: varchar('weekplan_id').notNull(),
    date: timestamp({ mode: 'string', withTimezone: true }).notNull(),
    hallNumber: integer('hall_number').notNull(),
    film: varchar().notNull(),
    duration: integer().notNull(),
});

export const advertisements = pgTable('advertisements', {
    id: varchar().primaryKey().notNull(),
    ...timestamps,
    screeningId: varchar('screening_id').notNull(),
    name: varchar().notNull(),
    duration: integer().notNull(),
});

export const hallplans = pgTable('hallplans', {
    id: varchar().primaryKey().notNull(),
    ...timestamps,
    screeningId: varchar('screening_id').notNull(),
    hallNumber: integer('hall_number').notNull(),
    reservedSeats: json('reserved_seats'),
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
