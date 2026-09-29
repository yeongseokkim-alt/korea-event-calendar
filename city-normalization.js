/*
 * City display and identity rules.
 *
 * Keep source-name aliases here rather than in rendering code.  The key is
 * used for joins and selection; label is the human-readable map label.
 */
(() => {
  'use strict';

  const regionAliases = Object.freeze({
    서울: '서울', 서울특별시: '서울',
    인천: '인천', 인천광역시: '인천',
    경기: '경기', 경기도: '경기',
    강원: '강원', 강원도: '강원', 강원특별자치도: '강원',
    충북: '충북', 충청북도: '충북',
    충남: '충남', 충청남도: '충남',
    세종: '세종', 세종특별자치시: '세종',
    대전: '대전', 대전광역시: '대전',
    전북: '전북', 전라북도: '전북', 전북특별자치도: '전북',
    전남: '전남', 전라남도: '전남',
    광주: '광주', 광주광역시: '광주',
    경북: '경북', 경상북도: '경북',
    대구: '대구', 대구광역시: '대구',
    경남: '경남', 경상남도: '경남',
    울산: '울산', 울산광역시: '울산',
    부산: '부산', 부산광역시: '부산',
    제주: '제주', 제주도: '제주', 제주특별자치도: '제주'
  });

  const cityToRegion = Object.freeze({
    서울:'서울',인천:'인천',부산:'부산',대구:'대구',광주:'광주',대전:'대전',울산:'울산',세종:'세종',제주:'제주',
    수원:'경기',고양:'경기',용인:'경기',성남:'경기',화성:'경기',평택:'경기',김포:'경기',파주:'경기',가평:'경기',의정부:'경기',안성:'경기',
    춘천:'강원',강릉:'강원',속초:'강원',원주:'강원',평창:'강원',횡성:'강원',정선:'강원',양양:'강원',인제:'강원',
    청주:'충북',충주:'충북',제천:'충북',괴산:'충북',음성:'충북',영동:'충북',단양:'충북',진천:'충북',
    천안:'충남',공주:'충남',보령:'충남',아산:'충남',서산:'충남',당진:'충남',청양:'충남',태안:'충남',계룡:'충남',
    전주:'전북',군산:'전북',익산:'전북',남원:'전북',김제:'전북',정읍:'전북',무주:'전북',고창:'전북',부안:'전북',
    여수:'전남',순천:'전남',목포:'전남',나주:'전남',광양:'전남',담양:'전남',해남:'전남',완도:'전남',진도:'전남',
    포항:'경북',경주:'경북',안동:'경북',구미:'경북',김천:'경북',영주:'경북',울진:'경북',봉화:'경북',상주:'경북',영덕:'경북',
    창원:'경남',진주:'경남',통영:'경남',거제:'경남',김해:'경남',양산:'경남',사천:'경남',밀양:'경남',합천:'경남',거창:'경남'
  });

  // Exact source-data exceptions. Add a record here when a new incoming name
  // cannot be resolved by the generic province/city rules.
  const aliases = Object.freeze({
    '경기수원시': { key:'경기-수원', label:'수원', region:'경기' },
    '경기도수원시': { key:'경기-수원', label:'수원', region:'경기' },
    '경기고양시': { key:'경기-고양', label:'고양', region:'경기' },
    '경기도고양시': { key:'경기-고양', label:'고양', region:'경기' },
    '광주광역시동구': { key:'광주-동구', label:'광주 동구', region:'광주' },
    '광주동구': { key:'광주-동구', label:'광주 동구', region:'광주' },
    '대구광역시동구': { key:'대구-동구', label:'대구 동구', region:'대구' },
    '부산광역시동구': { key:'부산-동구', label:'부산 동구', region:'부산' },
    '전남광주통합특별시장흥군': { key:'전남-장흥', label:'장흥', region:'전남' },
    '전남광주통합특별시여수시': { key:'전남-여수', label:'여수', region:'전남' },
    '전남광주통합특별시영광군': { key:'전남-영광', label:'영광', region:'전남' },
    '전남광주통합특별시목포시': { key:'전남-목포', label:'목포', region:'전남' },
    '전남광주통합특별시동구': { key:'광주-동구', label:'광주 동구', region:'광주' },
    '전남광주통합특별시서구': { key:'광주-서구', label:'광주 서구', region:'광주' },
    '제주특별자치도제주시': { key:'제주-제주', label:'제주', region:'제주' },
    '세종특별자치시': { key:'세종', label:'세종', region:'세종' }
  });

  const provinceSvgIds = Object.freeze({
    서울:'seoul', 인천:'incheon', 경기:'gyeonggi', 강원:'gangwon',
    충북:'north-chungcheong', 충남:'south-chungcheong', 세종:'sejong', 대전:'daejeon',
    전북:'north-jeolla', 전남:'south-jeolla', 광주:'gwangju',
    경북:'north-gyeongsang', 대구:'daegu', 경남:'south-gyeongsang',
    울산:'ulsan', 부산:'busan', 제주:'jeju'
  });

  const compact = (value) => String(value || '').trim().replace(/[\s·,()/]+/g, '');
  const stripAdministrativeSuffix = (value) => String(value || '').trim()
    .replace(/(특별자치시|특별자치도|광역시|특별시)$/,'')
    .replace(/(시|군)$/,'');
  const prefixEntries = Object.entries(regionAliases).sort((a, b) => b[0].length - a[0].length);

  function normalize(rawCity, rawRegion) {
    const raw = String(rawCity || '').trim();
    const sourceRegion = regionAliases[String(rawRegion || '').split(/[·,\\/]/)[0].trim()] || '';
    const normalized = compact(raw);
    if (!normalized) return { key:'', label:'', region:sourceRegion, raw };
    if (aliases[normalized]) return { ...aliases[normalized], raw };

    const prefixed = prefixEntries.find(([alias]) => normalized.startsWith(alias));
    const region = prefixed ? prefixed[1] : (sourceRegion || cityToRegion[stripAdministrativeSuffix(raw)] || '');
    let tail = prefixed ? normalized.slice(prefixed[0].length) : stripAdministrativeSuffix(raw).replace(/\s+/g, '');
    tail = tail.replace(/(특별자치시|특별자치도|광역시|특별시)$/,'').replace(/(시|군)$/,'');
    if (!tail) tail = region || stripAdministrativeSuffix(raw);

    // District labels must always retain a region prefix, preventing labels
    // such as "동" or "서" from appearing alone.
    const isDistrict = /구$/.test(tail);
    const shortName = isDistrict ? tail.replace(/구$/,'') : tail;
    const label = isDistrict && region ? `${region} ${shortName}` : shortName;
    const key = region && shortName !== region ? `${region}-${tail}` : (region || tail);
    return { key, label, region, raw };
  }

  window.CITY_NORMALIZATION_CONFIG = Object.freeze({
    version: '2026-09-28',
    aliases,
    cityToRegion,
    regionAliases,
    provinceSvgIds,
    normalize
  });
})();
