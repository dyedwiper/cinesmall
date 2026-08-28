import * as schema from "../db/schema";
import { PGlite } from "@electric-sql/pglite";
import { pushSchema } from "drizzle-kit/api-postgres";
import { drizzle } from "drizzle-orm/pglite";
import { reset } from "drizzle-seed";
import { vi } from "vitest";

const db = drizzle({ client: new PGlite(), relations: schema.relations });
await (await pushSchema(schema, db)).apply();

// Inspired by https://github.com/drizzle-team/drizzle-orm/issues/4205
vi.doMock(import("../db"), async () => ({ db }));

afterEach(async () => {
	await reset(db, schema);
});
