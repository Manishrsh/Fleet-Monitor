import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@shared/schema";

// Prefer an explicit environment variable. Trim surrounding whitespace
// and strip accidental surrounding single-quotes which can happen
// when a connection string is copied with quotes.
const rawConnection = (process.env.DATABASE_URL || "postgresql://neondb_owner:npg_URdHPNSO0jD4@ep-gentle-cherry-aiq43mul-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require");
const connectionString = String(rawConnection).trim().replace(/^'|'$/g, "");

// Determine whether to enable SSL for the Pool. Allow overriding with
// `DB_SSL=false` or `DB_REJECT_UNAUTHORIZED=false` if needed for testing.
const useSsl = process.env.DB_SSL === undefined ? true : process.env.DB_SSL !== "false";

const pool = new Pool({
    connectionString,
    ssl: useSsl ? { rejectUnauthorized: process.env.DB_REJECT_UNAUTHORIZED !== "false" } : undefined,
});

export { pool };
export const db = drizzle(pool, { schema });
