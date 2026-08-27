import { createId } from "../../../shared/domain.js";
import type { Advertisement } from "./advertisement.js";
import { ScreeningDateOutOfRangeError, ScreeningNotFoundError, ScreeningOverlapError } from "./errors.js";
import type { Screening as ScreeningType } from "./screening.js";
import * as Screening from "./screening.js";
import type { WeekplanId } from "./value-objects.js";
import { createStartDate } from "./value-objects.js";

// ── Type ───────────────────────────────────────────────────────

export interface Weekplan {
	readonly id: WeekplanId;
	readonly startDate: Date;
	readonly screenings: readonly ScreeningType[];
}

// ── Factory ────────────────────────────────────────────────────

export function buildWeekplan(params: { id?: string; startDate: string; screenings?: ScreeningType[] }): Weekplan {
	return {
		id: createId<WeekplanId>(params.id),
		startDate: createStartDate(params.startDate),
		screenings: params.screenings ?? [],
	};
}

// ── Aggregate Operations ───────────────────────────────────────

export function addScreening(weekplan: Weekplan, screening: ScreeningType): Weekplan {
	assertDateBelongsToWeekplan(weekplan, screening);
	assertNoOverlap(weekplan.screenings, screening);
	return { ...weekplan, screenings: [...weekplan.screenings, screening] };
}

export function removeScreening(weekplan: Weekplan, screeningId: string): Weekplan {
	return { ...weekplan, screenings: weekplan.screenings.filter((s) => s.id !== screeningId) };
}

export function addAdvertisementToScreening(
	weekplan: Weekplan,
	advertisement: Advertisement,
	screeningId: string
): Weekplan {
	const screening = findScreeningOrThrow(weekplan, screeningId);
	const updated = Screening.addAdvertisement(screening, advertisement);

	assertNoOverlap(othersById(weekplan, screeningId), updated);

	return replaceScreening(weekplan, screeningId, updated);
}

// ── Invariant Checks ───────────────────────────────────────────

function assertDateBelongsToWeekplan(weekplan: Weekplan, screening: ScreeningType) {
	const startOfWeek = weekplan.startDate.getTime();
	const endOfWeek = startOfWeek + 7 * 24 * 60 * 60 * 1000;
	const screeningTime = screening.date.getTime();

	if (screeningTime < startOfWeek || screeningTime > endOfWeek) {
		throw new ScreeningDateOutOfRangeError();
	}
}

function assertNoOverlap(existingScreenings: readonly ScreeningType[], newScreening: ScreeningType) {
	const sameHall = existingScreenings.filter((s) => s.hallNumber === newScreening.hallNumber);

	if (sameHall.some((s) => isOverlapping(s, newScreening))) {
		throw new ScreeningOverlapError();
	}
}

function isOverlapping(a: ScreeningType, b: ScreeningType): boolean {
	if (a.id === b.id) return false;

	const timeA = a.date.getTime();
	const timeB = b.date.getTime();
	const totalA = Screening.totalDuration(a) * 60_000;
	const totalB = Screening.totalDuration(b) * 60_000;

	return (timeA <= timeB && timeA + totalA > timeB) || (timeB <= timeA && timeB + totalB > timeA);
}

// ── Internal Helpers ───────────────────────────────────────────

function findScreeningOrThrow(weekplan: Weekplan, screeningId: string): ScreeningType {
	const screening = weekplan.screenings.find((s) => s.id === screeningId);
	if (!screening) throw new ScreeningNotFoundError();
	return screening;
}

function othersById(weekplan: Weekplan, screeningId: string): readonly ScreeningType[] {
	return weekplan.screenings.filter((s) => s.id !== screeningId);
}

function replaceScreening(weekplan: Weekplan, screeningId: string, updated: ScreeningType): Weekplan {
	return { ...weekplan, screenings: weekplan.screenings.map((s) => (s.id === screeningId ? updated : s)) };
}
