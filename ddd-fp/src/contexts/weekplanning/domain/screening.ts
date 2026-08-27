import { createId } from "../../../shared/domain.js";
import type { Advertisement } from "./advertisement.js";
import { MaxAdvertisementsExceededError } from "./errors.js";
import type { HallNumber, Minutes, ScreeningId, WeekplanId } from "./value-objects.js";
import { createHallNumber, createMinutes, validateFilm } from "./value-objects.js";

// ── Type ───────────────────────────────────────────────────────

export interface Screening {
	readonly id: ScreeningId;
	readonly weekplanId: WeekplanId;
	readonly date: Date;
	readonly hallNumber: HallNumber;
	readonly film: string;
	readonly duration: Minutes;
	readonly advertisements: readonly Advertisement[];
}

// ── Factory ────────────────────────────────────────────────────

export function buildScreening(params: {
	id?: string;
	weekplanId: string;
	date: string;
	hallNumber: number;
	film: string;
	duration: number;
	advertisements?: Advertisement[];
}): Screening {
	return {
		id: createId<ScreeningId>(params.id),
		weekplanId: createId<WeekplanId>(params.weekplanId),
		date: new Date(params.date),
		hallNumber: createHallNumber(params.hallNumber),
		film: validateFilm(params.film),
		duration: createMinutes(params.duration),
		advertisements: params.advertisements ?? [],
	};
}

// ── Entity Operations ──────────────────────────────────────────

export function addAdvertisement(screening: Screening, advertisement: Advertisement): Screening {
	if (screening.advertisements.length >= 3) {
		throw new MaxAdvertisementsExceededError();
	}
	return {
		...screening,
		advertisements: [...screening.advertisements, advertisement],
	};
}

export function totalDuration(screening: Screening): number {
	return screening.duration + screening.advertisements.reduce((sum, ad) => sum + ad.duration, 0);
}
