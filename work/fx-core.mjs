const MIN_USD_KRW = 500;
const MAX_USD_KRW = 3000;
const MAX_DAILY_CHANGE_PCT = 10;

export function extractEcosRows(payload) {
  const error = payload?.RESULT || payload?.StatisticSearch?.RESULT || payload?.StatisticSearchResult?.RESULT;
  if (error?.CODE && error.CODE !== 'INFO-000') {
    throw new Error(`ECOS returned an error (${String(error.CODE).slice(0, 40)})`);
  }
  const rows = payload?.StatisticSearch?.row || payload?.StatisticSearchResult?.row || payload?.row || [];
  return Array.isArray(rows) ? rows : [];
}

export function normalizeFxPoints(payload) {
  const points = extractEcosRows(payload)
    .map(row => ({
      time: String(row.TIME || row.time || row.TIME_CD || '').trim(),
      value: Number(String(row.DATA_VALUE ?? row.data_value ?? '').replace(/,/g, ''))
    }))
    .filter(point => /^\d{8}$/.test(point.time) && Number.isFinite(point.value))
    .sort((a, b) => a.time.localeCompare(b.time));
  if (points.length < 2) throw new Error('Not enough valid ECOS exchange-rate rows returned');
  if (points.some(point => point.value < MIN_USD_KRW || point.value > MAX_USD_KRW)) {
    throw new Error('ECOS exchange rate is outside the accepted USD/KRW range');
  }
  return points;
}

export function buildFxPayload(payload, { statCode, itemCode, now = new Date() }) {
  const points = normalizeFxPoints(payload);
  const latest = points.at(-1);
  const previous = points.at(-2);
  if (latest.time > toKstDate(now)) throw new Error('ECOS observation date is in the future');
  const changePct = Number((((latest.value - previous.value) / previous.value) * 100).toFixed(2));
  if (!Number.isFinite(changePct) || Math.abs(changePct) > MAX_DAILY_CHANGE_PCT) {
    throw new Error('ECOS day-over-day change is outside the accepted range');
  }
  return {
    rate: Number(latest.value.toFixed(2)), chg: changePct, asOf: toDisplayDate(latest.time),
    note: 'USD/KRW \ubcc0\ub3d9 \ucc38\uace0 \u2014 \ucd9c\ubc1c\uad6d \ud1b5\ud654\ubcc4 \uccb4\uac10 \ud658\uc728\u00b7\ud56d\uacf5\ub8cc\u00b7\uc608\uc57d \ucd94\uc774\ub97c \ud568\uaed8 \ud655\uc778\ud558\uc138\uc694.',
    source: 'BOK ECOS', statCode, itemCode, status: 'ok',
    lastSuccessfulAt: formatKstTimestamp(now), updatedAt: now.toISOString()
  };
}

export function toDisplayDate(time) { return /^\d{8}$/.test(time) ? `${time.slice(0, 4)}-${time.slice(4, 6)}-${time.slice(6, 8)}` : time; }
export function toKstDate(date) { return dateParts(date, { year:'numeric', month:'2-digit', day:'2-digit' }); }
export function formatKstTimestamp(date) { return `${dateParts(date, { year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', hourCycle:'h23' }, true)} KST`; }

function dateParts(date, options, includeTime = false) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul', ...options }).formatToParts(date);
  const get = type => parts.find(part => part.type === type)?.value;
  const dateValue = `${get('year')}${get('month')}${get('day')}`;
  return includeTime ? `${dateValue.slice(0,4)}-${dateValue.slice(4,6)}-${dateValue.slice(6,8)} ${get('hour')}:${get('minute')}` : dateValue;
}
