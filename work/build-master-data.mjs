import fs from 'node:fs';
import vm from 'node:vm';

const sourceUrl = new URL('../Master Event List.csv', import.meta.url);
const bundleUrl = new URL('../master-data.js', import.meta.url);
const required = ['Event ID', '행사명', '행사 유형', '시작일', '종료일', '개최 도시'];

function parseCsv(input) {
  const data = input.replace(/^\uFEFF/, '');
  const records = [];
  let row = [], field = '', quoted = false;
  for (let i = 0; i < data.length; i++) {
    const char = data[i];
    if (quoted) {
      if (char === '"' && data[i + 1] === '"') { field += '"'; i++; }
      else if (char === '"') quoted = false;
      else field += char;
    } else if (char === '"') {
      if (field) throw new Error(`Unexpected quote near character ${i}`);
      quoted = true;
    } else if (char === ',') {
      row.push(field); field = '';
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && data[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.some(value => value !== '')) records.push(row);
      row = [];
    } else field += char;
  }
  if (quoted) throw new Error('CSV has an unclosed quoted field');
  if (field || row.length) { row.push(field); records.push(row); }
  const [headers, ...values] = records;
  if (!headers || headers.length !== 18 || new Set(headers).size !== headers.length || required.some(name => !headers.includes(name))) {
    throw new Error('CSV must keep the 18 unique Master Event List columns');
  }
  return values.map((cells, index) => {
    if (cells.length !== headers.length) throw new Error(`CSV row ${index + 2}: expected ${headers.length} cells, got ${cells.length}`);
    return Object.fromEntries(headers.map((header, i) => [header, cells[i]]));
  });
}

const rows = parseCsv(fs.readFileSync(sourceUrl, 'utf8'));
if (process.argv.includes('--check')) {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(bundleUrl, 'utf8'), context);
  const bundled = context.window.MASTER_EVENT_ROWS;
  if (JSON.stringify(rows) !== JSON.stringify(bundled)) {
    throw new Error(`CSV and master-data.js differ (${rows.length} CSV rows; ${bundled?.length ?? 0} bundled rows). Run node work/build-master-data.mjs.`);
  }
  console.log(`Master Event List bundle matches CSV: ${rows.length} rows`);
} else {
  const output = `// Generated from Master Event List.csv. Run node work/build-master-data.mjs after CSV updates.\nwindow.MASTER_EVENT_ROWS = ${JSON.stringify(rows, null, 2)};\nwindow.MASTER_EVENT_ROWS_COUNT = window.MASTER_EVENT_ROWS.length;\n`;
  fs.writeFileSync(bundleUrl, output, 'utf8');
  console.log(`Wrote master-data.js: ${rows.length} rows`);
}
