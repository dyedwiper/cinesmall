import { createId } from "../../../shared/domain.js";
import { SeatAlreadyReservedError, SeatNotExistsError } from "./errors.js";
import type { Hall, HallplanId } from "./value-objects.js";
import { createHall } from "./value-objects.js";

// ── Type ───────────────────────────────────────────────────────

export interface Hallplan {
	readonly id: HallplanId;
	readonly screeningId: string;
	readonly hall: Hall;
	readonly reservedSeats: readonly string[];
}

// ── Factory ────────────────────────────────────────────────────

export function buildHallplan(params: {
	id?: string;
	screeningId: string;
	hallNumber: number;
	reservedSeats?: string[];
}): Hallplan {
	return {
		id: createId<HallplanId>(params.id),
		screeningId: params.screeningId,
		hall: createHall(params.hallNumber),
		reservedSeats: params.reservedSeats ?? [],
	};
}

// ── Aggregate Operations ───────────────────────────────────────

export function reserveSeat(hallplan: Hallplan, seat: string): Hallplan {
	if (!hallplan.hall.seats.includes(seat)) throw new SeatNotExistsError(seat);
	if (hallplan.reservedSeats.includes(seat)) throw new SeatAlreadyReservedError(seat);

	return { ...hallplan, reservedSeats: [...hallplan.reservedSeats, seat] };
}
