'use strict';

const express = require('express');
const crypto  = require('crypto');
const pool    = require('../db');

const router = express.Router();

// ── Helpers ───────────────────────────────────────────────────────────────

function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  const attempt = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(attempt, 'hex'), Buffer.from(hash, 'hex'));
}

// ── POST /api/auth/login ──────────────────────────────────────────────────

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const [[user]] = await pool.execute(
      'SELECT id, email, password FROM admin_users WHERE email = ?',
      [email]
    );

    if (!user || !verifyPassword(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    req.session.userId = user.id;
    req.session.email  = user.email;

    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).json({ error: 'Session save failed.' });
      }
      return res.json({ ok: true, email: user.email });
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// ── POST /api/auth/logout ─────────────────────────────────────────────────

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ ok: true });
  });
});

// ── GET /api/auth/me ──────────────────────────────────────────────────────

router.get('/me', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }
  return res.json({ ok: true, email: req.session.email });
});

// ── PATCH /api/auth/profile — update email and/or password ───────────────

router.patch('/profile', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }

  const { currentPassword, newEmail, newPassword } = req.body || {};

  if (!currentPassword) {
    return res.status(400).json({ error: 'Current password is required.' });
  }
  if (!newEmail && !newPassword) {
    return res.status(400).json({ error: 'Provide a new email or new password.' });
  }

  try {
    const [[user]] = await pool.execute(
      'SELECT id, email, password FROM admin_users WHERE id = ?',
      [req.session.userId]
    );

    if (!user || !verifyPassword(currentPassword, user.password)) {
      return res.status(401).json({ error: 'كلمة المرور الحالية غير صحيحة.' });
    }

    if (newEmail && newEmail !== user.email) {
      const [[existing]] = await pool.execute(
        'SELECT id FROM admin_users WHERE email = ? AND id != ?',
        [newEmail, req.session.userId]
      );
      if (existing) {
        return res.status(409).json({ error: 'هذا البريد الإلكتروني مستخدم بالفعل.' });
      }
    }

    const updatedEmail = newEmail || user.email;
    let updatedPassword = user.password;

    if (newPassword) {
      const salt = crypto.randomBytes(16).toString('hex');
      const hash = crypto.scryptSync(newPassword, salt, 64).toString('hex');
      updatedPassword = `${salt}:${hash}`;
    }

    await pool.execute(
      'UPDATE admin_users SET email = ?, password = ? WHERE id = ?',
      [updatedEmail, updatedPassword, req.session.userId]
    );

    req.session.email = updatedEmail;
    req.session.save(() => {
      res.json({ ok: true, email: updatedEmail });
    });
  } catch (err) {
    console.error('Profile update error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
