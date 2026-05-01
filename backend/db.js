const dotenv = require('dotenv');
dotenv.config();
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || `postgres://${process.env.POSTGRES_USER || 'user'}:${process.env.POSTGRES_PASSWORD || 'password'}@${process.env.POSTGRES_HOST || 'localhost'}:${process.env.POSTGRES_PORT || 5432}/${process.env.POSTGRES_DB || 'expense_db'}`;
const pool = new Pool({ connectionString });

async function waitForDb(retries = 10, delayMs = 1500) {
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      await pool.query('SELECT 1');
      return;
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

async function initDb() {
  await waitForDb();
  await pool.query(`
    CREATE TABLE IF NOT EXISTS transactions (
      id SERIAL PRIMARY KEY,
      description TEXT NOT NULL,
      amount NUMERIC NOT NULL,
      category TEXT NOT NULL,
      status TEXT NOT NULL,
      spent_at TIMESTAMP NOT NULL DEFAULT NOW(),
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);

  const countResult = await pool.query('SELECT COUNT(*) FROM transactions');
  if (Number(countResult.rows[0].count) === 0) {
    await pool.query(
      `INSERT INTO transactions (description, amount, category, status, spent_at)
       VALUES
       ('Coffee at cafe', 3.5, 'Food', 'completed', NOW() - INTERVAL '2 days'),
       ('Monthly gym', 35.0, 'Health', 'completed', NOW() - INTERVAL '10 days'),
       ('Office supplies', 18.2, 'Business', 'pending', NOW() - INTERVAL '3 days')
      `
    );
  }
  return pool;
}

module.exports = { initDb, pool };
