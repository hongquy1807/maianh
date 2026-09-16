import app from './app.js';
import { checkDatabase, pool } from './config/database.js';

const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || '127.0.0.1';

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be an integer from 1 to 65535');
}

try {
  await checkDatabase();
  console.log('MySQL connection ready');
} catch (error) {
  console.error('Cannot connect to MySQL. Check BE/.env and the MySQL service.', error.code || error.name);
  await pool.end();
  process.exit(1);
}

const server = app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});

server.on('error', async (error) => {
  console.error(`Cannot start server: ${error.message}`);
  process.exitCode = 1;
  await pool.end();
});

let stopping = false;
function shutdown() {
  if (stopping) return;
  stopping = true;
  const timeout = setTimeout(() => process.exit(1), 10000);
  timeout.unref();
  server.close(async () => { await pool.end(); clearTimeout(timeout); });
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
