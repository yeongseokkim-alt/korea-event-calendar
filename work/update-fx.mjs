import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const outPath = resolve('fx.json');
const apiKey = process.env.BOK_ECOS_API_KEY;
if (!apiKey) throw new Error('BOK_ECOS_API_KEY is required');

const statCode = process.env.BOK_ECOS_STAT_CODE || '731Y001';
const itemCode = process.env.BOK_ECOS_ITEM_CODE || '0000001';
const lookbackDays = Number(process.env.BOK_ECOS_LOOKBACK_DAYS || '30');
const today = new Date();
const end = formatDate(today);
const start = formatDate(new Date(today.getTime() - lookbackDays * 86400000));
const url = `https://ecos.bok.or.kr/api/StatisticSearch/${encodeURIComponent(apiKey)}/json/kr/1/100/${statCode}/D/${start}/${end}/${itemCode}`;

const response = await fetch(url, { headers: { 'user-agent': 'Agoda-Event-Calendar/1.0' } });
if (!response.ok) throw new Error(`ECOS request failed: ${response.status}`);
const json = await response.json();
const sourceRows = json?.StatisticSearchResult?.row || json?.row || [];
const points = sourceRows.map(row => ({
  time: String(row.TIME || row.time || row.TIME_CD || '').trim(),
  value: Number(String(row.DATA_VALUE ?? row.data_value ?? '').replace(/,/g, ''))
})).filter(point => point.time && Number.isFinite(point.value)).sort((a, b) => a.time.localeCompare(b.time));
if (points.length < 2) throw new Error('Not enough ECOS exchange-rate rows returned');

const latest = points.at(-1);
const previous = points.at(-2);
const changePct = Number((((latest.value - previous.value) / previous.value) * 100).toFixed(2));
const payload = {
  rate: Number(latest.value.toFixed(2)),
  chg: changePct,
  asOf: toDisplayDate(latest.time),
  note: 'USD/KRW 변동 참고 — 출발국 통화별 체감 환율은 별도 확인 필요',
  source: 'BOK ECOS',
  statCode,
  itemCode,
  updatedAt: new Date().toISOString()
};
await writeFile(outPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}
function toDisplayDate(time) {
  return /^\d{8}$/.test(time) ? `${time.slice(0, 4)}-${time.slice(4, 6)}-${time.slice(6, 8)}` : time;
}
