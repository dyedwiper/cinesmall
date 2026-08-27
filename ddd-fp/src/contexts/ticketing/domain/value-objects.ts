import type { Brand } from "../../../shared/domain.js";

// ── Branded Types ──────────────────────────────────────────────

export type HallplanId = Brand<string, "HallplanId">;

// ── Value Objects ──────────────────────────────────────────────

export interface Hall {
	readonly number: 1 | 2;
	readonly seats: readonly string[];
}

export function createHall(number: number): Hall {
	if (number === 1) return { number: 1, seats: ["a1", "a2", "a3", "b1", "b2", "b3"] };
	if (number === 2) return { number: 2, seats: ["a1", "a2", "b1", "b2"] };
	throw new Error("There are only hall 1 and 2.");
}
