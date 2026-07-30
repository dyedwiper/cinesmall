import { pushSchema } from 'drizzle-kit/api-postgres';
import { drizzle } from 'drizzle-orm/node-postgres';
import { reset } from 'drizzle-seed';
import crypto from 'node:crypto';
import { Pool } from 'pg';
import * as schema from '../db/schema.js';

process.loadEnvFile();

const dbName = `cinesmall-test-${crypto.randomUUID()}`;

const adminPool = new Pool({ max: 1 });
await adminPool.query(`CREATE DATABASE "${dbName}";`);

const testPool = new Pool({ database: dbName, max: 1 });
const db = drizzle({ client: testPool, relations: schema.relations });
await (await pushSchema(schema, db)).apply();

vi.doMock(import('../db/index.js'), async () => ({ db }));

afterEach(async () => {
    await reset(db, schema);
});

afterAll(async () => {
    await testPool.end();

    await adminPool.query(`DROP DATABASE "${dbName}";`);
    await adminPool.end();
});
