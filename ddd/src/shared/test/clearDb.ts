import { reset } from 'drizzle-seed';
import { afterEach } from 'vitest';
import { db } from '../db/index.js';
import * as schema from '../db/schema.js';

afterEach(() => {
    reset(db, schema);
});
