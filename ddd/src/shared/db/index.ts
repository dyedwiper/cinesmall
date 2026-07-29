import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { relations } from './schema.js';

const pool = new Pool();
export const db = drizzle({ client: pool, relations });
