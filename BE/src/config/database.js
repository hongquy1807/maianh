import mysql from 'mysql2/promise';

function integerEnv(name, fallback, max) {
  const value = Number(process.env[name] ?? fallback);
  if (!Number.isInteger(value) || value < 1 || value > max) throw new Error(`Invalid ${name}`);
  return value;
}

export const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: integerEnv('DB_PORT', 3306, 65535),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME || 'maianh',
  charset: 'utf8mb4', timezone: 'Z', dateStrings: true,
  supportBigNumbers: true, bigNumberStrings: true,
  waitForConnections: true,
  connectionLimit: integerEnv('DB_CONNECTION_LIMIT', 10, 100),
  queueLimit: 100, connectTimeout: 5000,
  multipleStatements: false
});

// MySQL TIMESTAMP conversions must use UTC on every pooled connection.
pool.on('connection', connection => { connection.query("SET time_zone = '+00:00'"); });

export async function checkDatabase() {
  const [rows] = await pool.execute('SELECT DATABASE() AS name, 1 AS connected');
  return rows[0];
}
