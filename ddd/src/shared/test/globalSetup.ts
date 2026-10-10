import { pushSchema } from 'drizzle-kit/api-postgres';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../db/schema.js';

// This name must be the same as PGDATABASE in .env.test
const testDbName = `cinesmall-test`;

export async function setup() {
    process.loadEnvFile();

    const pool1 = new Pool();
    await pool1.query(`CREATE DATABASE "${testDbName}";`);
    await pool1.end();

    const pool2 = new Pool({ database: testDbName });
    const db = drizzle({ client: pool2, relations: schema.relations });
    await (await pushSchema(schema, db)).apply();
    await pool2.end();
}

export async function teardown() {
    const pool = new Pool();
    await pool.query(`DROP DATABASE "${testDbName}";`);
    await pool.end();
}
