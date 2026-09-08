# 솜구름 — 홈페이지 프로토타입

아기옷부터 가족옷까지, 소재를 축으로 한 브랜드 **솜구름** 의 프리런치 사이트.
빌드 도구 없이 정적 파일만 씁니다. `index.html`을 더블클릭하면 바로 열립니다.

## 열기

파일 탐색기에서 `index.html` 더블클릭. 또는 로컬 서버로:

```powershell
py -3 -m http.server 5173      # Python
npx --yes serve -l 5173        # Node
```

→ http://localhost:5173

## 파일

```
poom/
├─ index.html        홈 — 히어로, 사이즈 전개, 라인 4종, 얼룩, 규격, 원단
├─ products.html     라인 — 4개 카드 + 가격 사다리
├─ product.html      제품 상세 — ?id= 로 품목 전환
├─ fabric.html       원단 — 조직 비교, 라인별 추천, 뺀 원단과 이유
├─ care.html         얼룩과 세탁 — 상충 설명, 응급처치, 얼룩별 대응
└─ assets/
   ├─ style.css      전체 스타일 (토큰 → 컴포넌트 순)
   └─ site.js        SVG 스프라이트 + 카탈로그 + 장바구니 + 대기자
```

제품 상세는 쿼리스트링으로 갈립니다:

- `product.html?id=sleep-set` — 슬립 세트 (첫 생산 품목)
- `product.html?id=base-inner` — 이너 · 보디수트
- `product.html?id=play-smock` — 식사 스목 (얼룩 대응 라인)
- `product.html?id=knit-out` — 니트 아우터

## 사진 넣기 (중요)

옷 그림은 전부 **SVG 일러스트**입니다 (`assets/site.js` 맨 위 `SPRITE`).
실사진이 생기면 `assets/img/` 에 아래 이름으로 넣기만 하면 **그림 대신 사진이 자동으로 뜹니다.**
파일이 없으면 조용히 일러스트가 남습니다 — 지금이 그 상태입니다.

```
assets/img/
  hero.jpg               홈 히어로
  sleep-set-1.jpg ~ -4   슬립 세트 (1번이 대표, 2~4는 썸네일)
  base-inner-1.jpg ~
  play-smock-1.jpg ~
  knit-out-1.jpg ~
  one-fabric.jpg  fabric.jpg  stain.jpg  care-card.jpg
```

권장 비율: 대표 4:3, 썸네일 1:1, 카드 4:5.

## 동작하는 것 / 안 하는 것

**동작합니다**

- 사이즈 선택 (50cm–XL 11개) — 사이즈 그룹에 따라 가격이 바뀝니다
- 컬러 스와치 — 누르면 옷 그림 색이 바뀝니다 (목록 카드에서도)
- 수량 조절, 장바구니 담기, 카트 드로어, 항목 삭제, 배송비 포함 합계
- 모바일 하단 고정 구매 바
- 오픈 알림 신청 + 대기자 수 카운터
- 다크/라이트 자동 전환, 모바일 반응형

**안 합니다** — 프로토타입이라 일부러 비워둔 부분

- 결제, 배송, 회원, 재고
- 서버 저장. 장바구니(`poom.cart.v1`)와 대기자(`poom.waitlist.v1`)는
  **브라우저 localStorage**에만 남습니다.

대기자 명단을 꺼내려면 콘솔(F12)에서:

```js
JSON.parse(localStorage.getItem('poom.waitlist.v1'))
```

## 고칠 때

- **가격·품목·사이즈·컬러·얼룩 등급** → `assets/site.js` 맨 위 `CATALOG` / `SIZES` / `COLORS`
- **옷 그림** → 같은 파일 `SPRITE` (viewBox 200×240, `.body`가 currentColor로 칠해짐)
- **색** → `assets/style.css` 맨 위 `:root` 토큰.
  다크 테마도 같이 고쳐야 합니다 (`prefers-color-scheme` 블록 + `[data-theme="dark"]` 블록)

브랜드 팔레트

| 이름 | 값 | 용도 |
|---|---|---|
| Cream | `#F7F3EC` | 바탕 |
| Sand | `#EFE8DD` | 패널 |
| Ink | `#23201C` | 본문·워드마크 |
| Denim | `#2E4057` | 액센트 (하나만) |

제품 컬러: 크림 `#F6F1E8` · 오트 `#E3D5BE` · 미스트 `#C9D6DF` · 세이지 `#C6D3BE` · 클레이 `#D9BCAD`

타입: Outfit(영문) / Gothic A1(국문) / IBM Plex Mono(스펙 표기).
