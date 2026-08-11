# Master Event List 업데이트 가이드

이 캘린더는 저장소 루트의 `Master Event List.csv` 파일만 읽습니다. 비개발자도 아래 순서로 갱신할 수 있습니다.

1. Google Sheets에서 **Master Event List** 탭을 열고 전체 범위를 복사합니다.
2. Excel 또는 Google Sheets에 붙여넣은 뒤, CSV UTF-8 형식으로 저장합니다.
3. 파일명은 반드시 `Master Event List.csv`로 유지합니다.
4. GitHub 저장소에서 기존 `Master Event List.csv`를 같은 이름의 새 파일로 교체하고 Commit changes를 누릅니다.
5. 1~2분 뒤 https://yeongseokkim-alt.github.io/korea-event-calendar/ 를 새로고침합니다.

## 형식 규칙

- 첫 행의 17개 컬럼명은 변경하지 않습니다.
- 필수값: `Event ID`, `행사명`, `행사 유형`, `시작일`, `종료일`, `개최 도시`.
- 날짜는 `YYYY-MM-DD` 형식으로 입력합니다.
- `Impact level`은 `High Impact`, `Medium Impact`, `Low Impact` 중 하나를 권장합니다.
- 공개 Pages를 사용하므로 이 CSV에 사내 기밀·개인정보는 넣지 않습니다.
