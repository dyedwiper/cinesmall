import { relations } from 'drizzle-orm';
import { date, integer, pgTable, varchar } from 'drizzle-orm/pg-core';

export const weekplans = pgTable('weekplans', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    uuid: varchar().notNull(),
    startDate: date({ mode: 'date' }).notNull(),
});

export const weekplansRelations = relations(weekplans, ({ many }) => ({
    screenings: many(screenings),
}));

export const screenings = pgTable('screenings', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    uuid: varchar().notNull(),
    weekplanId: integer('weekplan_id').references(() => weekplans.id),
    date: date({ mode: 'date' }).notNull(),
    film: varchar().notNull(),
});

export const screeningsRelations = relations(screenings, ({ one }) => ({
    weekplan: one(weekplans, {
        fields: [screenings.weekplanId],
        references: [weekplans.id],
    }),
}));
