import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_URdHPNSO0jD4@ep-gentle-cherry-aiq43mul-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const pool = new Pool({
  connectionString,
  // Neon requires SSL; set rejectUnauthorized false for testing if needed
  ssl: { rejectUnauthorized: false },
});

(async () => {
  try {
    const res = await pool.query('SELECT 1 as ok');
    console.log('OK', res.rows);
  } catch (err) {
    console.error('ERROR', err.message || err);
    if (err.stack) console.error(err.stack);
  } finally {
    await pool.end();
  }
})();
