import { scrypt, randomBytes, timingSafeEqual, createHash } from 'node:crypto';
import { promisify } from 'node:util';
const derive = promisify(scrypt);
const options = { N: 32768, r: 8, p: 3, maxmem: 64 * 1024 * 1024 };
export const hashToken = value => createHash('sha256').update(value).digest('hex');
export const newToken = () => randomBytes(32).toString('hex');
export async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = await derive(password, salt, 64, options);
  return `scrypt-v1$${salt}$${hash.toString('hex')}`;
}
export async function verifyPassword(password, stored) {
  const valid = /^scrypt-v1\$[a-f0-9]{32}\$[a-f0-9]{128}$/.test(stored || '');
  const [, salt, hex] = valid ? stored.split('$') : ['','0'.repeat(32),'0'.repeat(128)];
  const hash = await derive(password, salt, 64, options);
  return timingSafeEqual(hash, Buffer.from(hex, 'hex')) && valid;
}
