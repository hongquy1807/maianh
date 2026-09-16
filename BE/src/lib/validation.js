export function badRequest(message) {
  return Object.assign(new Error(message), { status: 400, publicMessage: message });
}

export function textQuery(query, key, max = 100) {
  if (query[key] === undefined) return '';
  if (typeof query[key] !== 'string' || query[key].length > max) throw badRequest(`Invalid ${key}`);
  return query[key].trim();
}

export function pagination(query) {
  const read = (key, fallback, max) => {
    const value = query[key] ?? String(fallback);
    if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value)) throw badRequest(`Invalid ${key}`);
    const number = Number(value);
    if (!Number.isSafeInteger(number) || number > max) throw badRequest(`Invalid ${key}`);
    return number;
  };
  const page = read('page', 1, 100000);
  const limit = read('limit', 20, 100);
  return { page, limit, offset: (page - 1) * limit };
}

export function resourceId(value) {
  if (!/^[1-9]\d{0,19}$/.test(value) || BigInt(value) > 18446744073709551615n) throw badRequest('Invalid id');
  return value;
}

// Escape SQL LIKE wildcards; all values are still bound as query parameters.
export function searchPattern(value) {
  return `%${value.replace(/[!%_]/g, match => `!${match}`)}%`;
}
