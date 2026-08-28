import * as schema from "../db/schema";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { reset } from "drizzle-seed";
import crypto from "node:crypto";
import { Pool } from "pg";
import { vi } from "vitest";

config();

const dbName = `cinesmall-test-${crypto.randomUUID()}`;

const pool1 = new Pool();
await pool1.query(`CREATE DATABASE "${dbName}" TEMPLATE "cinesmall-test-template";`);

const pool2 = new Pool({ database: dbName });
const db = drizzle({ client: pool2, relations: schema.relations });

vi.doMock(import("../db"), async () => ({ db }));

afterEach(async () => {
	await reset(db, schema);
});

afterAll(async () => {
	db.$client.end();

	await pool1.query(`DROP DATABASE "${dbName}";`);
	await pool1.end();
});
