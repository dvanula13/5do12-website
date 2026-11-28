const origins = new Set(['https://5do12.de', 'https://www.5do12.de']);
const bot = /\b(bot|crawler|spider|headlesschrome|facebookexternalhit|slurp)\b|bot\//i;
const linkPreview = /(?:bot|crawler|spider|headlesschrome|facebookexternalhit|slurp|whatsapp|skypeuripreview)/i;
const speculative = /\b(?:prefetch|prerender|preview)\b/i;
const qrPath = '/qr/comic-con';
const qrCounter = 'qr-comic-con';
const day = 86_400_000;
const deviceTypes = new Set(['phone', 'tablet', 'computer', 'other']);

export function classifyDevice(agent) {
  if (/ipad|tablet|kindle|silk|android(?!.*mobile)/i.test(agent)) return 'tablet';
  if (/mobile|iphone|ipod|windows phone/i.test(agent)) return 'phone';
  if (/windows nt|macintosh|x11|cros|linux x86/i.test(agent)) return 'computer';
  return 'other';
}

function dayKey(time = Date.now()) {
  return new Date(time).toISOString().slice(0, 10);
}

function countryCode(code) {
  return /^[A-Z]{2}$/.test(code ?? '') && !['XX', 'T1'].includes(code) ? code : 'unknown';
}

function cors(origin) {
  return { 'Access-Control-Allow-Origin': origin, 'Cache-Control': 'no-store', 'Vary': 'Origin' };
}

async function keyMatches(header, expected) {
  const supplied = header?.match(/^Bearer ([\w-]{32,128})$/)?.[1];
  if (!supplied || !expected || !/^[\w-]{32,128}$/.test(expected)) return false;
  const encoder = new TextEncoder();
  const [received, secret] = await Promise.all([supplied, expected].map(async value => new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(value)))));
  let difference = 0;
  for (let i = 0; i < received.length; i++) difference |= received[i] ^ secret[i];
  return difference === 0;
}

async function recordQrOpen(env) {
  try {
    await env.COUNTER.getByName(qrCounter).recordQrOpen();
  } catch {
    // The redirect remains available when recording fails.
  }
}

function handleQrRedirect(request, env, ctx) {
  const headers = { 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' };
  if (!['GET', 'HEAD'].includes(request.method)) {
    return new Response(null, { status: 405, headers: { ...headers, Allow: 'GET, HEAD' } });
  }
  const agent = request.headers.get('User-Agent');
  if (request.method === 'GET' && agent && !linkPreview.test(agent)
    && !speculative.test(request.headers.get('Sec-Purpose') ?? '')
    && !speculative.test(request.headers.get('Purpose') ?? '')
    && request.headers.get('Sec-GPC') !== '1' && request.headers.get('DNT') !== '1') {
    ctx.waitUntil(recordQrOpen(env));
  }
  return new Response(null, { status: 302, headers: { ...headers, Location: 'https://5do12.de/' } });
}

export async function handleRequest(request, env, ctx) {
  const path = new URL(request.url).pathname;
  if (path === qrPath || path === `${qrPath}/`) return handleQrRedirect(request, env, ctx);
  const origin = request.headers.get('Origin');
  const qrStats = path === `${qrPath}/stats`;
  if (!origins.has(origin) && !(qrStats && origin === null)) return new Response(null, { status: 403 });
  const headers = origin ? cors(origin) : { 'Cache-Control': 'no-store' };
  const stats = path === '/stats' || qrStats;
  if (!stats && path !== '/view') return new Response(null, { status: 404, headers });

  if (request.method === 'OPTIONS' && stats) {
    return new Response(null, { status: 204, headers: {
      ...headers,
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Authorization',
      'Access-Control-Max-Age': '600',
    } });
  }
  if (request.method !== (stats ? 'GET' : 'POST')) return new Response(null, { status: 405, headers });
  if (stats && !await keyMatches(request.headers.get('Authorization'), env.VISIT_OWNER_KEY)) {
    return new Response(null, { status: 401, headers });
  }

  if (qrStats) {
    const total = await env.COUNTER.getByName(qrCounter).readQrCount();
    return Response.json({ total }, { headers });
  }
  const counter = env.COUNTER.getByName('site');
  if (stats) return Response.json(await counter.readCounts(), { headers });

  const agent = request.headers.get('User-Agent') ?? '';
  if (bot.test(agent) || request.headers.get('Sec-GPC') === '1' || request.headers.get('DNT') === '1') {
    return new Response(null, { status: 204, headers });
  }
  await counter.record(countryCode(request.cf?.country), classifyDevice(agent));
  return new Response(null, { status: 204, headers });
}

const addBucket = `INSERT INTO daily_counts (day, dimension, label, opens) VALUES (?, ?, ?, 1)
  ON CONFLICT (day, dimension, label) DO UPDATE SET opens = opens + 1`;
const addLifetime = 'INSERT INTO lifetime VALUES (1, 1) ON CONFLICT (id) DO UPDATE SET opens = opens + 1';

export class VisitStorage {
  constructor(storage) {
    this.storage = storage;
    this.sql = storage.sql;
    this.sql.exec(`CREATE TABLE IF NOT EXISTS daily_counts (
      day TEXT NOT NULL, dimension TEXT NOT NULL, label TEXT NOT NULL, opens INTEGER NOT NULL,
      PRIMARY KEY (day, dimension, label)) WITHOUT ROWID`);
    this.sql.exec('CREATE TABLE IF NOT EXISTS lifetime (id INTEGER PRIMARY KEY CHECK (id = 1), opens INTEGER NOT NULL)');
  }

  record(country, device, now = Date.now()) {
    const date = dayKey(now);
    this.storage.transactionSync(() => {
      this.sql.exec(addLifetime);
      this.sql.exec(addBucket, date, 'country', countryCode(country));
      this.sql.exec(addBucket, date, 'device', deviceTypes.has(device) ? device : 'other');
    });
  }

  recordQrOpen() {
    this.sql.exec(addLifetime);
  }

  readTotal() {
    return this.sql.exec('SELECT COALESCE(SUM(opens), 0) AS opens FROM lifetime').one().opens;
  }

  readCounts(now = Date.now()) {
    const from = dayKey(now - 29 * day);
    const total = this.readTotal();
    const today = this.sql.exec(`SELECT COALESCE(SUM(opens), 0) AS opens FROM daily_counts
      WHERE day = ? AND dimension = 'device'`, dayKey(now)).one().opens;
    const grouped = dimension => this.sql.exec(`SELECT label, SUM(opens) AS opens FROM daily_counts
      WHERE day >= ? AND dimension = ? GROUP BY label ORDER BY opens DESC, label`, from, dimension).toArray();
    return { total, today, countries: grouped('country'), devices: grouped('device') };
  }

  prune(now = Date.now()) {
    this.sql.exec('DELETE FROM daily_counts WHERE day < ?', dayKey(now - 89 * day));
  }
}
