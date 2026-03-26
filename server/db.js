'use strict';

const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// pool.execute compatibility wrapper:
//   - converts ? placeholders to $1, $2, ...
//   - returns [rows] where rows.affectedRows = rowCount
pool.execute = async function execute(sql, params) {
  let i = 0;
  const pgSql = sql.replace(/\?/g, () => `$${++i}`);
  const result = await pool.query(pgSql, params || []);
  const rows = result.rows;
  rows.affectedRows = result.rowCount;
  return [rows];
};

module.exports = pool;
