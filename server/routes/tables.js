'use strict';

// All routes here require an active admin session.

const express = require('express');
const pool    = require('../db');

const router = express.Router();

// ── Auth guard ────────────────────────────────────────────────────────────

function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }
  next();
}

// ── Allowed table names (whitelist) ───────────────────────────────────────

const ALLOWED_TABLES = new Set([
  'contacts',
  'donation_requests',
  'volunteer_requests',
  'site_content',
]);

function guardTable(req, res, next) {
  if (!ALLOWED_TABLES.has(req.params.table)) {
    return res.status(404).json({ error: 'Table not found.' });
  }
  next();
}

// ── GET /api/tables/:table — list all rows ────────────────────────────────

router.get('/:table', requireAuth, guardTable, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT * FROM \`${req.params.table}\` ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Query failed.' });
  }
});

// ── GET /api/tables/:table/:id — single row ───────────────────────────────

router.get('/:table/:id', requireAuth, guardTable, async (req, res) => {
  try {
    const [[row]] = await pool.execute(
      `SELECT * FROM \`${req.params.table}\` WHERE id = ?`,
      [req.params.id]
    );
    if (!row) return res.status(404).json({ error: 'Not found.' });
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Query failed.' });
  }
});

// ── POST /api/tables/:table — insert row ─────────────────────────────────

router.post('/:table', guardTable, async (req, res) => {
  const data = req.body || {};
  const keys   = Object.keys(data);
  const values = Object.values(data);

  if (!keys.length) {
    return res.status(400).json({ error: 'Body is empty.' });
  }

  const cols        = keys.map(k => `\`${k}\``).join(', ');
  const placeholders = keys.map(() => '?').join(', ');

  try {
    const [result] = await pool.execute(
      `INSERT INTO \`${req.params.table}\` (${cols}) VALUES (${placeholders})`,
      values
    );
    const [[row]] = await pool.execute(
      `SELECT * FROM \`${req.params.table}\` WHERE id = LAST_INSERT_ID() OR id = ?`,
      [data.id || result.insertId]
    );
    res.status(201).json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Insert failed.' });
  }
});

// ── PATCH /api/tables/:table/:id — update row ─────────────────────────────

router.patch('/:table/:id', requireAuth, guardTable, async (req, res) => {
  const data = req.body || {};
  const keys   = Object.keys(data);
  const values = Object.values(data);

  if (!keys.length) {
    return res.status(400).json({ error: 'Body is empty.' });
  }

  const set = keys.map(k => `\`${k}\` = ?`).join(', ');

  try {
    await pool.execute(
      `UPDATE \`${req.params.table}\` SET ${set} WHERE id = ?`,
      [...values, req.params.id]
    );
    const [[row]] = await pool.execute(
      `SELECT * FROM \`${req.params.table}\` WHERE id = ?`,
      [req.params.id]
    );
    if (!row) return res.status(404).json({ error: 'Not found.' });
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed.' });
  }
});

// ── DELETE /api/tables/:table/:id — delete row ────────────────────────────

router.delete('/:table/:id', requireAuth, guardTable, async (req, res) => {
  try {
    const [result] = await pool.execute(
      `DELETE FROM \`${req.params.table}\` WHERE id = ?`,
      [req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found.' });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Delete failed.' });
  }
});

module.exports = router;
