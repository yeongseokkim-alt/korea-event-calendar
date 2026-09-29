# Master Event List 업데이트 가이드

캘린더 화면은 `master-data.js` 번들을 읽습니다. `Master Event List.csv`가 원본이지만 **CSV만 교체하면 화면은 갱신되지 않습니다.** 두 파일을 함께 갱신해야 합니다.

1. Google Sheets에서 **Master Event List** 탭을 열고 전체 범위를 복사합니다.
2. Excel 또는 Google Sheets에 붙여넣은 뒤, CSV UTF-8 형식으로 저장합니다.
3. 파일명은 반드시 `Master Event List.csv`로 유지합니다.
4. 프로젝트 폴더에서 `node work/build-master-data.mjs`를 실행해 `master-data.js`를 재생성합니다.
5. `node work/build-master-data.mjs --check`로 CSV와 번들의 1:1 일치를 검증합니다.
6. **`Master Event List.csv`와 `master-data.js`를 함께** GitHub에 반영합니다. 배포가 완료된 뒤 https://yeongseokkim-alt.github.io/korea-event-calendar/ 를 새로고침해 건수를 확인합니다.

## 연도·분기 지도 핀 집계

- 국내 캘린더의 연도 목록은 유효한 행사 시작일·종료일에서 자동 생성됩니다. 새 연도의 행사가 번들에 추가되면 해당 연도가 선택기에 나타납니다.
- 행사의 기간이 선택 연도·분기와 하루라도 겹치면 그 분기에서 1건입니다. 여러 분기에 걸치는 행사는 각 해당 분기에서 1건씩 집계합니다.
- 같은 분기·도시에 같은 `Event ID`가 중복되면 한 번만 집계합니다. 지역은 `개최 도시`를 표준화한 개최지 기준이며, 숙박 수요 `영향 권역`의 크기나 `Impact level`을 뜻하지 않습니다.
- 시·도 핀: 10건 이상 `매우 많음`, 4–9건 `많음`, 1–3건 `등록`, 0건 `등록 0건`입니다. 시·군 핀: 각각 5건 이상, 3–4건, 1–2건, 0건입니다. 현재 시·군 지도는 **행사가 등록된 도시만** 핀을 그리므로 0건 도시 핀은 표시하지 않습니다.
- 해당 분기에 유효한 행사가 한 건도 없으면 기본적으로 `데이터 미수집`(회색 `—`)으로 표시합니다. 실제 수집이 끝났고 0건으로 확정된 분기만 `app.js`의 `quarterCoverageOverrides`에 예를 들어 `'2027-Q2':'complete'`를 명시합니다. 새 행이 들어온 분기는 기본적으로 `집계 중`입니다.
- 범례의 색상은 **행사 등록 건수**의 구간이지 객실 수요나 ADR 수준이 아닙니다. 구간을 변경해야 하면 연도 간 비교에 영향이 있으므로 기준 버전과 변경 사유를 기록하고 검증 후 반영합니다.

## FX 자동 갱신

- 저장소 루트의 `fx.json` 은 한국은행 ECOS에서 받은 USD/KRW 최신값 스냅샷입니다.
- GitHub Actions가 평일 17:30 KST에 `work/update-fx.mjs` 를 실행해 이 파일을 갱신합니다.
- GitHub 저장소 `Settings → Secrets and variables → Actions` 에 `BOK_ECOS_API_KEY` 를 등록해 두어야 합니다.
- 갱신이 실패해도 기존의 마지막 정상 `fx.json` 값은 유지됩니다. 화면에서 `최종 성공 갱신` 시각을 확인하세요.
- ECOS 통계 코드·항목 코드는 워크플로에서 관리합니다. API 키·요청 URL은 코드나 로그에 기록하지 않습니다.

## 형식 규칙

- 첫 행의 18개 컬럼명은 변경하지 않습니다.
- 필수값: `Event ID`, `행사명`, `행사 유형`, `시작일`, `종료일`, `개최 도시`.
- 날짜는 `YYYY-MM-DD` 형식으로 입력합니다.
- `Impact level`은 `High Impact`, `Medium Impact`, `Low Impact` 중 하나를 권장합니다.
- 공개 Pages를 사용하므로 이 CSV에 사내 기밀·개인정보는 넣지 않습니다.
