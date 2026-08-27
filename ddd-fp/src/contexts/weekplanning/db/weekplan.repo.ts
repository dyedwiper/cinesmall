import { db } from "../../../shared/db/index.js";
import { advertisements, screenings, weekplans } from "../../../shared/db/schema.js";
import type { Advertisement } from "../domain/advertisement.js";
import type { Screening } from "../domain/screening.js";
import type { AdvertisementId, HallNumber, Minutes, ScreeningId, WeekplanId } from "../domain/value-objects.js";
import type { Weekplan } from "../domain/weekplan.js";
import { eq } from "drizzle-orm";

// ── Queries ────────────────────────────────────────────────────

export async function getWeekplanDtoByStartDate(startDate: string) {
	const result = await db.query.weekplans.findFirst({
		where: { startDate },
		with: { screenings: { with: { advertisements: true } } },
	});

	return result;
}

export async function getWeekplanById(id: string): Promise<Weekplan> {
	const result = await db.query.weekplans.findFirst({
		where: { id },
		with: { screenings: { with: { advertisements: true } } },
	});

	if (!result) throw new Error("Weekplan not found.");

	// ponytail: reconstitution is plain mapping — no re-validation of already-valid DB data
	return toWeekplan(result);
}

export async function existsWeekplanForStartDate(startDate: string) {
	const result = await db.query.weekplans.findFirst({ where: { startDate } });
	return !!result;
}

export async function getWeekplanIdByScreeningId(screeningId: string) {
	const row = await db.query.screenings.findFirst({ where: { id: screeningId } });
	if (!row) throw new Error("Screening not found.");
	return row.weekplanId;
}

// ── Persistence ────────────────────────────────────────────────

export async function saveWeekplan(weekplan: Weekplan) {
	// ponytail: existence query still needed to diff deleted screenings
	const existing = await db.query.weekplans.findFirst({
		where: { id: weekplan.id as string },
		with: { screenings: true },
	});

	const data = { id: weekplan.id, startDate: weekplan.startDate.toISOString() };

	if (existing) {
		await removeDeletedScreenings(
			existing.screenings.map((s) => s.id),
			weekplan.screenings.map((s) => s.id as string)
		);
	}

	await db.insert(weekplans).values(data).onConflictDoUpdate({ target: weekplans.id, set: data });
	await Promise.all(weekplan.screenings.map(saveScreening));
}

async function saveScreening(screening: Screening) {
	const data = {
		id: screening.id,
		weekplanId: screening.weekplanId,
		date: screening.date.toISOString(),
		hallNumber: screening.hallNumber,
		film: screening.film,
		duration: screening.duration as number,
	};

	await db.insert(screenings).values(data).onConflictDoUpdate({ target: screenings.id, set: data });
	await Promise.all(screening.advertisements.map(saveAdvertisement));
}

async function saveAdvertisement(ad: Advertisement) {
	const data = { id: ad.id, screeningId: ad.screeningId, name: ad.name, duration: ad.duration as number };

	await db.insert(advertisements).values(data).onConflictDoUpdate({ target: advertisements.id, set: data });
}

async function removeDeletedScreenings(existingIds: string[], wantedIds: string[]) {
	const toRemove = existingIds.filter((id) => !wantedIds.includes(id));
	await Promise.all(toRemove.map((id) => db.delete(screenings).where(eq(screenings.id, id))));
}

// ── Reconstitution (DB → Domain) ──────────────────────────────
// ponytail: branded type casts have zero runtime cost — just type-level safety

function toWeekplan(row: { id: string; startDate: string; screenings: Record<string, unknown>[] }): Weekplan {
	return {
		id: row.id as WeekplanId,
		startDate: new Date(row.startDate),
		screenings: row.screenings.map((s) => toScreening(s as Parameters<typeof toScreening>[0])),
	};
}

function toScreening(row: {
	id: string;
	weekplanId: string;
	date: string;
	hallNumber: number;
	film: string;
	duration: number;
	advertisements?: Record<string, unknown>[];
}): Screening {
	return {
		id: row.id as ScreeningId,
		weekplanId: row.weekplanId as WeekplanId,
		date: new Date(row.date),
		hallNumber: row.hallNumber as HallNumber,
		film: row.film,
		duration: row.duration as Minutes,
		advertisements: row.advertisements?.map((a) => toAdvertisement(a as Parameters<typeof toAdvertisement>[0])) ?? [],
	};
}

function toAdvertisement(row: { id: string; screeningId: string; name: string; duration: number }): Advertisement {
	return {
		id: row.id as AdvertisementId,
		screeningId: row.screeningId as ScreeningId,
		name: row.name,
		duration: row.duration as Minutes,
	};
}
