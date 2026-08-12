import assert from 'node:assert/strict';
import test from 'node:test';
import { buildFxPayload, normalizeFxPoints } from './fx-core.mjs';

const normal = { StatisticSearch: { row: [
  { TIME: '20260810', DATA_VALUE: '1,420.00' }, { TIME: '20260811', DATA_VALUE: '1,421.16' }
] } };

test('reads the ECOS StatisticSearch response and produces a safe snapshot', () => {
  const result = buildFxPayload(normal, { statCode:'731Y001', itemCode:'0000001', now:new Date('2026-08-11T10:00:00Z') });
  assert.equal(result.rate, 1421.16); assert.equal(result.chg, 0.08); assert.equal(result.asOf, '2026-08-11');
  assert.equal(result.status, 'ok'); assert.match(result.lastSuccessfulAt, /KST$/);
});
test('keeps compatibility with the legacy ECOS response wrapper', () => {
  assert.equal(normalizeFxPoints({ StatisticSearchResult: normal.StatisticSearch }).length, 2);
});
test('rejects empty and ECOS error responses before a file can be written', () => {
  assert.throws(() => normalizeFxPoints({ StatisticSearch: { row: [] } }), /Not enough valid/);
  assert.throws(() => normalizeFxPoints({ RESULT: { CODE: 'INFO-100' } }), /ECOS returned an error/);
});
test('rejects implausible rates', () => {
  assert.throws(() => normalizeFxPoints({ StatisticSearch: { row: [{ TIME:'20260810', DATA_VALUE:'1420' }, { TIME:'20260811', DATA_VALUE:'99999' }] } }), /accepted USD\/KRW range/);
});
