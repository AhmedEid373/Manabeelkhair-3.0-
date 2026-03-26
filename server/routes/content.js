'use strict';

// Public read + admin write for the site_content table.

const express = require('express');
const pool    = require('../db');

const router = express.Router();

// ── Auth guard ─────────────────────────────────────────────────────────────

function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }
  next();
}

// ── GET /api/content — public, returns all site_content rows ───────────────

router.get('/', async (_req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM "site_content" ORDER BY section_group, section_key'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Query failed.' });
  }
});

// ── PATCH /api/content/:section_key — auth required, update by section_key ─

router.patch('/:section_key', requireAuth, async (req, res) => {
  const data = req.body || {};
  const keys   = Object.keys(data);
  const values = Object.values(data);

  if (!keys.length) {
    return res.status(400).json({ error: 'Body is empty.' });
  }

  const set = keys.map(k => `"${k}" = ?`).join(', ');

  try {
    const [result] = await pool.execute(
      `UPDATE "site_content" SET ${set} WHERE section_key = ?`,
      [...values, req.params.section_key]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Content not found.' });
    }
    const [rows] = await pool.execute(
      'SELECT * FROM "site_content" WHERE section_key = ?',
      [req.params.section_key]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed.' });
  }
});

module.exports = router;
