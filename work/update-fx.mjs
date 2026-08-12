import { rename, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { buildFxPayload } from './fx-core.mjs';

const outPath = resolve('fx.json');
const tempPath = `${outPath}.tmp`;
const apiKey = process.env.BOK_ECOS_API_KEY;
if (!apiKey) throw new Error('BOK_ECOS_API_KEY is required');

const statCode = process.env.BOK_ECOS_STAT_CODE || '731Y001';
const itemCode = process.env.BOK_ECOS_ITEM_CODE || '0000001';
const lookbackDays = Number(process.env.BOK_ECOS_LOOKBACK_DAYS || '30');
if (!Number.isInteger(lookbackDays) || lookbackDays < 2 || lookbackDays > 90) {
  throw new Error('BOK_ECOS_LOOKBACK_DAYS must be an integer between 2 and 90');
}

const now = new Date();
const end = formatDate(now);
const start = formatDate(new Date(now.getTime() - lookbackDays * 86400000));
const url = `https://ecos.bok.or.kr/api/StatisticSearch/${encodeURIComponent(apiKey)}/json/kr/1/100/${statCode}/D/${start}/${end}/${itemCode}`;
const response = await fetch(url, { headers: { 'user-agent': 'Agoda-Event-Calendar/1.0' } });
if (!response.ok) throw new Error(`ECOS request failed: ${response.status}`);

let json;
try { json = await response.json(); }
catch { throw new Error('ECOS returned a non-JSON response'); }

const payload = buildFxPayload(json, { statCode, itemCode, now });
await writeFile(tempPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
await rename(tempPath, outPath);
console.log(`FX snapshot refreshed: ${payload.asOf} (${payload.source})`);

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}
