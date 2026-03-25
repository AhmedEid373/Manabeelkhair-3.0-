'use strict';

const express      = require('express');
const session      = require('express-session');
const MySQLStore   = require('express-mysql-session')(session);
const bodyParser   = require('body-parser');

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

// ── Health check ──────────────────────────────────────────────────────────

app.get('/api/health', (_req, res) => res.json({ ok: true }));

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
