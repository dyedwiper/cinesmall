import { createId } from "../../../shared/domain.js";
import type { AdvertisementId, Minutes, ScreeningId } from "./value-objects.js";
import { createMinutes } from "./value-objects.js";

// ── Type ───────────────────────────────────────────────────────

export interface Advertisement {
	readonly id: AdvertisementId;
	readonly screeningId: ScreeningId;
	readonly name: string;
	readonly duration: Minutes;
}

// ── Factory ────────────────────────────────────────────────────

export function buildAdvertisement(params: {
	id?: string;
	screeningId: string;
	name: string;
	duration: number;
}): Advertisement {
	return {
		id: createId<AdvertisementId>(params.id),
		screeningId: createId<ScreeningId>(params.screeningId),
		name: params.name,
		duration: createMinutes(params.duration),
	};
}
