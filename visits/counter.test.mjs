import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { test } from 'node:test';
import { classifyDevice, handleRequest, VisitStorage } from './counter.mjs';

function newStorage() {
  const database = new DatabaseSync(':memory:');
  return new VisitStorage({
    sql: { exec(sql, ...args) {
      const statement = database.prepare(sql);
      if (/^SELECT/.test(sql)) return { one: () => statement.get(...args), toArray: () => statement.all(...args).map(row => ({ ...row })) };
      statement.run(...args);
    } },
    transactionSync(callback) {
      database.exec('BEGIN');
      try {
        callback();
        database.exec('COMMIT');
      } catch (error) {
        database.exec('ROLLBACK');
        throw error;
      }
    },
  });
}

test('coarse device types and missing data', () => {
  assert.equal(classifyDevice('Mozilla Android 14 Mobile Chrome'), 'phone');
  assert.equal(classifyDevice('Mozilla Android 14 Chrome'), 'tablet');
  assert.equal(classifyDevice('Mozilla iPad'), 'tablet');
  assert.equal(classifyDevice('Mozilla Windows NT 10.0'), 'computer');
  assert.equal(classifyDevice(''), 'other');
});

test('aggregates counts, groups 30 days, and expires old breakdowns while keeping the lifetime total', () => {
  const data = newStorage();
  const today = Date.parse('2026-11-25T12:00Z');
  data.record('DE', 'computer', today);
  data.record('DE', 'phone', today);
  data.record('US', 'phone', Date.parse('2026-11-01T07:00Z'));
  data.record('HR', 'phone', Date.parse('2026-07-21T07:00Z'));
  data.record('', 'anything', today);
  assert.deepEqual(data.readCounts(today), {
    total: 5, today: 3,
    countries: [{ label: 'DE', opens: 2 }, { label: 'US', opens: 1 }, { label: 'unknown', opens: 1 }],
    devices: [{ label: 'phone', opens: 2 }, { label: 'computer', opens: 1 }, { label: 'other', opens: 1 }],
  });
  assert.deepEqual(data.readCounts(Date.parse('2026-07-21T12:00Z')).countries.some(row => row.label === 'HR'), true);
  data.prune(today);
  assert.equal(data.readCounts(Date.parse('2026-07-21T12:00Z')).countries.some(row => row.label === 'HR'), false);
  assert.equal(data.readCounts(today).total, 5);
});

test('blocks access from other sites and requires an owner key to obtain stats', async () => {
  const database = newStorage();
  const env = { VISIT_OWNER_KEY: 'test-owner-key-for-local-checks-12345', COUNTER: { getByName: () => database } };
  async function send(path, method, headers, origin = 'https://5do12.de') {
    const request = new Request(`https://local.example${path}`, { method, headers: { Origin: origin, ...headers } });
    Object.defineProperty(request, 'cf', { value: { country: 'DE' } });
    return handleRequest(request, env);
  }
  assert.equal((await send('/view', 'POST', {}, 'https://other.example')).status, 403);
  assert.equal((await send('/view', 'GET', {})).status, 405);
  assert.equal((await send('/stats', 'GET', {})).status, 401);
  assert.equal((await send('/stats', 'GET', { Authorization: 'Bearer wrong-owner-key-for-local-check-000' })).status, 401);
  assert.equal((await send('/stats', 'OPTIONS', {})).headers.get('Access-Control-Allow-Headers'), 'Authorization');
  assert.equal((await send('/view', 'POST', { 'User-Agent': 'Googlebot/2.1' })).status, 204);
  assert.equal((await send('/view', 'POST', { 'Sec-GPC': '1' })).status, 204);
  assert.equal((await send('/view', 'POST', { 'User-Agent': 'Mozilla Android Mobile Chrome' })).status, 204);
  const response = await send('/stats', 'GET', { Authorization: `Bearer ${env.VISIT_OWNER_KEY}` });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
  assert.deepEqual(await response.json(), { total: 1, today: 1, countries: [{ label: 'DE', opens: 1 }], devices: [{ label: 'phone', opens: 1 }] });
});
