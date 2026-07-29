import { pushSchema } from 'drizzle-kit/api-postgres';
import { drizzle } from 'drizzle-orm/node-postgres';
import { reset } from 'drizzle-seed';
import crypto from 'node:crypto';
import { Pool } from 'pg';
import * as schema from '../db/schema.js';

process.loadEnvFile();

const dbName = `cinesmall-test-${crypto.randomUUID()}`;

const pool1 = new Pool({ max: 1 });
await pool1.query(`CREATE DATABASE "${dbName}";`);

const pool2 = new Pool({ database: dbName, max: 1 });
const db = drizzle({ client: pool2, relations: schema.relations });
await (await pushSchema(schema, db)).apply();

vi.doMock(import('../db/index.js'), async () => ({ db }));

afterEach(async () => {
    await reset(db, schema);
});

afterAll(async () => {
    db.$client.end();

    await pool1.query(`DROP DATABASE "${dbName}";`);
    await pool1.end();
});
