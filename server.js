const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('.'));

// PostgreSQL connection (Railway provides DATABASE_URL)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

// Initialize database table
async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS beats (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        bpm INTEGER DEFAULT 120,
        description TEXT,
        pattern JSONB NOT NULL,
        velocities JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Database initialized');
  } catch (err) {
    console.error('DB init error:', err.message);
  }
}

// API Routes

// Get all beats
app.get('/api/beats', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM beats ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single beat
app.get('/api/beats/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM beats WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Beat not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Save new beat
app.post('/api/beats', async (req, res) => {
  const { name, bpm, description, pattern, velocities } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO beats (name, bpm, description, pattern, velocities) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, bpm, description, JSON.stringify(pattern), JSON.stringify(velocities)]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update beat
app.put('/api/beats/:id', async (req, res) => {
  const { name, bpm, description, pattern, velocities } = req.body;
  try {
    const result = await pool.query(
      'UPDATE beats SET name=$1, bpm=$2, description=$3, pattern=$4, velocities=$5, updated_at=CURRENT_TIMESTAMP WHERE id=$6 RETURNING *',
      [name, bpm, description, JSON.stringify(pattern), JSON.stringify(velocities), req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Beat not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete beat
app.delete('/api/beats/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM beats WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Beat not found' });
    res.json({ message: 'Beat deleted', beat: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Claude API Proxy - uses ANTHROPIC_API_KEY from Railway environment
app.post('/api/claude', async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured on server' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json(data);
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Check if API key is configured
app.get('/api/claude/status', (req, res) => {
  const hasKey = !!process.env.ANTHROPIC_API_KEY;
  res.json({ configured: hasKey });
});

// Fallback to index.html for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initDB();
});
