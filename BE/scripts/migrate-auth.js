import { readFile } from 'node:fs/promises';
import { pool } from '../src/config/database.js';
try {
  const sql = await readFile(new URL('../../DB/03_auth.sql', import.meta.url), 'utf8');
  for (const statement of sql.split(';').map(value => value.trim()).filter(Boolean)) await pool.query(statement);
  console.log('Auth tables ready in configured database.');
} catch (error) {
  console.error('Auth migration failed:', error.code || error.name);
  process.exitCode = 1;
} finally { await pool.end(); }
