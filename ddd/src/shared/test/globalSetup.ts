import * as schema from "../db/schema";
import dotenv from "dotenv";
import { pushSchema } from "drizzle-kit/api-postgres";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const dbName = "cinesmall-test-template";

export async function setup() {
	dotenv.config();

	const pool1 = new Pool();
	await pool1.query(`CREATE DATABASE "${dbName}";`);
	await pool1.end();

	const pool2 = new Pool({ database: dbName });
	const db = drizzle({ client: pool2, relations: schema.relations });
	await (await pushSchema(schema, db)).apply();
	await pool2.end();
}

export async function teardown() {
	const pool = new Pool();
	await pool.query(`DROP DATABASE "${dbName}";`);
	await pool.end();
}
