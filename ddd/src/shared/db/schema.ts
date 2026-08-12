import { defineRelations } from 'drizzle-orm';
import { date, integer, json, snakeCase, timestamp, varchar } from 'drizzle-orm/pg-core';

const timestamps = {
    createdAt: timestamp({ mode: 'string', withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ mode: 'string', withTimezone: true })
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date().toISOString()),
};

export const weekplans = snakeCase.table('weekplans', {
    id: varchar().primaryKey().notNull(),
    ...timestamps,
    startDate: date().notNull(),
});

export const screenings = snakeCase.table('screenings', {
    id: varchar().primaryKey().notNull(),
    ...timestamps,
    weekplanId: varchar().notNull(),
    date: timestamp({ mode: 'string', withTimezone: true }).notNull(),
    hallNumber: integer().notNull(),
    film: varchar().notNull(),
    duration: integer().notNull(),
});

export const advertisements = snakeCase.table('advertisements', {
    id: varchar().primaryKey().notNull(),
    ...timestamps,
    screeningId: varchar().notNull(),
    name: varchar().notNull(),
    duration: integer().notNull(),
});

export const hallplans = snakeCase.table('hallplans', {
    id: varchar().primaryKey().notNull(),
    ...timestamps,
    screeningId: varchar().notNull(),
    hallNumber: integer().notNull(),
    reservedSeats: json(),
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
