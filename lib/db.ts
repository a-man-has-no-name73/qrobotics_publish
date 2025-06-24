// lib/db.ts
import { Pool } from 'pg';

// Support both DATABASE_URL (Supabase) and individual connection parameters
const pool = new Pool({
  // If DATABASE_URL is provided (Supabase/Production), use it
  connectionString: process.env.DATABASE_URL,
  // Otherwise use individual parameters (Local development)
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  // SSL is required for Supabase and most cloud PostgreSQL providers
  ssl: process.env.NODE_ENV === 'production' || process.env.DATABASE_URL 
    ? { rejectUnauthorized: false } 
    : false,
  max: parseInt(process.env.DB_CONNECTION_LIMIT || '10'),
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // Increased for better reliability with Supabase
});

export async function query(text: string, params?: any[]) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('Executed query', { text, duration, rows: res.rowCount });
  return res;
}

export default pool;