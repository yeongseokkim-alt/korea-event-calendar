/*
 * Demand Calendar stable runtime
 * Kept separate from the document so data and UI failures cannot disable navigation.
 */
(() => {
  'use strict';

  // Keep the external-news action visually recognizable while preserving the existing Naver search URL.
  const naverButtonStyle = document.createElement('style');
  naverButtonStyle.textContent = `.news-btn{gap:9px!important;margin-top:13px!important;padding:8px 12px!important;border:1px solid #03C75A!important;background:#03C75A!important;color:#fff!important;border-radius:8px!important;font-family:var(--font-agoda-he)!important;font-size:11px!important;font-weight:700!important;box-shadow:0 4px 10px rgba(3,199,90,.18)!important}.news-btn::before{display:none!important}.news-btn:hover{background:#00B64F!important;border-color:#00B64F!important;box-shadow:0 6px 14px rgba(3,199,90,.25)!important}.news-btn:focus-visible{outline:3px solid rgba(3,199,90,.28)!important;outline-offset:3px}.news-btn .naver-mark{display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:4px;background:#fff;color:#03C75A;font-family:Arial,sans-serif;font-size:13px;font-weight:900;font-style:italic;line-height:1}.news-btn .news-arrow{font-family:Arial,sans-serif;font-size:12px;font-weight:700;opacity:.9;margin-left:1px}`;
  document.head.appendChild(naverButtonStyle);
  const actionPanelStyle = document.createElement('style');
  actionPanelStyle.textContent = `.event-actions{position:relative;margin-top:16px;padding:13px 14px 12px;border:1px solid rgba(160,92,139,.42);border-radius:11px;background:linear-gradient(135deg,rgba(160,92,139,.14),rgba(123,141,216,.13))}.event-actions__eyebrow{font-family:var(--font-agoda-rg);font-size:9px;letter-spacing:.12em;color:#A05C8B;text-transform:uppercase}.event-actions__title{font-family:var(--font-agoda-he);font-size:14px;color:#222D47;margin:4px 0 3px}.event-actions__copy{font-size:10.5px;line-height:1.55;color:#334155;padding-right:20px}.event-actions__buttons{display:flex;gap:7px;flex-wrap:wrap;margin-top:10px}.event-actions__buttons a{display:inline-flex;align-items:center;justify-content:center;min-height:31px;border-radius:7px;padding:7px 10px;font-family:var(--font-agoda-he);font-size:10px;text-decoration:none}.action-ycs{background:#222D47;color:#fff}.action-ycs:hover{background:#34415d}.action-campaign{background:#fff;color:#A05C8B;border:1px solid rgba(160,92,139,.6)}.action-campaign:hover{background:#F9F5F8}.action-dismiss{position:absolute;right:8px;top:8px;width:22px;height:22px;border:0;border-radius:50%;background:transparent;color:#66736A;font-size:17px;line-height:1;cursor:pointer}.action-dismiss:hover{background:rgba(34,45,71,.08);color:#222D47}`;
  document.head.appendChild(actionPanelStyle);
  const trendFooterStyle = document.createElement('style');
  trendFooterStyle.textContent = `.ota-trend-footer{display:flex;align-items:center;justify-content:space-between;gap:16px;margin:24px 0 4px;padding:15px 17px;border:1px solid var(--line);border-radius:12px;background:linear-gradient(100deg,rgba(123,141,216,.14),rgba(160,92,139,.12))}.ota-trend-footer__eyebrow{font-family:var(--font-agoda-rg);font-size:9px;letter-spacing:.13em;color:#A05C8B;text-transform:uppercase}.ota-trend-footer__copy{font-family:var(--font-agoda-rg);font-size:10.5px;color:#334155;line-height:1.55;margin-top:3px}.ota-trend-link{display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;min-height:34px;padding:8px 12px;border-radius:8px;background:#222D47;color:#fff;text-decoration:none;font-family:var(--font-agoda-he);font-size:11px;box-shadow:0 4px 10px rgba(34,45,71,.14);transition:transform .16s ease,background .16s ease}.ota-trend-link:hover{transform:translateY(-1px);background:#34415D}.ota-trend-link:focus-visible{outline:3px solid rgba(160,92,139,.35);outline-offset:3px}@media(max-width:560px){.ota-trend-footer{align-items:flex-start;flex-direction:column}.ota-trend-link{width:100%}}`;
  document.head.appendChild(trendFooterStyle);
  const revisionStyle = document.createElement('style');
  revisionStyle.textContent = `#home{position:relative}.revision-stamp{position:absolute;top:8px;right:0;font-family:var(--font-agoda-rg);font-size:8.5px;letter-spacing:.08em;color:#66736A;text-align:right}.revision-stamp b{color:#A05C8B;font-weight:700}@media(max-width:560px){.revision-stamp{top:2px;right:4px;font-size:8px}}`;
  document.head.appendChild(revisionStyle);
  const cityReturnStyle = document.createElement('style');
  cityReturnStyle.textContent = `#detail{position:relative}.city-return{position:absolute;top:14px;right:15px;z-index:2;margin:0}.city-return .back{display:inline-flex;align-items:center;min-height:32px;padding:7px 11px;border:1px solid #222D47;border-radius:8px;background:#222D47;color:#fff;font-family:var(--font-agoda-he);font-size:10.5px;box-shadow:0 4px 10px rgba(34,45,71,.14)}.city-return .back:hover{border-color:#34415D;background:#34415D;transform:translateY(-1px)}.city-return .back:focus-visible{outline:3px solid rgba(160,92,139,.35);outline-offset:3px}@media(max-width:560px){.city-return{position:static;margin:10px 0 12px}.city-return .back{width:100%;justify-content:center}}`;
  document.head.appendChild(cityReturnStyle);
  const marketMapStyle = document.createElement('style');
  marketMapStyle.textContent = `.market-map{margin-top:18px}.market-map .market-top{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;margin-bottom:12px}.market-map .market-top h2{margin-bottom:3px}.market-map .market-lead{font-size:11px;color:#334155;line-height:1.55}.market-map .market-year{display:flex;gap:5px;flex-wrap:wrap}.market-map .market-year button{border:1px solid var(--line);background:rgba(123,141,216,.13);color:#334155;border-radius:999px;padding:5px 8px;font-family:var(--font-agoda-rg);font-size:9px;cursor:pointer}.market-map .market-year button.on{background:rgba(160,92,139,.2);border-color:#A05C8B;color:#222D47;font-weight:700}.market-map .market-grid{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(220px,.65fr);gap:14px;align-items:stretch}.market-world{background:#F7F8F6;border:1px solid var(--line);border-radius:12px;padding:10px;min-height:250px}.market-world svg{max-height:none;background:transparent;border-radius:8px}.market-land{fill:#D7EFFF;stroke:#BFCFBE;stroke-width:1}.market-dot{fill:#C94A63;stroke:#fff;stroke-width:3;cursor:pointer}.market-dot.sel{fill:#A05C8B;stroke:#222D47;stroke-width:3.5}.market-label{font-family:var(--font-agoda-rg);fill:#222D47;font-size:13px;font-weight:700;text-anchor:middle;pointer-events:none}.market-number{font-family:var(--font-agoda-rg);fill:#334155;font-size:10px;text-anchor:middle;pointer-events:none}.market-side{background:rgba(123,141,216,.12);border:1px solid var(--line);border-radius:12px;padding:14px}.market-side h3{font-family:var(--font-agoda-he);font-size:20px;margin:2px 0 4px;color:#222D47}.market-period{font-family:var(--font-agoda-rg);font-size:10px;color:#66736A}.market-value{font-family:var(--font-agoda-he);font-size:28px;color:#C94A63;margin:16px 0 5px}.market-note{font-size:10.5px;color:#334155;line-height:1.6;margin-top:10px}.market-series{margin-top:14px;border-top:1px solid var(--line);padding-top:9px}.market-series div{display:flex;justify-content:space-between;gap:10px;padding:4px 0;font-family:var(--font-agoda-rg);font-size:10px;color:#334155}.market-series b{color:#222D47}.market-source{margin-top:11px;font-family:var(--font-agoda-rg);font-size:9px;line-height:1.6;color:#66736A}.market-source a{color:#5A6FD0}.market-unavailable{font-size:11px;color:#66736A;text-align:center;padding:12px}@media(max-width:760px){.market-map .market-top{display:block}.market-map .market-year{margin-top:10px}.market-map .market-grid{grid-template-columns:1fr}.market-world{min-height:210px}}`;
  document.head.appendChild(marketMapStyle);
  const marketBoardStyle = document.createElement('style');
  marketBoardStyle.textContent = `.market-board{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px}.market-card{min-width:0;background:linear-gradient(180deg,#FFFFFF 0%,#F4F6FC 100%);border:1px solid #C8D1E5;border-radius:12px;padding:13px;cursor:pointer;transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease}.market-card:hover{transform:translateY(-3px);box-shadow:0 10px 20px rgba(34,45,71,.10);border-color:#7B8DD8}.market-card.sel{border:2px solid #A05C8B;padding:12px;box-shadow:0 8px 18px rgba(160,92,139,.14)}.market-card-top{display:flex;align-items:center;justify-content:space-between;gap:8px}.market-flag{width:28px;height:19px;object-fit:cover;border-radius:4px;box-shadow:0 1px 4px rgba(34,45,71,.2)}.market-rank{font-family:var(--font-agoda-rg);font-size:9px;letter-spacing:.12em;color:#7B8DD8}.market-card h3{margin:11px 0 3px;font-family:var(--font-agoda-he);font-size:17px;color:#222D47}.market-card-value{font-family:var(--font-agoda-he);font-size:20px;color:#C94A63;letter-spacing:-.02em}.market-card-meta{font-family:var(--font-agoda-rg);font-size:9px;color:#66736A;margin-top:3px}.market-growth{font-family:var(--font-agoda-rg);font-size:10px;color:#A05C8B;margin:8px 0 10px;font-weight:700}.market-bars{display:flex;gap:4px;align-items:flex-end;height:31px;border-bottom:1px solid #D5DCEB;padding-bottom:3px}.market-bars i{display:block;flex:1;min-width:0;border-radius:3px 3px 1px 1px;background:#B7C2E8}.market-bars i:last-child{background:#C94A63}.market-years{display:flex;justify-content:space-between;font-family:var(--font-agoda-rg);font-size:8px;color:#7B8DD8;margin-top:5px}.market-insight{display:grid;grid-template-columns:1fr auto;gap:12px;align-items:center;margin-top:13px;padding:13px 15px;background:linear-gradient(90deg,rgba(160,92,139,.15),rgba(123,141,216,.11));border:1px solid #C8D1E5;border-radius:12px}.market-insight-title{font-family:var(--font-agoda-he);font-size:18px;color:#222D47}.market-insight-copy{font-size:10.5px;color:#334155;line-height:1.6;margin-top:3px}.market-insight-stats{display:flex;gap:15px}.market-insight-stats div{font-family:var(--font-agoda-rg);font-size:9px;color:#66736A}.market-insight-stats b{display:block;font-family:var(--font-agoda-he);font-size:16px;color:#C94A63;margin-top:2px}@media(max-width:850px){.market-board{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:560px){.market-board{grid-template-columns:repeat(2,minmax(0,1fr))}.market-insight{grid-template-columns:1fr}.market-insight-stats{justify-content:flex-start}}`;
  document.head.appendChild(marketBoardStyle);

  const $ = (s) => document.querySelector(s);
  const APP_REVISION = '2026.08.12';
  const revisionStamp = document.createElement('div');
  revisionStamp.className = 'revision-stamp';
  revisionStamp.innerHTML = `LAST UPDATED · <b>${APP_REVISION}</b>`;
  $('#home').appendChild(revisionStamp);
  const trendFooter = document.createElement('footer');
  trendFooter.className = 'ota-trend-footer';
  trendFooter.innerHTML = `<div><div class="ota-trend-footer__eyebrow">Partner insights</div><div class="ota-trend-footer__copy">글로벌 OTA·여행 시장 인사이트와 파트너 운영 팁을 확인하세요.</div></div><a class="ota-trend-link" href="https://partnerhub.agoda.com/ko-kr/news-insights/" target="_blank" rel="noopener">OTA 최신 트렌드 ↗</a>`;
  document.querySelector('.shell').appendChild(trendFooter);
  const rows = Array.isArray(window.MASTER_EVENT_ROWS) ? window.MASTER_EVENT_ROWS : [];
  const regions = ['서울','인천','경기','강원','충북','충남','세종','대전','전북','전남','광주','경북','대구','경남','울산','부산','제주'];
  const cityToRegion = {
    서울:'서울',인천:'인천',부산:'부산',대구:'대구',광주:'광주',대전:'대전',울산:'울산',세종:'세종',제주:'제주',
    수원:'경기',고양:'경기',용인:'경기',성남:'경기',화성:'경기',평택:'경기',김포:'경기',파주:'경기',가평:'경기',의정부:'경기',
    춘천:'강원',강릉:'강원',속초:'강원',원주:'강원',평창:'강원',횡성:'강원',정선:'강원',양양:'강원',인제:'강원',
    청주:'충북',충주:'충북',제천:'충북',괴산:'충북',음성:'충북',영동:'충북',단양:'충북',진천:'충북',
    천안:'충남',공주:'충남',보령:'충남',아산:'충남',서산:'충남',당진:'충남',청양:'충남',태안:'충남',계룡:'충남',
    전주:'전북',군산:'전북',익산:'전북',남원:'전북',김제:'전북',정읍:'전북',무주:'전북',고창:'전북',부안:'전북',
    여수:'전남',순천:'전남',목포:'전남',나주:'전남',광양:'전남',담양:'전남',해남:'전남',완도:'전남',진도:'전남',
    포항:'경북',경주:'경북',안동:'경북',구미:'경북',김천:'경북',영주:'경북',울진:'경북',봉화:'경북',상주:'경북',영덕:'경북',
    창원:'경남',진주:'경남',통영:'경남',거제:'경남',김해:'경남',양산:'경남',사천:'경남',밀양:'경남',합천:'경남',거창:'경남'
  };
  const regionPos = {인천:[92,105],서울:[158,101],경기:[188,122],강원:[284,108],충남:[126,190],세종:[166,189],충북:[207,181],대전:[187,211],전북:[174,253],전남:[136,338],광주:[157,313],경북:[282,215],대구:[272,257],경남:[264,316],울산:[314,295],부산:[302,340],제주:[132,455]};
  const shape = 'M82,92 L101,70 L124,56 L150,49 L177,52 L197,45 L219,47 L244,55 L265,68 L278,84 L283,105 L279,126 L272,148 L272,171 L280,192 L283,216 L278,241 L273,266 L266,291 L256,316 L243,340 L228,361 L208,377 L185,389 L165,402 L150,422 L136,442 L119,452 L101,449 L92,432 L92,406 L85,382 L73,361 L63,338 L57,313 L52,286 L54,259 L58,232 L59,205 L55,181 L53,154 L58,130 L68,111 Z';
  const inbound = [
    {q:1,code:'cn',country:'중국',name:'춘절',date:'02/17–02/23',pax:'추정 62만',signal:'방한 수요 점검',note:'중화권 최대 명절. 서울·제주 중심의 장거리 예약 흐름을 점검합니다.'},
    {q:1,code:'tw',country:'대만',name:'춘절',date:'02/16–02/22',pax:'추정 11만',signal:'방한 수요 점검',note:'중국 춘절과 겹치는 단거리 방한 수요 구간입니다.'},
    {q:2,code:'jp',country:'일본',name:'골든위크',date:'04/29–05/06',pax:'추정 44만',signal:'방한 수요 점검',note:'일본 최대 연휴. 서울·부산의 항공 좌석과 주말 재고를 우선 점검합니다.'},
    {q:2,code:'cn',country:'중국',name:'노동절',date:'05/01–05/05',pax:'추정 28만',signal:'방한 수요 점검',note:'중화권 단거리 여행 수요가 높아지는 기간입니다.'},
    {q:2,code:'th',country:'태국',name:'송크란',date:'04/13–04/15',pax:'추정 7만',signal:'방한 수요 점검',note:'방한 단거리 휴가 수요와 항공 운임을 함께 확인합니다.'},
    {q:3,code:'jp',country:'일본',name:'바다의 날',date:'07/20',pax:'추정 8만',signal:'방한 수요 점검',note:'여름 성수기 직전의 일본발 주말 수요 신호입니다.'},
    {q:3,code:'jp',country:'일본',name:'산의 날',date:'08/11',pax:'추정 9만',signal:'방한 수요 점검',note:'오봉 연휴와 인접해 방한 단거리 수요를 점검할 시점입니다.'},
    {q:3,code:'vn',country:'베트남',name:'국경절',date:'09/02',pax:'추정 6만',signal:'방한 수요 점검',note:'동남아 주요 시장의 단거리 여행 수요를 점검합니다.'},
    {q:4,code:'cn',country:'중국',name:'국경절·골든위크',date:'10/01–10/07',pax:'추정 65만',signal:'방한 수요 점검',note:'중국 골든위크에 해당하는 대표 장기연휴로, 한국행 여행 수요를 우선 점검하는 기간입니다.'},
    {q:4,code:'jp',country:'일본',name:'스포츠의 날',date:'10/12',pax:'추정 7만',signal:'방한 수요 점검',note:'가을 주말 수요와 서울·부산 객실 재고를 확인합니다.'},
    {q:4,code:'th',country:'태국',name:'국왕 탄신일',date:'12/05',pax:'추정 5만',signal:'방한 수요 점검',note:'연말 단거리 방한 수요의 선행 신호입니다.'}
  ];
  const totals = {2023:11031,2024:16370,2025:18940,2026:21800};
  const quarterTotals = {
    1:{2023:2300,2024:3300,2025:3900,2026:4600},
    2:{2023:2700,2024:4000,2025:4600,2026:5300},
    3:{2023:3000,2024:4500,2025:5200,2026:5900},
    4:{2023:3031,2024:4570,2025:5240,2026:6000}
  };
  // Korea Tourism Organization (KTO) Korean Tourism Statistics. Values are visitor arrivals,
  // not bookings or accommodation nights. Only annual confirmed values are shown.
  const inboundMarketMap = {
    source:'한국관광공사 한국관광통계 (법무부 출입국 통계 기반)',
    sourceUrl:'https://kto.visitkorea.or.kr/coding/popup/popKosisSummary.jsp',
    updated:'2026-01-30',
    markets:[
      {code:'cn',country:'중국',x:639,y:146}, {code:'jp',country:'일본',x:743,y:146},
      {code:'tw',country:'대만',x:693,y:193}, {code:'us',country:'미국',x:184,y:148},
      {code:'hk',country:'홍콩',x:659,y:193}
    ],
    years:{
      2023:{label:'2023 확정',period:'1–12월',total:11032000,values:{cn:2019000,jp:2316000,tw:961000,us:1086000,hk:404000}},
      2024:{label:'2024 확정',period:'1–12월',total:16370000,values:{cn:4603000,jp:3224000,tw:1474000,us:1320000,hk:571000}},
      2025:{label:'2025 확정',period:'1–12월',total:18936562,values:{cn:5480969,jp:3653137,tw:1891414,us:1483240,hk:623149}}
    }
  };
  const APP_YEAR = 2026;
  const state = {view:'home',q:4,region:null,city:null,date:'',eventId:'',globalKey:'',marketYear:2025,marketCode:'cn',fx:{rate:1421.16,chg:-0.51,asOf:'2026-08-11',note:'USD/KRW 변동 참고 — 출발국 통화별 체감 환율은 별도 확인 필요'}};

  const text = (v) => String(v || '').trim();
  const esc = (v) => text(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const city = (r) => text(r['개최 도시']).replace(/(특별자치도|광역시|특별시|시|군|구)$/,'');
  function region(r) {
    const source = text(r['영향 권역']).split(/[·,\\/]/)[0].trim().replace(/(특별자치도|광역시|특별시|도)$/,'');
    return regions.includes(source) ? source : (cityToRegion[city(r)] || regions.find(n => city(r).includes(n)) || '기타');
  }
  function month(r) { const m = text(r['시작일']).match(/(?:\d{4}[-./])?(\d{1,2})[-./]\d{1,2}/); return m ? +m[1] : 0; }
  function endMonth(r) { const m = text(r['종료일']).match(/(?:\d{4}[-./])?(\d{1,2})[-./]\d{1,2}/); return m ? +m[1] : month(r); }
  const hasValidDate = (r) => /^2026-\d{2}-\d{2}$/.test(dateKey(r['시작일']));
  const domestic = () => rows.filter(r => hasValidDate(r) && city(r) && region(r) !== '기타');
  const quarterMonths = (q) => [q * 3 - 2, q * 3 - 1, q * 3];
  const inQuarter = (r,q=state.q) => month(r) <= q * 3 && endMonth(r) >= q * 3 - 2;
  const dateKey = (v) => { const m=text(v).match(/(\d{4})[-./](\d{1,2})[-./](\d{1,2})/); return m ? `${m[1]}-${m[2].padStart(2,'0')}-${m[3].padStart(2,'0')}` : ''; };
  const start = (r) => dateKey(r['시작일']);
  const end = (r) => dateKey(r['종료일']) || start(r);
  const includesDate = (r,key) => start(r) <= key && end(r) >= key;
  const eventById = (id) => rows.find(r => text(r['Event ID']) === id);
  const displayDate = (v) => { const k=dateKey(v); return k ? `${k.slice(5,7)}/${k.slice(8,10)}` : (text(v) || '일정 확인 중'); };
  function impact(r) {
    const raw=text(r['Impact level']);
    if(!raw) return '수요 영향 미산정';
    if(/high/i.test(raw)) return '수요 높음';
    if(/medium|mid/i.test(raw)) return '수요 보통';
    if(/low/i.test(raw)) return '수요 낮음';
    return raw;
  }
  function size(r) {
    const s=text(r['규모 수치']);
    if(!s || s.length > 70) return '확인 중';
    const numbers=[...s.matchAll(/\d{1,3}(?:,\d{3})+|\d+/g)].map(m=>Number(m[0].replace(/,/g,'')));
    if(numbers.some(n=>n>3000000)) return '확인 중';
    return s;
  }
  function adr(r) { const n=Number(String(r['ADR 상승율(YoY)']||'').replace(/[^0-9.-]/g,'')); return Number.isFinite(n) && n > 0 ? `<span class="adr-badge"><span class="adr-label">ADR 예상 추정치</span><strong>+${Math.round(n)}%</strong></span>` : ''; }
  function show(view) { state.view=view; $('#home').style.display=view==='home'?'flex':'none'; $('#global').style.display=view==='global'?'block':'none'; $('#domestic').style.display=view==='domestic'?'block':'none'; if(view==='global') renderGlobal(); if(view==='domestic') renderDomestic(); window.scrollTo({top:0,behavior:'instant'}); }
  function card(r, active=false) { const status=text(r['정보 상태']); return `<article class="ev ${active?'active ':''}${impact(r)==='수요 높음'?'hot':'warm'}" data-event="${esc(r['Event ID'])}" role="button" tabindex="0"><div class="ed">${displayDate(r['시작일'])}–${displayDate(r['종료일'])} · ${esc(city(r))}${status?` · ${esc(status)}`:''}</div><div class="en">${esc(r['행사명'])}${adr(r)}</div><div class="ep"><b>${esc(impact(r))}</b> · 규모 정보: ${esc(size(r))}</div><div class="em">${esc(r['수요 영향 근거'])}</div></article>`; }
  function activate(el, fn) { el.addEventListener('click',fn); el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();fn();}}); }
  function bindEvents(root) { root.querySelectorAll('[data-event]').forEach(el => activate(el, () => openModal(eventById(el.dataset.event)))); }
  function openModal(r) {
    if(!r) return;
    $('#eventModalContent').innerHTML=`<div class="event-detail"><div class="title">${esc(r['행사명'])}${adr(r)}</div><div class="sub">${esc(city(r))} · ${displayDate(r['시작일'])}–${displayDate(r['종료일'])}</div><div class="kv"><div class="k">수요 영향도</div><div class="v impact">${esc(impact(r))}</div><div class="k">규모 정보</div><div class="v">${esc(size(r))}</div><div class="k">일정</div><div class="v">${esc(text(r['시작일']))} ~ ${esc(text(r['종료일']))}</div><div class="k">지역</div><div class="v">${esc(city(r))} / ${esc(region(r))}</div><div class="k">수요 신호 근거</div><div class="v">${esc(r['수요 영향 근거'])}</div></div><a class="news-btn" target="_blank" rel="noopener" href="https://search.naver.com/search.naver?where=news&query=${encodeURIComponent(text(r['행사명']))}" aria-label="${esc(r['행사명'])} 네이버 뉴스 검색 결과 열기"><span class="naver-mark" aria-hidden="true">N</span><span>네이버 뉴스 검색</span><span class="news-arrow" aria-hidden="true">↗</span></a></div>`;
    const detail = $('#eventModalContent .event-detail');
    detail.insertAdjacentHTML('beforeend', `<section class="event-actions" aria-label="추천 액션"><button type="button" class="action-dismiss" aria-label="추천 액션 닫기">×</button><div class="event-actions__eyebrow">추천 액션</div><div class="event-actions__title">행사 기간 운영 준비</div><div class="event-actions__copy">가격·재고를 점검하거나 현재 참여 가능한 Agoda 캠페인을 확인하세요.</div><div class="event-actions__buttons"><a class="action-ycs" href="https://ycs.agoda.com/mldc/en-us/public/login" target="_blank" rel="noopener">가격·재고 점검 ↗</a><a class="action-campaign" href="https://partnerhub.agoda.com/ko-kr/agodas-mega-sale/" target="_blank" rel="noopener">참여 가능한 캠페인 보기 ↗</a></div></section>`);
    detail.querySelector('.action-dismiss').addEventListener('click', e => e.currentTarget.closest('.event-actions').remove());
    $('#eventModal').classList.add('show');
  }

  async function loadFx() { try { const res=await fetch('./fx.json',{cache:'no-store'}); if(res.ok) state.fx={...state.fx,...await res.json()}; } catch (_) {} }
  function renderFx() { const f=state.fx, up=f.chg>=0, stamp=text(f.updatedAt||f.asOf); $('#fxrow').innerHTML=`<div class="fxbox"><div class="fxl">USD/KRW · ${esc(f.asOf)} 기준</div><div class="fxv">${Number(f.rate).toLocaleString()}</div><div class="fxd ${up?'up':'down'}">${up?'▲':'▼'} ${Math.abs(Number(f.chg)).toFixed(2)}%</div><div class="fxread">${esc(f.note)}<br>출처: ${esc(f.source||'로컬 기준값')} · 최종 갱신: ${esc(stamp)}</div></div>`; }
  function renderBars() { const max=Math.max(...Object.values(totals)); $('#annBars').innerHTML=Object.entries(totals).map(([year,value])=>`<div class="bcol"><div class="bval">${(value/1000).toFixed(1)}M</div><div class="bbar ${year==='2026'?'fc':''}" style="height:${Math.round(value/max*100)}%"></div><div class="blab">${year}${year==='2026'?'<span class="fcbadge">전망</span>':''}</div></div>`).join(''); $('#annNote').innerHTML='단위 백만 명 · 2023–2025: KTO 공식 통계 참조 · 2026: 운영용 전망 참고치(추정, 기준일 2026-08-11)'; }
  function renderQuarterBars() {
    const values=quarterTotals[state.q], max=Math.max(...Object.values(values));
    $('#chartTitle').textContent=`Q${state.q} 방한 외국인 입국 추이 · 전망`;
    $('#bars').innerHTML=Object.entries(values).map(([year,value])=>`<div class="bcol"><div class="bval">${(value/1000).toFixed(1)}M</div><div class="bbar ${year==='2026'?'fc':''}" style="height:${Math.round(value/max*100)}%"></div><div class="blab">${year}${year==='2026'?'<span class="fcbadge">전망</span>':''}</div></div>`).join('');
    const yoy=((values[2026]/values[2025]-1)*100).toFixed(0);
    $('#chartNote').innerHTML=`단위 백만 명 · 분기별 값은 연간 수치를 운영 목적상 근사 배분한 참고치(추정)<br>Q${state.q} 2026 전망은 전년 동분기 대비 +${yoy}% (추정)`;
  }
  function renderGlobal() {
    renderFx(); renderBars(); renderQuarterBars();
    $('#segQ').querySelectorAll('button').forEach(b=>{b.classList.toggle('on',+b.dataset.q===state.q); b.onclick=()=>{state.q=+b.dataset.q;state.global=null;renderGlobal();};});
    const list=inbound.filter(e=>e.q===state.q);
    $('#qsum').innerHTML=`<b>Q${state.q} 주요 인바운드 신호</b> — 국가별 공휴일 기반의 운영용 참고 신호입니다. 실제 수요는 예약 데이터로 확인하세요.`;
    $('#ctry').innerHTML=list.map(e=>{const key=`${e.code}-${e.name}`;return `<article class="cc ${state.globalKey===key?'sel':''}" data-global="${key}" role="button" tabindex="0"><div class="flag"><img class="flag-img" src="https://flagcdn.com/w80/${e.code}.png" alt="${e.country} 국기"><span class="flag-fallback" aria-hidden="true">${e.country.slice(0,2)}</span></div><div class="cname">${e.country}</div><div class="cev">${e.name}</div><div class="cdate">${e.date}</div><div class="cfc">${e.signal}</div><div class="cfcl">방한 수요 참고치 · ${e.pax}</div></article>`;}).join('');
    $('#ctry').querySelectorAll('[data-global]').forEach(el=>activate(el,()=>{state.globalKey=el.dataset.global;renderGlobal();}));
    const detail=$('#gdetail'), e=list.find(x=>`${x.code}-${x.name}`===state.globalKey); if(!e){detail.style.display='none';} else { detail.style.display='block'; detail.innerHTML=`<h2>행사 상세</h2><div id="dtitle"><img class="flag-detail" src="https://flagcdn.com/w80/${e.code}.png" alt="${e.country} 국기">${e.name}</div><div class="date-focus"><span>EVENT DATE</span><strong>${e.date}</strong></div><div id="dsub">${e.country} 공휴일 · 운영용 참고 신호</div><div class="about">${e.note}</div><div class="kpi"><div class="kbox"><div class="kl">수요 신호</div><div class="kv" style="color:var(--hot)">${e.signal}</div></div><div class="kbox"><div class="kl">방한 수요 참고치</div><div class="kv">${e.pax}</div></div></div><div class="act"><span class="al">권장 조치</span>해당 국가발 예약 리드타임·재고·가격을 확인하세요. 실제 수요는 예약 데이터로 검증하세요.</div>`; }
    renderInboundMarketMap();
  }

  function marketValue(value) { return Number.isFinite(value) ? `${Math.round(value / 1000).toLocaleString()}천 명` : '공식 세부값 미공표'; }
  function renderInboundMarketMap() {
    let host=$('#inboundMarketMap');
    if(!host){ $('#gdetail').insertAdjacentHTML('afterend','<section id="inboundMarketMap" class="card k-chart market-map" data-kind="Map"></section>'); host=$('#inboundMarketMap'); }
    const year=inboundMarketMap.years[state.marketYear] || inboundMarketMap.years[2025];
    const current=inboundMarketMap.markets.find(m=>m.code===state.marketCode) || inboundMarketMap.markets[0];
    const currentValue=year.values[current.code];
    const years=Object.entries(inboundMarketMap.years);
    const max=Math.max(...years.flatMap(([,item])=>Object.values(item.values)));
    const rank=[...inboundMarketMap.markets].sort((a,b)=>year.values[b.code]-year.values[a.code]);
    const previous=inboundMarketMap.years[state.marketYear-1];
    const growth=previous ? (year.values[current.code]/previous.values[current.code]-1)*100 : null;
    host.innerHTML=`<div class="market-top"><div><h2>주요 방한 출발시장 포트폴리오</h2><div class="market-lead">호텔 운영 우선순위를 위한 국가별 규모·성장·구성비 비교 보드입니다.</div></div><div class="market-year" id="marketYear">${years.map(([key,item])=>`<button data-market-year="${key}" class="${+key===state.marketYear?'on':''}">${item.label}</button>`).join('')}</div></div><div class="market-board">${rank.map((m,i)=>{const value=year.values[m.code],change=previous?(value/previous.values[m.code]-1)*100:null;return `<article class="market-card ${current.code===m.code?'sel':''}" data-market="${m.code}" role="button" tabindex="0"><div class="market-card-top"><img class="market-flag" src="https://flagcdn.com/w80/${m.code}.png" alt="${m.country} 국기"><span class="market-rank">TOP ${String(i+1).padStart(2,'0')}</span></div><h3>${m.country}</h3><div class="market-card-value">${marketValue(value)}</div><div class="market-card-meta">${year.label} · ${year.period}</div><div class="market-growth">${change===null?'3개년 비교 기준값':`${change>=0?'▲':'▼'} ${Math.abs(change).toFixed(1)}% vs ${state.marketYear-1}`}</div><div class="market-bars">${years.map(([,item])=>`<i style="height:${Math.max(7,Math.round(item.values[m.code]/max*28))}px"></i>`).join('')}</div><div class="market-years"><span>23</span><span>24</span><span>25</span></div></article>`;}).join('')}</div><div class="market-insight"><div><div class="eyebrow">SELECTED MARKET</div><div class="market-insight-title">${current.country} · ${year.label}</div><div class="market-insight-copy">방한 외래객 입국 확정 실적 기준입니다. 숙박 예약·투숙객 수와는 다른 지표이며, 가격·재고 의사결정 전 실제 예약 흐름을 함께 확인하세요.</div></div><div class="market-insight-stats"><div>방한객<b>${marketValue(currentValue)}</b></div><div>전체 비중<b>${(currentValue/year.total*100).toFixed(1)}%</b></div><div>${previous?`${state.marketYear-1} 대비`:'비교 기준'}<b>${growth===null?'—':`${growth>=0?'+':''}${growth.toFixed(1)}%`}</b></div></div></div><div class="market-source">출처: <a href="${inboundMarketMap.sourceUrl}" target="_blank" rel="noopener">${inboundMarketMap.source}</a><br>2023–2025 연간 확정치만 표시합니다.</div>`;
    host.querySelectorAll('[data-market-year]').forEach(el=>activate(el,()=>{state.marketYear=+el.dataset.marketYear;renderInboundMarketMap();}));
    host.querySelectorAll('[data-market]').forEach(el=>activate(el,()=>{state.marketCode=el.dataset.market;renderInboundMarketMap();}));
  }

  function nationalMap(data) { return `<svg viewBox="0 0 420 500" aria-label="대한민국 시도 지도"><path class="silhouette" d="${shape}"/>${regions.map(n=>{const count=data.filter(r=>region(r)===n).length,p=regionPos[n]||[210,220];return `<g class="bub" data-region="${n}" role="button" tabindex="0"><circle cx="${p[0]}" cy="${p[1]}" r="${count?18:10}" fill="${count?'#C94A63':'#D7EFFF'}"/><text class="bubn" x="${p[0]}" y="${p[1]+4}">${count||''}</text><text class="bublbl" x="${p[0]}" y="${p[1]+30}">${n}</text></g>`;}).join('')}</svg>`; }
  function regionMap(data, name) {
    const cities=[...new Set(data.map(city))].sort(); const cols=Math.max(2,Math.ceil(Math.sqrt(cities.length||1)));
    return `<svg viewBox="0 0 420 500" aria-label="${name} 시군 지도"><path class="silhouette" d="${shape}"/><path class="rg focus" d="${shape}"/>${cities.map((c,i)=>{const x=120+(i%cols)*(180/Math.max(1,cols-1)),y=180+Math.floor(i/cols)*62,count=data.filter(r=>city(r)===c).length;return `<g class="bub" data-city="${esc(c)}" role="button" tabindex="0"><circle cx="${x}" cy="${y}" r="22" fill="#A05C8B"/><text class="bubn" x="${x}" y="${y+4}">${count}</text><text class="bublbl" x="${x}" y="${y+36}">${esc(c)}</text></g>`;}).join('')}</svg>`; }
  function monthCalendar(list, year, mon) {
    const first=new Date(year,mon-1,1),days=new Date(year,mon,0).getDate(); const cells=[];
    for(let i=0;i<first.getDay();i++) cells.push('<div class="day empty"></div>');
    for(let day=1;day<=days;day++){const key=`${year}-${String(mon).padStart(2,'0')}-${String(day).padStart(2,'0')}`,hits=list.filter(r=>includesDate(r,key)); cells.push(`<button class="day ${hits.length?'has':''} ${state.date===key?'sel':''}" ${hits.length?`data-date="${key}"`:''}><span class="dn">${day}</span>${hits.length?`<span class="dd">${hits.slice(0,3).map(()=>'<i class="dot hot"></i>').join('')}</span>`:''}</button>`);}
    return `<section class="quarter-tile"><div class="month-head"><strong>${mon}월</strong><span>${list.filter(r=>month(r)===mon).length}건</span></div><div class="weekdays"><div>일</div><div>월</div><div>화</div><div>수</div><div>목</div><div>금</div><div>토</div></div><div class="days">${cells.join('')}</div></section>`;
  }
  function renderCity() {
    const list=domestic().filter(r=>region(r)===state.region&&city(r)===state.city), months=quarterMonths(state.q); if(!state.date) state.date=start(list.find(r=>inQuarter(r))||list[0]);
    const chosen=list.filter(r=>includesDate(r,state.date)); if(!state.eventId && chosen[0]) state.eventId=text(chosen[0]['Event ID']); const current=eventById(state.eventId)||chosen[0]||list[0];
    document.querySelector('.cols').classList.add('city-mode'); $('#maptitle').textContent=`${state.region} · ${state.city} 상세`; $('#backBtn').style.display='none'; $('#hint').textContent='날짜를 눌러 해당 날짜의 행사 정보를 확인하세요';
    $('#detail').innerHTML=`<h2>지역 상세</h2><div id="dtitle">${esc(state.city)}</div><div id="dsub">${esc(state.region)} · Q${state.q} · ${months.map(m=>`${m}월`).join('–')}</div><div class="city-return"><button class="back" id="toRegion">← ${esc(state.region)} 시·군</button></div><div class="city-layout"><div class="city-main"><div class="month-strip"><div class="month-grid">${months.map(m=>monthCalendar(list,APP_YEAR,m)).join('')}</div></div></div><aside class="city-side"><div class="event-panel cardlike"><div class="label">선택 날짜</div><div class="pick-date">${state.date.replace(/-/g,'.')}</div><div class="pick-sub">${chosen.length}건의 행사가 연결되어 있어요</div><div class="event-list">${chosen.map(r=>card(r,text(r['Event ID'])===state.eventId)).join('')||'<div class="empty-note">행사 날짜를 선택하세요.</div>'}</div></div>${current?`<div class="event-detail"><div class="title">${esc(current['행사명'])}${adr(current)}</div><div class="sub">${esc(state.city)} · ${displayDate(current['시작일'])}–${displayDate(current['종료일'])}</div><div class="kv"><div class="k">수요 영향도</div><div class="v impact">${esc(impact(current))}</div><div class="k">규모 정보</div><div class="v">${esc(size(current))}</div><div class="k">일정</div><div class="v">${esc(text(current['시작일']))} ~ ${esc(text(current['종료일']))}</div></div></div>`:''}</aside></div>`;
    activate($('#toRegion'),()=>{state.city=null;state.date='';state.eventId='';renderDomestic();}); $('#detail').querySelectorAll('[data-date]').forEach(b=>activate(b,()=>{state.date=b.dataset.date;state.eventId='';renderCity();})); bindEvents($('#detail'));
  }
  function renderDomestic() {
    $('#home').style.display='none'; $('#global').style.display='none'; $('#domestic').style.display='block';
    $('#segMonth').innerHTML=[1,2,3,4].map(q=>`<button data-q="${q}" class="${q===state.q?'on':''}">Q${q}</button>`).join(''); $('#segMonth').querySelectorAll('button').forEach(b=>b.onclick=()=>{state.q=+b.dataset.q;state.region=null;state.city=null;state.date='';renderDomestic();});
    if(state.city){ renderCity(); return; }
    document.querySelector('.cols').classList.remove('city-mode'); const qrows=domestic().filter(r=>inQuarter(r)); const shown=state.region?qrows.filter(r=>region(r)===state.region):qrows;
    $('#crumb').innerHTML=state.region?`전국 › <b>${state.region}</b>`:'전국'; $('#maptitle').textContent=state.region?`${state.region} · 시·군`:'대한민국 · 시·도'; $('#map').innerHTML=state.region?regionMap(shown,state.region):nationalMap(qrows);
    $('#map').querySelectorAll('[data-region]').forEach(el=>activate(el,()=>{state.region=el.dataset.region;renderDomestic();})); $('#map').querySelectorAll('[data-city]').forEach(el=>activate(el,()=>{state.city=el.dataset.city;state.date='';state.eventId='';renderDomestic();}));
    const pickerItems = state.region ? [...new Set(shown.map(city))].sort().map(c=>`<button class="back" data-city="${esc(c)}">${esc(c)} ${shown.filter(r=>city(r)===c).length}</button>`) : regions.map(n=>{const count=qrows.filter(r=>region(r)===n).length;return count?`<button class="back" data-region="${n}">${n} ${count}</button>`:''});
    $('#picker').innerHTML = pickerItems.join('');
    $('#picker').querySelectorAll('[data-region]').forEach(b=>activate(b,()=>{state.region=b.dataset.region;renderDomestic();})); $('#picker').querySelectorAll('[data-city]').forEach(b=>activate(b,()=>{state.city=b.dataset.city;state.date='';state.eventId='';renderDomestic();}));
    $('#backBtn').style.display=state.region?'inline-block':'none'; $('#backBtn').textContent='← 전국'; $('#backBtn').onclick=()=>{state.region=null;renderDomestic();}; $('#hint').textContent=state.region?'버블 또는 도시 버튼을 눌러 지역 상세 달력 보기':'지역을 눌러 시·군 보기';
    $('#detail').innerHTML=`<h2>지역 상세</h2><div id="dtitle">${state.region||`Q${state.q} · 전국`}</div><div id="dsub">행사 ${shown.length}건 · 분기별 수요 신호</div>${shown.slice(0,18).map(r=>card(r)).join('')||'<div class="empty-note">이 분기에는 등록된 행사가 없습니다.</div>'}`; bindEvents($('#detail'));
  }
  function init() {
    const count=domestic().length, excluded=rows.length-count; const ready=Array.isArray(window.MASTER_EVENT_ROWS) && rows.length>0;
    $('#homeEventCount').textContent=ready?`${count} events`:'unavailable';
    document.querySelectorAll('.dataStatus').forEach(el=>el.textContent=ready?`Master Event List bundle 연결됨 · 2026 국내 ${count}건 표시 · ${excluded}건 제외(일정/도시/권역 기준)`:'Master Event List bundle을 불러오지 못했습니다');
    ['gateG','gateD'].forEach(id=>{const el=$('#'+id);el.setAttribute('role','button');el.setAttribute('tabindex','0');});
    activate($('#gateG'),()=>show('global')); activate($('#gateD'),()=>show('domestic')); $('#backHome1').onclick=()=>show('home'); $('#backHome2').onclick=()=>show('home'); $('#eventModalBackdrop').onclick=()=>$('#eventModal').classList.remove('show'); $('#eventModalClose').onclick=()=>$('#eventModal').classList.remove('show'); document.addEventListener('keydown',e=>{if(e.key==='Escape')$('#eventModal').classList.remove('show');});
    loadFx().then(()=>{ if(state.view==='global') renderGlobal(); });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
