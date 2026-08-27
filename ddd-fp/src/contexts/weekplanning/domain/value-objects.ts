import type { Brand } from "../../../shared/domain.js";

// ── Branded Types ──────────────────────────────────────────────

export type WeekplanId = Brand<string, "WeekplanId">;
export type ScreeningId = Brand<string, "ScreeningId">;
export type AdvertisementId = Brand<string, "AdvertisementId">;
export type HallNumber = 1 | 2;
export type Minutes = Brand<number, "Minutes">;

// ── Validation Factories ───────────────────────────────────────

export function createHallNumber(n: number): HallNumber {
	if (n !== 1 && n !== 2) throw new Error("HallNumber must be 1 or 2.");
	return n as HallNumber;
}

export function createMinutes(n: number): Minutes {
	if (n <= 0) throw new Error("Duration must be greater than 0.");
	return n as Minutes;
}

export function createStartDate(input: string): Date {
	const date = new Date(input);
	if (date.getDay() !== 4) throw new Error("The weekplan must start on a Thursday.");
	return date;
}

export function validateFilm(title: string): string {
	if (title === "Johnny Flash") console.log("Excellent taste!");
	else if (title === "Interstellar") throw new Error("Such pretentious crap is unwanted in our cinema.");
	return title;
}
