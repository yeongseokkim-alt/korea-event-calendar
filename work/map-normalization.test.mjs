import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const context = { window: {} };
vm.runInNewContext(
  fs.readFileSync(new URL('../city-normalization.js', import.meta.url), 'utf8'),
  context,
  { filename: 'city-normalization.js' },
);

const { normalize } = context.window.CITY_NORMALIZATION_CONFIG;

const cases = [
  ['경기 수원시', '', { key: '경기-수원', label: '수원', region: '경기' }],
  ['경기도 수원시', '', { key: '경기-수원', label: '수원', region: '경기' }],
  ['광주광역시 동구', '', { key: '광주-동구', label: '광주 동구', region: '광주' }],
  ['전남광주통합특별시 장흥군', '', { key: '전남-장흥', label: '장흥', region: '전남' }],
  ['전남광주통합특별시 동구', '', { key: '광주-동구', label: '광주 동구', region: '광주' }],
];

for (const [rawCity, rawRegion, expected] of cases) {
  const actual = normalize(rawCity, rawRegion);
  assert.deepEqual(
    { key: actual.key, label: actual.label, region: actual.region },
    expected,
    rawCity,
  );
  assert.ok(!['동', '서'].includes(actual.label), `standalone district label: ${actual.label}`);
}

console.log(`City normalization: ${cases.length} cases passed`);

