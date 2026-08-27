/**
 * Base class for all domain invariant violations.
 * Caught by the centralized Hono error middleware and mapped to HTTP 400.
 */
export class DomainError extends Error {
	constructor(
		public readonly code: string,
		message: string
	) {
		super(message);
		this.name = "DomainError";
	}
}
