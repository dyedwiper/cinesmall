import crypto from "node:crypto";

/** Utility type for nominal/branded types — zero runtime cost */
export type Brand<T, B extends string> = T & { readonly __brand: B };

/** Create a typed ID (new UUID or from existing string) */
export function createId<T extends string = string>(input?: string): T {
	return (input ?? crypto.randomUUID()) as T;
}
