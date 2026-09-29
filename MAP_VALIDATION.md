# Map release validation — 2026-09-28

## Scope

This validation covers the domestic map’s SVG load path, quarterly state transitions, city normalization, click-through behavior, responsive layout, and SVG fallback.

## Quarterly national-map checks

| Quarter | Events displayed | SVG regions | Result |
| --- | ---: | ---: | --- |
| Q1 | 0 | 17 | Passed — no Q1 source records in the bundled data |
| Q2 | 0 | 17 | Passed — no Q2 source records in the bundled data |
| Q3 | 114 | 17 | Passed |
| Q4 | 74 | 17 | Passed |

Rapid transition test (`Q1 → Q4 → Q2 → Q3 → Q4`) finished on Q4 with 74 events and the Q4 SVG map. A render ID prevents stale asynchronous SVG requests from replacing the current view.

On 2026-09-29, Q1 and Q2 were rechecked in the release candidate. Both display **data not collected** on all 17 pins, rather than implying a verified zero-event quarter. Q3 displayed 114 registered events and Q4 displayed 74. The 2027 selector showed one Q1 event and opened Gangwon → Hwacheon → the January 9 calendar entry.

## Click-through checks

| Province | City | Internal key | Selected date | Result |
| --- | --- | --- | --- | --- |
| 경기 | 고양 | 경기-고양 | 2026-10-02 | Passed |
| 부산 | 부산 | 부산 | 2026-10-02 | Passed |
| 충남 | 계룡 | 충남-계룡 | 2026-10-01 | Passed |
| 경북 | 경주 | 경북-경주 | 2026-10-09 | Passed |
| 제주 | 서귀포 | 제주-서귀포 | 2026-10-23 | Passed |

## City-name exception checks

`city-normalization.js` was tested for regional variants and source-data exceptions. For example, `경기 수원시` and `경기도 수원시` normalize to the same internal key, while `광주 동구` keeps the display label `광주 동구` and never collapses to `동`.

## Fallback and diagnostics

Opening the app with `?mapFallbackTest=1` intentionally simulates SVG failure. The existing simplified map remains usable, and the browser console emits a `[Event Calendar map]` warning. The same diagnostics are exposed at `window.__EVENT_CALENDAR_MAP_DIAGNOSTICS__` for support investigation.

## Responsive check

The national SVG map and controls were checked at a 390px-wide mobile viewport. The map, legend, and region controls remain visible and selectable.

## Label-collision regression check — 2026-09-29

Province geometry, marker coordinates, and labels are now separate values. The Seoul–Incheon–Gyeonggi, Sejong–Daejeon–Chungnam, and Gwangju–Jeonnam clusters use offset markers with connector lines. Jeju uses an above-marker label, so its name remains inside the SVG viewBox. Visual desktop verification and a Jeju marker click-through both passed.

## Regional zoom check — 2026-09-29

Selecting a province now recalculates the SVG viewBox from that province’s actual bounds with safe padding. The selected region fills the map panel instead of appearing as a small shape inside the national canvas. City markers are no longer clipped to the province outline, so edge cities remain fully selectable. Gangwon → Gangneung, Jeongseon, and Hoengseong was visually verified.

## Final interaction regression — 2026-09-29

- A map pin and its white region/city label are both clickable. The white label background now receives pointer events; this fixes a dead click target discovered during Gyeongbuk → Gyeongju testing.
- Gyeonggi → Goyang, Seoul regional zoom, Gyeongbuk → Gyeongju, and Gangwon → Hwacheon (2027 Q1) reached the expected city calendar.
- The 17-province SVG fallback remained interactive with `?mapFallbackTest=1`, and a console warning was emitted.
- The global inbound screen still rendered its FX snapshot, four annual bars, four quarterly bars, and five source-market cards. Its FX validation/freshness logic was restored before release.
- Map provenance is visible in the domestic footer and recorded in `ATTRIBUTION.md`.

## Release notes

- Asset attribution and licence evidence: `ATTRIBUTION.md`
- City normalization settings and exceptions: `city-normalization.js`
- Automated normalizer regression test: `work/map-normalization.test.mjs`

