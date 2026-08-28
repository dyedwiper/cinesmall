import * as schema from "../db/schema";
import { config } from "dotenv";
import { pushSchema } from "drizzle-kit/api-postgres";
import { drizzle } from "drizzle-orm/node-postgres";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { Pool } from "pg";

const testDbName = `cinesmall-test-${crypto.randomUUID()}`;

export async function setup() {
	config();

	const pool1 = new Pool();
	await pool1.query(`CREATE DATABASE "${testDbName}";`);
	await pool1.end();

	const pool2 = new Pool({ database: testDbName });
	const db = drizzle({ client: pool2, relations: schema.relations });
	await (await pushSchema(schema, db)).apply();
	await pool2.end();

	const envTest = `PGUSER=${process.env.PGUSER}
	PGPASSWORD=${process.env.PGPASSWORD}
	PGHOST=${process.env.PGHOST}
	PGPORT=${process.env.PGPORT}
	PGDATABASE=${testDbName}`;
	await fs.writeFile(path.join(process.cwd(), ".env.test"), envTest);
}

export async function teardown() {
	const pool = new Pool();
	await pool.query(`DROP DATABASE "${testDbName}";`);
	await pool.end();

	await fs.unlink(path.join(process.cwd(), ".env.test"));
}
