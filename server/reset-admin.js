'use strict';

// Run this script to reset the admin password:
// DATABASE_URL=mysql://... node server/reset-admin.js

const crypto = require('crypto');
const pool   = require('./db');

const EMAIL    = 'admin@manabeaalkhair.org';
const PASSWORD = 'Admin@2024';

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

async function resetAdmin() {
  const hashed = hashPassword(PASSWORD);

  const [result] = await pool.execute(
    `INSERT INTO admin_users (email, password)
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE password = VALUES(password)`,
    [EMAIL, hashed]
  );

  console.log(`Admin user upserted: ${EMAIL}`);
  console.log(`Password reset to: ${PASSWORD}`);
  process.exit(0);
}

resetAdmin().catch(err => {
  console.error('Reset failed:', err.message);
  process.exit(1);
});
