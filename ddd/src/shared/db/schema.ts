import { defineRelations } from 'drizzle-orm';
import { bytea, date, integer, json, snakeCase, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

const id = uuid().primaryKey();

const timestamps = {
    createdAt: timestamp({ mode: 'string', withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ mode: 'string', withTimezone: true })
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date().toISOString()),
};

export const weekplans = snakeCase.table('weekplans', {
    id,
    ...timestamps,
    startDate: date().notNull(),
});

export const screenings = snakeCase.table('screenings', {
    id,
    ...timestamps,
    weekplanId: uuid().notNull(),
    filmId: uuid().notNull(),
    date: timestamp({ mode: 'string', withTimezone: true }).notNull(),
    hallNumber: integer().notNull(),
});

export const films = snakeCase.table('films', {
    id: uuid().primaryKey(),
    ...timestamps,
    title: varchar().notNull(),
    duration: integer().notNull(),
    poster: bytea(),
});

export const advertisements = snakeCase.table('advertisements', {
    id,
    ...timestamps,
    screeningId: uuid().notNull(),
    name: varchar().notNull(),
    duration: integer().notNull(),
});

export const hallplans = snakeCase.table('hallplans', {
    id,
    ...timestamps,
    screeningId: uuid().notNull(),
    hallNumber: integer().notNull(),
    reservedSeats: json(),
});

export const relations = defineRelations({ weekplans, screenings, films, advertisements, hallplans }, (r) => ({
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
        film: r.one.films({
            from: r.screenings.filmId,
            to: r.films.id,
            optional: false,
        }),
        hallplan: r.one.hallplans({
            from: r.screenings.id,
            to: r.hallplans.screeningId,
        }),
    },
    hallplans: {
        screening: r.one.screenings(),
    },
}));

export type SelectWeekplan = typeof weekplans.$inferSelect & { screenings?: SelectScreening[] };
export type InsertWeekplan = typeof weekplans.$inferInsert;

export type SelectScreening = typeof screenings.$inferSelect & { film: SelectFilm } & {
    advertisements?: SelectAdvertisement[];
} & {
    // TODO: Watch issue regarding null and undefined: https://github.com/drizzle-team/drizzle-orm/issues/2745
    hallplan?: SelectHallplan | null;
};
export type InsertScreening = typeof screenings.$inferInsert;

export type SelectFilm = typeof films.$inferSelect;
export type InsertFilm = typeof films.$inferInsert;

export type SelectAdvertisement = typeof advertisements.$inferSelect;
export type InsertAdvertisement = typeof advertisements.$inferInsert;

export type SelectHallplan = typeof hallplans.$inferSelect;
export type InsertHallplan = typeof hallplans.$inferInsert;
