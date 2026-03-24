'use strict';

// Run once to create tables and insert the default admin user.
// Usage: DATABASE_URL=mysql://... node server/seed.js

const mysql = require('mysql2/promise');
const crypto = require('crypto');

function parseDbUrl(url) {
  const u = new URL(url);
  return {
    host:     u.hostname,
    port:     parseInt(u.port, 10) || 3306,
    user:     decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    database: u.pathname.replace(/^\//, ''),
  };
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

async function seed() {
  const conn = await mysql.createConnection(parseDbUrl(process.env.DATABASE_URL));

  // ── Admin users ───────────────────────────────────────────────────────────
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id           VARCHAR(36)  NOT NULL DEFAULT (UUID()) PRIMARY KEY,
      email        VARCHAR(255) NOT NULL UNIQUE,
      password     VARCHAR(255) NOT NULL,
      created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  // ── Contacts ──────────────────────────────────────────────────────────────
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS contacts (
      id           VARCHAR(36)  NOT NULL DEFAULT (UUID()) PRIMARY KEY,
      name         VARCHAR(255) NOT NULL,
      email        VARCHAR(255) NOT NULL,
      phone        VARCHAR(50)  NOT NULL,
      type         ENUM('donation','volunteer','inquiry','partnership','helper','needer') NOT NULL,
      message      TEXT,
      location     VARCHAR(255),
      status       ENUM('pending','in_progress','completed','cancelled') NOT NULL DEFAULT 'pending',
      notes        TEXT,
      created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  // ── Donation requests ─────────────────────────────────────────────────────
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS donation_requests (
      id              VARCHAR(36)  NOT NULL DEFAULT (UUID()) PRIMARY KEY,
      full_name       VARCHAR(255) NOT NULL,
      email           VARCHAR(255) NOT NULL,
      phone           VARCHAR(50)  NOT NULL,
      amount          VARCHAR(50)  NOT NULL,
      donation_method VARCHAR(100) NOT NULL,
      allocation      VARCHAR(255),
      privacy_agreed  TINYINT(1)   NOT NULL DEFAULT 0,
      status          ENUM('pending','in_progress','completed','cancelled') NOT NULL DEFAULT 'pending',
      admin_notes     TEXT,
      created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  // ── Volunteer requests ────────────────────────────────────────────────────
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS volunteer_requests (
      id              VARCHAR(36)  NOT NULL DEFAULT (UUID()) PRIMARY KEY,
      full_name       VARCHAR(255) NOT NULL,
      age             VARCHAR(10)  NOT NULL,
      email           VARCHAR(255) NOT NULL,
      phone           VARCHAR(50)  NOT NULL,
      region          VARCHAR(255) NOT NULL,
      skills          TEXT         NOT NULL,
      availability    VARCHAR(255) NOT NULL,
      volunteer_type  VARCHAR(100) NOT NULL,
      notes           TEXT,
      terms_agreed    TINYINT(1)   NOT NULL DEFAULT 0,
      status          ENUM('pending','in_progress','completed','cancelled') NOT NULL DEFAULT 'pending',
      admin_notes     TEXT,
      created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  // ── Site content ──────────────────────────────────────────────────────────
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS site_content (
      id            VARCHAR(36)  NOT NULL DEFAULT (UUID()) PRIMARY KEY,
      section_key   VARCHAR(255) NOT NULL UNIQUE,
      content_ar    TEXT         NOT NULL,
      content_en    TEXT         NOT NULL,
      content_type  VARCHAR(50)  NOT NULL DEFAULT 'text',
      section_group VARCHAR(100) NOT NULL DEFAULT 'general',
      updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      updated_by    VARCHAR(255)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  // ── Default admin user ────────────────────────────────────────────────────
  const [[existing]] = await conn.execute(
    'SELECT id FROM admin_users WHERE email = ?',
    ['admin@manabeaalkhair.org']
  );

  if (!existing) {
    await conn.execute(
      'INSERT INTO admin_users (email, password) VALUES (?, ?)',
      ['admin@manabeaalkhair.org', hashPassword('Admin@2024')]
    );
    console.log('Default admin user created: admin@manabeaalkhair.org / Admin@2024');
  } else {
    console.log('Admin user already exists — skipped.');
  }

  await conn.end();
  console.log('Seed complete.');
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
