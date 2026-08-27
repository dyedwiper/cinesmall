import { DomainError } from "../../../shared/domain-error.js";

export class SeatNotExistsError extends DomainError {
	constructor(seat: string) {
		super("SEAT_NOT_EXISTS", `Seat "${seat}" does not exist in the hall.`);
	}
}

export class SeatAlreadyReservedError extends DomainError {
	constructor(seat: string) {
		super("SEAT_ALREADY_RESERVED", `Seat "${seat}" is already reserved.`);
	}
}
