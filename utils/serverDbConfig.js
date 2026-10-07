import pkg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// drizzle-orm v1.x requires { client, schema } object — NOT drizzle(pool, config)
export const serverDb = drizzle({ client: pool, schema });

