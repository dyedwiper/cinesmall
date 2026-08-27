import { DomainError } from "../../../shared/domain-error.js";

export class ScreeningDateOutOfRangeError extends DomainError {
	constructor() {
		super("SCREENING_DATE_OUT_OF_RANGE", "The screening's date does not belong in the weekplan.");
	}
}

export class ScreeningOverlapError extends DomainError {
	constructor() {
		super("SCREENING_OVERLAP", "The screening overlaps with another screening.");
	}
}

export class ScreeningNotFoundError extends DomainError {
	constructor() {
		super("SCREENING_NOT_FOUND", "Screening not found.");
	}
}

export class MaxAdvertisementsExceededError extends DomainError {
	constructor() {
		super("MAX_ADVERTISEMENTS_EXCEEDED", "Max 3 advertisements per screening are allowed.");
	}
}
