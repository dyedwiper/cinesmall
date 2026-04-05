import type { InferSelectModel } from 'drizzle-orm';
import type { advertisements, hallplans, screenings, weekplans } from './schema.js';

export type Weekplan = InferSelectModel<typeof weekplans> & { screenings?: Screening[] };
export type Screening = InferSelectModel<typeof screenings> & { advertisements?: Advertisement[] };
export type Advertisement = InferSelectModel<typeof advertisements>;
export type Hallplan = InferSelectModel<typeof hallplans>;
