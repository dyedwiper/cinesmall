import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { relations } from './schema.js';

const pool = new Pool();
export const db = drizzle({ client: pool, relations });

// See https://github.com/drizzle-team/drizzle-orm/discussions/3271 for the typing of the Transaction
export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
