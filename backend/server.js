const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const { initDb } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

function getDb() {
  if (!app.locals.db) {
    throw new Error('Database is not initialized');
  }
  return app.locals.db;
}

app.get('/api/health', async (req, res) => {
  try {
    const db = getDb();
    await db.query('SELECT 1');
    res.json({ status: 'ok', uptime: process.uptime(), db: 'ready' });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({ status: 'error', message: 'Health check failed' });
  }
});

app.get('/api/transactions', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.query('SELECT * FROM transactions ORDER BY spent_at DESC, id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    res.status(500).json({ error: 'Unable to fetch transactions' });
  }
});

app.get('/api/summary', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.query(
      `SELECT date_trunc('month', spent_at) AS period, SUM(amount) AS total
       FROM transactions
       GROUP BY period
       ORDER BY period DESC`
    );
    res.json(result.rows.map((row) => ({ period: row.period.toISOString().slice(0, 7), total: Number(row.total) })));
  } catch (error) {
    console.error('Failed to fetch summary:', error);
    res.status(500).json({ error: 'Unable to fetch summary' });
  }
});

app.post('/api/transactions', async (req, res) => {
  try {
    const { description, amount, category, status, spent_at } = req.body;
    const db = getDb();
    const result = await db.query(
      `INSERT INTO transactions (description, amount, category, status, spent_at)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [description, amount, category, status, spent_at || new Date()]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Failed to create transaction:', error);
    res.status(500).json({ error: 'Unable to create transaction' });
  }
});

app.put('/api/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { description, amount, category, status, spent_at } = req.body;
    const db = getDb();
    const result = await db.query(
      `UPDATE transactions
       SET description = $1, amount = $2, category = $3, status = $4, spent_at = $5
       WHERE id = $6
       RETURNING *`,
      [description, amount, category, status, spent_at || new Date(), id]
    );
    if (!result.rowCount) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Failed to update transaction:', error);
    res.status(500).json({ error: 'Unable to update transaction' });
  }
});

app.delete('/api/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDb();
    const result = await db.query('DELETE FROM transactions WHERE id = $1 RETURNING *', [id]);
    if (!result.rowCount) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json({ deleted: true, transaction: result.rows[0] });
  } catch (error) {
    console.error('Failed to delete transaction:', error);
    res.status(500).json({ error: 'Unable to delete transaction' });
  }
});

const port = process.env.PORT || 4000;

async function startServer() {
  try {
    const pool = await initDb();
    app.locals.db = pool;
    return app.listen(port, () => {
      console.log(`Backend running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
