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

// ── Auth guard that allows public read access to site_content ─────────────

function requireAuthUnlessSiteContent(req, res, next) {
  if (req.params.table === 'site_content') return next();
  return requireAuth(req, res, next);
}

// ── GET /api/tables/:table — list all rows ────────────────────────────────

router.get('/:table', requireAuthUnlessSiteContent, guardTable, async (req, res) => {
  try {
    const orderCol = req.params.table === 'site_content' ? 'updated_at' : 'created_at';
    const [rows] = await pool.execute(
      `SELECT * FROM "${req.params.table}" ORDER BY "${orderCol}" DESC`
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
    const [rows] = await pool.execute(
      `SELECT * FROM "${req.params.table}" WHERE id = ?`,
      [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Not found.' });
    res.json(rows[0]);
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

  const cols         = keys.map(k => `"${k}"`).join(', ');
  const placeholders = keys.map(() => '?').join(', ');

  try {
    const [rows] = await pool.execute(
      `INSERT INTO "${req.params.table}" (${cols}) VALUES (${placeholders}) RETURNING *`,
      values
    );
    res.status(201).json(rows[0]);
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

  const set = keys.map(k => `"${k}" = ?`).join(', ');

  try {
    await pool.execute(
      `UPDATE "${req.params.table}" SET ${set} WHERE id = ?`,
      [...values, req.params.id]
    );
    const [rows] = await pool.execute(
      `SELECT * FROM "${req.params.table}" WHERE id = ?`,
      [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Not found.' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed.' });
  }
});

// ── DELETE /api/tables/:table/:id — delete row ────────────────────────────

router.delete('/:table/:id', requireAuth, guardTable, async (req, res) => {
  try {
    const [result] = await pool.execute(
      `DELETE FROM "${req.params.table}" WHERE id = ?`,
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
