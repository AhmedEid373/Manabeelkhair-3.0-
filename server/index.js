'use strict';

const express      = require('express');
const session      = require('express-session');
const MySQLStore   = require('express-mysql-session')(session);
const bodyParser   = require('body-parser');
const path         = require('path');

const pool         = require('./db');
const { seed }      = require('./seed');
const authRoutes    = require('./routes/auth');
const tableRoutes   = require('./routes/tables');
const contentRoutes = require('./routes/content');

const app  = express();
const PORT = process.env.PORT || 3001;

// ── Session store ─────────────────────────────────────────────────────────

const sessionStore = new MySQLStore({}, pool);

app.use(session({
  key:               'connect.sid',
  secret:            process.env.SESSION_SECRET || 'change-me-in-production',
  store:             sessionStore,
  resave:            false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    maxAge:   8 * 60 * 60 * 1000, // 8 hours
  },
}));

// ── Middleware ────────────────────────────────────────────────────────────

app.use(bodyParser.json());

// ── Routes ────────────────────────────────────────────────────────────────

app.use('/api/auth',    authRoutes);
app.use('/api/tables',  tableRoutes);
app.use('/api/content', contentRoutes);

// ── Temporary admin reset (remove after use) ──────────────────────────────

const crypto = require('crypto');
app.get('/api/reset-admin-xK9p2', async (_req, res) => {
  try {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync('Admin@2024', salt, 64).toString('hex');
    await pool.execute(
      `INSERT INTO admin_users (email, password) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE password = VALUES(password)`,
      ['admin@manabeaalkhair.org', `${salt}:${hash}`]
    );
    res.json({ ok: true, message: 'Password reset to Admin@2024' });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ── Health check ──────────────────────────────────────────────────────────

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true, database: 'connected' });
  } catch (err) {
    res.status(503).json({ ok: false, database: 'disconnected', error: err.message });
  }
});

// ── Serve React frontend in production ────────────────────────────────────

if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// ── Start ─────────────────────────────────────────────────────────────────

// Ensure tables + default admin exist, then start listening
seed(pool)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API server listening on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
