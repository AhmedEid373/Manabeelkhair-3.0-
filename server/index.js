'use strict';

const express      = require('express');
const session      = require('express-session');
const pgSession    = require('connect-pg-simple')(session);
const bodyParser   = require('body-parser');
const path         = require('path');

const pool         = require('./db');
const { seed }      = require('./seed');
const authRoutes    = require('./routes/auth');
const tableRoutes   = require('./routes/tables');

const app  = express();
const PORT = process.env.PORT || 3001;

app.set('trust proxy', 1);

// ── Session store ─────────────────────────────────────────────────────────

const sessionStore = new pgSession({
  pool,
  createTableIfMissing: true,
});

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
