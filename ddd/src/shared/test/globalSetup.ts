import { pushSchema } from 'drizzle-kit/api-postgres';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../db/schema.js';

const templateDbName = 'cinesmall-test-template';

export async function setup() {
    process.loadEnvFile();

    const pool1 = new Pool();
    await pool1.query(`CREATE DATABASE "${templateDbName}";`);
    await pool1.end();

    const pool2 = new Pool({ database: templateDbName });
    const db = drizzle({ client: pool2, relations: schema.relations });
    await (await pushSchema(schema, db)).apply();
    await pool2.end();
}

export async function teardown() {
    const pool = new Pool();
    await pool.query(`DROP DATABASE "${templateDbName}";`);
    await pool.end();
}
