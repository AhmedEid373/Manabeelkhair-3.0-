'use strict';

const mysql = require('mysql2/promise');

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

const config = parseDbUrl(process.env.DATABASE_URL);

const pool = mysql.createPool({
  ...config,
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  typeCast: function (field, next) {
    if (field.type === 'TINY' && field.length === 1) {
      return field.string() === '1';
    }
    return next();
  },
  dateStrings: true,
  timezone:    '+00:00',
  charset:     'utf8mb4',
});

module.exports = pool;
