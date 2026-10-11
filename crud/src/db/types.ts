import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type { advertisements, hallplans, screenings, weekplans } from './schema.js';

export type SelectWeekplan = InferSelectModel<typeof weekplans> & { screenings?: SelectScreening[] };
export type InsertWeekplan = InferInsertModel<typeof weekplans>;
export type SelectScreening = InferSelectModel<typeof screenings> & { advertisements?: SelectAdvertisement[] };
export type InsertScreening = InferInsertModel<typeof screenings>;
export type SelectAdvertisement = InferSelectModel<typeof advertisements>;
export type InsertAdvertisement = InferInsertModel<typeof advertisements>;
export type SelectHallplan = InferSelectModel<typeof hallplans>;
export type InsertHallplan = InferInsertModel<typeof hallplans>;
