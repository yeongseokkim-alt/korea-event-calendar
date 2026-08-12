# Master Event List 업데이트 가이드

이 캘린더는 저장소 루트의 `Master Event List.csv` 파일만 읽습니다. 비개발자도 아래 순서로 갱신할 수 있습니다.

1. Google Sheets에서 **Master Event List** 탭을 열고 전체 범위를 복사합니다.
2. Excel 또는 Google Sheets에 붙여넣은 뒤, CSV UTF-8 형식으로 저장합니다.
3. 파일명은 반드시 `Master Event List.csv`로 유지합니다.
4. GitHub 저장소에서 기존 `Master Event List.csv`를 같은 이름의 새 파일로 교체하고 Commit changes를 누릅니다.
5. 1~2분 뒤 https://yeongseokkim-alt.github.io/korea-event-calendar/ 를 새로고침합니다.

## FX 자동 갱신

- 저장소 루트의 `fx.json` 은 한국은행 ECOS에서 받은 USD/KRW 최신값 스냅샷입니다.
- GitHub Actions가 평일 17:30 KST에 `work/update-fx.mjs` 를 실행해 이 파일을 갱신합니다.
- GitHub 저장소 `Settings → Secrets and variables → Actions` 에 `BOK_ECOS_API_KEY` 를 등록해 두어야 합니다.
- 갱신이 실패해도 기존의 마지막 정상 `fx.json` 값은 유지됩니다. 화면에서 `최종 성공 갱신` 시각을 확인하세요.
- ECOS 통계 코드·항목 코드는 워크플로에서 관리합니다. API 키·요청 URL은 코드나 로그에 기록하지 않습니다.

## 형식 규칙

- 첫 행의 17개 컬럼명은 변경하지 않습니다.
- 필수값: `Event ID`, `행사명`, `행사 유형`, `시작일`, `종료일`, `개최 도시`.
- 날짜는 `YYYY-MM-DD` 형식으로 입력합니다.
- `Impact level`은 `High Impact`, `Medium Impact`, `Low Impact` 중 하나를 권장합니다.
- 공개 Pages를 사용하므로 이 CSV에 사내 기밀·개인정보는 넣지 않습니다.
