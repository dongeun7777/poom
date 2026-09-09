/* ==========================================================================
   솜구름 — prototype v2
   - 옷 그림은 SVG 스프라이트(아래 SPRITE)로 그립니다. 컬러 스와치로 색이 바뀝니다.
   - assets/img/<제품id>-1.jpg 파일을 넣으면 그림 대신 그 사진을 씁니다.
   - 장바구니/대기자는 localStorage에만 저장됩니다. 서버·결제 없음.
   ========================================================================== */
(function () {
  'use strict';

  /* ====================================================== SVG 스프라이트 == */
  /* 모두 viewBox 0 0 200 240. .body 는 currentColor 로 칠해집니다.            */

  var SPRITE = [
    '<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true">',

    /* 옷을 옷감처럼 보이게 하는 두 가지.
       색면만 있으면 클립아트로 읽혀서, 위에서 아래로 그늘을 한 겹 얹고
       바닥에 그림자를 깔아 옷이 배경 위에 놓인 것처럼 만듭니다. */
    '<defs>',
      '<linearGradient id="g-shade" x1="0.12" y1="0" x2="0.62" y2="1">',
        '<stop offset="0" stop-color="#ffffff" stop-opacity=".30"/>',
        '<stop offset=".42" stop-color="#ffffff" stop-opacity="0"/>',
        '<stop offset="1" stop-color="#23201c" stop-opacity=".13"/>',
      '</linearGradient>',
      '<filter id="g-lift" x="-24%" y="-16%" width="148%" height="140%">',
        '<feDropShadow dx="0" dy="5" stdDeviation="6.5" flood-color="#23201c" flood-opacity=".17"/>',
      '</filter>',
    '</defs>',


    /* 아기 슬립수트 — 긴팔 · 긴바지 원피스형.
       production/flats/baby-sleepsuit-front.svg 와 같은 형태입니다.
       원본이 210x300 이라 200x240 스프라이트에 맞춰 0.8 로 줄여 넣습니다. */
    '<symbol id="g-sleepsuit" viewBox="0 0 200 240">',
      '<g transform="translate(16,0) scale(.8)">',
        '<path class="body" d="M78 34 Q105 51 132 34 L154 42 Q176 51 182 76 L196 148',
        ' Q198 157 189 159 L168 164 Q160 166 158 157 L148 118 L154 205 L152 260',
        ' Q151 268 143 268 L122 268 Q115 268 114 261 L105 215 L96 261',
        ' Q95 268 88 268 L67 268 Q59 268 58 260 L56 205 L62 118 L52 157',
        ' Q50 166 42 164 L21 159 Q12 157 14 148 L28 76 Q34 51 56 42 Z"/>',
        '<path class="stitch" d="M105 51 L105 215"/>',
        '<path class="stitch" d="M105 215 L122 262 M105 215 L88 262"/>',
        '<path class="seam" d="M56 46 Q48 82 62 118 L58 205"/>',
        '<path class="seam" d="M154 46 Q162 82 148 118 L152 205"/>',
        '<path class="seam" d="M20 155 L47 160 M190 155 L163 160"/>',
        '<path class="seam" d="M62 252 L100 252 M110 252 L148 252"/>',
        '<path class="seam" d="M79 37 Q105 53 131 37"/>',
        '<circle class="dot" cx="105" cy="70" r="2.8"/><circle class="dot" cx="105" cy="98" r="2.8"/>',
        '<circle class="dot" cx="105" cy="126" r="2.8"/><circle class="dot" cx="105" cy="154" r="2.8"/>',
        '<circle class="dot" cx="105" cy="182" r="2.8"/><circle class="dot" cx="105" cy="208" r="2.8"/>',
        '<circle class="dot" cx="113" cy="234" r="2.5"/><circle class="dot" cx="118" cy="256" r="2.5"/>',
        '<circle class="dot" cx="97" cy="234" r="2.5"/><circle class="dot" cx="92" cy="256" r="2.5"/>',
      '</g>',
    '</symbol>',
    /* 배냇 슬립수트 / 보디수트 */
    '<symbol id="g-bodysuit" viewBox="0 0 200 240">',
      '<path class="body" d="M76 36 Q100 52 124 36 L150 44 Q172 52 178 74 L182 96',
      ' Q183 103 176 105 L156 110 Q149 112 147 105 L143 88 L143 158',
      ' Q143 176 131 184 L119 190 Q111 194 105 188 Q100 183 95 188',
      ' Q89 194 81 190 L69 184 Q57 176 57 158 L57 88 L53 105',
      ' Q51 112 44 110 L24 105 Q17 103 18 96 L22 74 Q28 52 50 44 Z"/>',
      '<path class="stitch" d="M79 45 Q100 60 121 45"/>',
      '<path class="stitch" d="M62 176 Q100 190 138 176"/>',
      '<circle class="dot" cx="88" cy="184" r="3"/>',
      '<circle class="dot" cx="100" cy="187" r="3"/>',
      '<circle class="dot" cx="112" cy="184" r="3"/>',
          '<path class="seam" d="M60 48 Q52 76 57 92 L57 156"/>',
      '<path class="seam" d="M140 48 Q148 76 143 92 L143 156"/>',
      '<path class="seam" d="M22 104 L50 108 M178 104 L150 108"/>',
'</symbol>',

    /* 슬립 세트 상의 (긴팔) */
    '<symbol id="g-sleeptop" viewBox="0 0 200 240">',
      '<path class="body" d="M74 34 Q100 50 126 34 L152 42 Q172 50 177 70 L190 140',
      ' Q192 148 184 150 L164 155 Q157 157 155 149 L146 112 L146 196',
      ' Q146 204 138 204 L62 204 Q54 204 54 196 L54 112 L45 149',
      ' Q43 157 36 155 L16 150 Q8 148 10 140 L23 70 Q28 50 48 42 Z"/>',
      '<path class="stitch" d="M77 43 Q100 58 123 43"/>',
      '<path class="stitch" d="M58 194 L142 194"/>',
      '<path class="stitch" d="M100 52 L100 96"/>',
          '<path class="seam" d="M56 46 Q48 82 54 112 L54 200"/>',
      '<path class="seam" d="M144 46 Q152 82 146 112 L146 200"/>',
      '<path class="seam" d="M16 148 L42 152 M184 148 L158 152"/>',
      '<path class="seam" d="M58 198 L142 198"/>',
'</symbol>',

    /* 슬립 세트 하의 */
    '<symbol id="g-pants" viewBox="0 0 200 240">',
      '<path class="body" d="M58 40 L142 40 Q148 40 148 46 L146 196',
      ' Q145 204 137 204 L118 204 Q111 204 110 197 L103 120',
      ' Q100 108 97 120 L90 197 Q89 204 82 204 L63 204',
      ' Q55 204 54 196 L52 46 Q52 40 58 40 Z"/>',
      '<path class="stitch" d="M55 56 L145 56"/>',
      '<path class="stitch" d="M100 62 L100 104"/>',
          '<path class="seam" d="M53 48 L54 198"/>',
      '<path class="seam" d="M147 48 L146 198"/>',
'</symbol>',

    /* 니트 아우터 (카디건) */
    '<symbol id="g-knit" viewBox="0 0 200 240">',
      '<path class="body" d="M74 36 Q100 50 126 36 L154 44 Q176 52 180 74 L188 132',
      ' Q190 140 182 142 L162 147 Q155 149 153 141 L147 108 L147 194',
      ' Q147 202 139 202 L61 202 Q53 202 53 194 L53 108 L47 141',
      ' Q45 149 38 147 L18 142 Q10 140 12 132 L20 74 Q24 52 46 44 Z"/>',
      '<path class="stitch" d="M100 46 L100 202"/>',
      '<path class="stitch" d="M57 188 L143 188"/>',
      '<circle class="dot" cx="100" cy="84" r="3.4"/>',
      '<circle class="dot" cx="100" cy="118" r="3.4"/>',
      '<circle class="dot" cx="100" cy="152" r="3.4"/>',
          '<path class="seam" d="M56 46 Q48 80 53 108 L53 192"/>',
      '<path class="seam" d="M144 46 Q152 80 147 108 L147 192"/>',
      '<path class="seam" d="M14 138 L40 142 M186 138 L160 142"/>',
'</symbol>',

    /* 식사 스목 (긴팔, 손목 고무) */
    '<symbol id="g-smock" viewBox="0 0 200 240">',
      '<path class="body" d="M74 40 Q100 54 126 40 L150 46 Q168 52 174 70 L186 128',
      ' Q188 136 180 138 L162 143 Q155 145 153 137 L148 112 L152 202',
      ' Q153 210 145 210 L55 210 Q47 210 48 202 L52 112 L47 137',
      ' Q45 145 38 143 L20 138 Q12 136 14 128 L26 70 Q32 52 50 46 Z"/>',
      '<path class="stitch" d="M77 49 Q100 63 123 49"/>',
      '<path class="stitch" d="M156 132 L176 137 M44 132 L24 137"/>',
      '<path class="body" d="M78 150 Q78 146 82 146 L118 146 Q122 146 122 150 L122 182',
      ' Q122 186 118 186 L82 186 Q78 186 78 182 Z" opacity=".55"/>',
      '<path class="stitch" d="M78 156 L122 156"/>',
          '<path class="seam" d="M55 50 Q46 84 52 112 L52 202"/>',
      '<path class="seam" d="M145 50 Q154 84 148 112 L148 202"/>',
      '<path class="seam" d="M18 134 L42 138 M182 134 L158 138"/>',
'</symbol>',

    /* 디테일: 얼룩과 세척 */
    '<symbol id="d-stain" viewBox="0 0 200 240">',
      '<path class="body" d="M34 76 Q34 68 42 68 L158 68 Q166 68 166 76 L166 164',
      ' Q166 172 158 172 L42 172 Q34 172 34 164 Z"/>',
      '<circle class="dot" cx="76" cy="106" r="11" opacity=".55"/>',
      '<circle class="dot" cx="104" cy="126" r="6.5" opacity=".38"/>',
      '<circle class="dot" cx="122" cy="102" r="4" opacity=".26"/>',
      '<path class="stitch" d="M50 148 L150 148"/>',
    '</symbol>',

    /* 디테일: 프린트 라벨 */
    '<symbol id="d-label" viewBox="0 0 200 240">',
      '<path class="body" d="M40 70 Q40 62 48 62 L152 62 Q160 62 160 70 L160 170',
      ' Q160 178 152 178 L48 178 Q40 178 40 170 Z"/>',
      '<path class="stitch" d="M62 96 L138 96 M62 118 L120 118 M62 140 L104 140"/>',
    '</symbol>',

    /* 디테일: 플랫록 솔기 */
    '<symbol id="d-seam" viewBox="0 0 200 240">',
      '<path class="body" d="M30 92 Q30 84 38 84 L162 84 Q170 84 170 92 L170 148',
      ' Q170 156 162 156 L38 156 Q30 156 30 148 Z"/>',
      '<path class="stitch" d="M30 120 L170 120"/>',
      '<path class="stitch" d="M46 108 L54 132 M70 108 L78 132 M94 108 L102 132',
      ' M118 108 L126 132 M142 108 L150 132"/>',
    '</symbol>',

    '</svg>'
  ].join('');

  /* 위 스프라이트를 심볼 id → 내부 마크업 맵으로 풀어둡니다.
     <use> 로 참조하면 복제된 내용이 shadow DOM 안에 들어가서
     .figure .body 같은 클래스 선택자가 닿지 않습니다 (전부 검게 칠해짐).
     그래서 참조하지 않고 마크업을 그대로 심습니다. */
  var ART = (function () {
    var holder = document.createElement('div');
    holder.innerHTML = SPRITE;
    var map = {}, syms = holder.querySelectorAll('symbol');
    for (var i = 0; i < syms.length; i++) map[syms[i].id] = syms[i].innerHTML;
    return map;
  })();

  /* ============================================================ 카탈로그 == */

  var SIZES = [
    { id: '50',  group: 'baby'  }, { id: '60',  group: 'baby'  },
    { id: '70',  group: 'baby'  }, { id: '80',  group: 'baby'  },
    { id: '90',  group: 'baby'  }, { id: '100', group: 'baby'  },
    { id: '3Y',  group: 'kids'  }, { id: '6Y',  group: 'kids'  },
    { id: '10Y', group: 'kids'  },
    { id: 'S',   group: 'adult' }, { id: 'M',   group: 'adult' },
    { id: 'L',   group: 'adult' }, { id: 'XL',  group: 'adult' }
  ];

  var COLORS = [
    { id: 'cream',  name: '크림',   hex: '#F6F1E8' },
    { id: 'oat',    name: '오트',   hex: '#E3D5BE' },
    { id: 'mist',   name: '미스트', hex: '#C9D6DF' },
    { id: 'sage',   name: '세이지', hex: '#C6D3BE' },
    { id: 'clay',   name: '클레이', hex: '#D9BCAD' }
  ];

  var CATALOG = {
    'sleep-set': {
      id: 'sleep-set', cat: 'Sleep', name: '슬립웨어',
      art: 'g-sleepsuit', artAlt: ['g-sleeptop', 'd-seam', 'd-label'],
      tag: '첫 생산',
      lead: '온 가족이 같은 원단으로 잡니다.',
      desc: '몸에 따라 형태가 달라집니다. 아기는 원피스형 슬립수트 — 뒤척여도 배가 드러나지 않습니다. 어른은 슬립 상의입니다. 형태는 달라도 원단과 봉제 규격은 하나라 촉감이 똑같아요.',
      fabric: 'Cotton 95 / Spandex 5', gsm: 180, yarn: '코마사 30수 · 앞뒤 두 겹',
      finish: '가공 없음',
      wipe: { grade: '보통', note: '살에 닿는 옷이라 물 튕기는 가공을 하지 않습니다. 대신 앞뒤 두 겹으로 촘촘히 짜서 얼룩이 안쪽까지 덜 스밉니다.' },
      price: { baby: 42000, kids: 59000, adult: 89000 },
      groups: ['baby', 'kids', 'adult'],
      colors: ['cream', 'oat', 'mist', 'sage']
    },
    'base-inner': {
      id: 'base-inner', cat: 'Base', name: '이너 · 보디수트',
      art: 'g-bodysuit', artAlt: ['g-sleeptop', 'd-label', 'd-seam'],
      tag: null,
      lead: '매일 갈아입는 옷이라 제일 오래 봤습니다.',
      desc: '또 사게 되는 자리라 가장 오래 지켜본 원단만 씁니다. 목 뒤 라벨은 인쇄, 솔기는 눕혀서 박습니다. 아기 보디수트와 어른 이너가 같은 원단이에요.',
      fabric: 'Cotton 100', gsm: 160, yarn: '코마사 40수',
      finish: '가공 없음',
      wipe: { grade: '낮음', note: '물을 잘 빨아들이는 만큼 얼룩도 잘 뱁니다. 속옷이라 이건 안 바꿉니다 — 대신 겉에 스목을 걸치는 쪽을 권합니다.' },
      price: { baby: 32000, kids: 39000, adult: 59000 },
      groups: ['baby', 'kids', 'adult'],
      colors: ['cream', 'oat', 'mist']
    },
    'knit-out': {
      id: 'knit-out', cat: 'Out', name: '니트 아우터',
      art: 'g-knit', artAlt: ['g-sleeptop', 'd-seam', 'd-label'],
      tag: null,
      lead: '겉옷에도 같은 규칙을 지킵니다.',
      desc: '안감이 닿는 면에 코팅과 금속을 쓰지 않습니다. 지퍼 대신 감싸는 여밈으로 마감해서, 아이가 뒤척여도 걸리는 데가 없어요.',
      fabric: 'Wool 70 / Cotton 30', gsm: 340, yarn: '메리노 램스울',
      finish: '가공 없음',
      wipe: { grade: '보통', note: '양털에 남은 기름기 덕에 물 얼룩은 잠깐 버팁니다. 다만 바로 닦아내야 하고, 세탁은 손빨래입니다.' },
      price: { kids: 118000, adult: 158000 },
      groups: ['kids', 'adult'],
      colors: ['oat', 'clay', 'sage']
    },
    'play-smock': {
      id: 'play-smock', cat: 'Play', name: '식사 스목',
      art: 'g-smock', artAlt: ['d-stain', 'd-seam', 'g-bodysuit'],
      tag: '얼룩 대응',
      lead: '밥 먹을 때만 위에 걸치는 옷.',
      desc: '아이가 흘리는 자리는 정해져 있습니다. 가슴부터 무릎까지, 손목까지 덮습니다. 카레도 김칫국물도 안에 있는 옷까지 가지 않아요. 벗겨서 헹구고 널면 저녁 전에 마릅니다.',
      fabric: 'Recycled Poly 100', gsm: 90, yarn: '격자 짜임 · 불소 안 쓴 발수',
      finish: '불소 안 쓴 발수',
      wipe: { grade: '높음', note: '국물은 표면에 맺혀서 헹구면 떨어집니다. 기름 얼룩은 주방세제 한 방울로 문질러 주세요. 물 튕기는 힘은 세탁 30회쯤부터 약해집니다.' },
      price: { baby: 39000, kids: 49000 },
      groups: ['baby', 'kids'],
      /* 이유식을 시작하는 시점부터라 배냇 사이즈는 열지 않습니다. */
      only: ['80', '90', '100', '3Y', '6Y', '10Y'],
      colors: ['oat', 'clay', 'sage']
    }
  };

  var GROUP_LABEL = { baby: 'Baby', kids: 'Kids', adult: 'Adult' };

  /* ================================================================ 저장 == */

  var CART_KEY = 'poom.cart.v1';
  var WL_KEY = 'poom.waitlist.v1';

  function load(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return fallback;
      var v = JSON.parse(raw);
      return v == null ? fallback : v;
    } catch (e) { return fallback; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch (e) { return false; }
  }

  /* ================================================================ 유틸 == */

  var NS = 'http://www.w3.org/2000/svg';

  function money(n) { return '₩' + Number(n).toLocaleString('ko-KR'); }

  function groupOf(sizeId) {
    for (var i = 0; i < SIZES.length; i++) if (SIZES[i].id === sizeId) return SIZES[i].group;
    return null;
  }
  function priceOf(p, sizeId) {
    var g = groupOf(sizeId);
    return (g && p.price[g]) || 0;
  }
  function colorHex(id) {
    for (var i = 0; i < COLORS.length; i++) if (COLORS[i].id === id) return COLORS[i].hex;
    return COLORS[0].hex;
  }
  function colorName(id) {
    for (var i = 0; i < COLORS.length; i++) if (COLORS[i].id === id) return COLORS[i].name;
    return '';
  }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  /** 옷 그림 하나를 만듭니다. hex 는 옷 색(=currentColor). */
  function figure(symbolId, hex) {
    var s = document.createElementNS(NS, 'svg');
    s.setAttribute('class', 'figure');
    s.setAttribute('viewBox', '0 0 200 240');
    s.setAttribute('aria-hidden', 'true');
    if (hex) s.style.color = hex;

    var g = document.createElementNS(NS, 'g');
    g.setAttribute('filter', 'url(#g-lift)');
    g.innerHTML = ART[symbolId] || '';
    s.appendChild(g);

    // 같은 실루엣을 한 겹 더 올려 그늘만 입힙니다. 바느질선은 그 아래에 남습니다.
    var bodies = g.querySelectorAll('.body');
    for (var i = 0; i < bodies.length; i++) {
      var shade = bodies[i].cloneNode(false);
      shade.setAttribute('class', 'shade');
      shade.setAttribute('fill', 'url(#g-shade)');
      bodies[i].parentNode.insertBefore(shade, bodies[i].nextSibling);
    }
    return s;
  }

  /** 사진이 있으면 그림 위에 얹습니다. 없으면 조용히 그림만 남습니다. */
  function tryPhoto(container, src) {
    var probe = new Image();
    probe.onload = function () {
      var img = document.createElement('img');
      img.className = 'photo';
      img.src = src;
      img.alt = '';
      container.appendChild(img);
    };
    probe.src = src;
  }

  /* =============================================================== 그림 == */

  function hydrateArt() {
    // data-art 만 있으면 그림, data-photo 만 있으면 사진, 둘 다면 사진이 그림을 덮습니다
    var slots = document.querySelectorAll('[data-art],[data-photo]');
    for (var i = 0; i < slots.length; i++) {
      var slot = slots[i];
      if (slot.getAttribute('data-done')) continue;
      slot.setAttribute('data-done', '1');
      var art = slot.getAttribute('data-art');
      if (art) {
        var hex = slot.getAttribute('data-color') || COLORS[0].hex;
        slot.appendChild(figure(art, hex));
      }
      var photo = slot.getAttribute('data-photo');
      if (photo) tryPhoto(slot, photo);
    }
  }

  /** 카드 위의 컬러 스와치 — 누르면 그 카드 그림 색이 바뀝니다. */
  function hydrateCardSwatches() {
    var groups = document.querySelectorAll('[data-swatch-for]');
    for (var i = 0; i < groups.length; i++) {
      (function (group) {
        var targetSel = group.getAttribute('data-swatch-for');
        var target = document.querySelector(targetSel);
        if (!target) return;
        var ids = (group.getAttribute('data-colors') || 'cream,oat').split(',');

        ids.forEach(function (cid, idx) {
          var b = el('button', 'swatch sm');
          b.type = 'button';
          b.style.background = colorHex(cid);
          b.setAttribute('aria-pressed', idx === 0 ? 'true' : 'false');
          b.setAttribute('aria-label', colorName(cid));
          b.title = colorName(cid);
          b.addEventListener('click', function (e) {
            e.preventDefault();
            var all = group.querySelectorAll('.swatch');
            for (var k = 0; k < all.length; k++) all[k].setAttribute('aria-pressed', 'false');
            b.setAttribute('aria-pressed', 'true');
            var svg = target.querySelector('.figure');
            if (svg) svg.style.color = colorHex(cid);
          });
          group.appendChild(b);
        });
      })(groups[i]);
    }
  }

  /* ============================================================== 토스트 == */

  var toastNode = null, toastTimer = null;

  function toast(text) {
    if (!toastNode) {
      toastNode = el('div', 'toast');
      toastNode.setAttribute('role', 'status');
      document.body.appendChild(toastNode);
    }
    toastNode.textContent = text;
    requestAnimationFrame(function () { toastNode.classList.add('on'); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastNode.classList.remove('on'); }, 2800);
  }

  /* ============================================================ 장바구니 == */

  var cart = load(CART_KEY, []);
  if (!Array.isArray(cart)) cart = [];

  function cartCount() { return cart.reduce(function (a, it) { return a + it.qty; }, 0); }
  function cartTotal() { return cart.reduce(function (a, it) { return a + it.price * it.qty; }, 0); }

  function cartAdd(productId, sizeId, colorId, qty) {
    var p = CATALOG[productId];
    if (!p) return;
    var price = priceOf(p, sizeId);
    var hit = null;
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].productId === productId && cart[i].size === sizeId && cart[i].color === colorId) {
        hit = cart[i]; break;
      }
    }
    if (hit) hit.qty += qty;
    else cart.push({
      productId: productId, name: p.name, cat: p.cat, art: p.art,
      size: sizeId, color: colorId, price: price, qty: qty
    });
    save(CART_KEY, cart);
    paintCart();
  }

  function cartRemove(i) { cart.splice(i, 1); save(CART_KEY, cart); paintCart(); }

  /* ============================================================== 드로어 == */

  var scrim, drawer, dbody, dfoot, badge, lastFocus;

  function buildDrawer() {
    scrim = el('div', 'scrim');
    scrim.addEventListener('click', closeDrawer);

    drawer = el('aside', 'drawer');
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');
    drawer.setAttribute('aria-label', '장바구니');
    drawer.hidden = true;

    var hd = el('div', 'dhd');
    hd.appendChild(el('h2', null, '장바구니'));
    var x = el('button', 'xbtn', '✕');
    x.type = 'button';
    x.setAttribute('aria-label', '닫기');
    x.addEventListener('click', closeDrawer);
    hd.appendChild(x);

    dbody = el('div', 'dbody');
    dfoot = el('div', 'dfoot');
    drawer.appendChild(hd); drawer.appendChild(dbody); drawer.appendChild(dfoot);
    document.body.appendChild(scrim); document.body.appendChild(drawer);
  }

  function paintCart() {
    if (badge) {
      var n = cartCount();
      badge.textContent = n;
    }
    if (!dbody) return;

    dbody.textContent = '';
    dfoot.textContent = '';

    if (cart.length === 0) {
      dbody.appendChild(el('p', 'dempty', '아직 담은 게 없어요.'));
      return;
    }

    cart.forEach(function (it, i) {
      var row = el('div', 'citem');

      var th = el('div', 'th');
      th.appendChild(figure(it.art || 'g-sleeptop', colorHex(it.color)));
      row.appendChild(th);

      var mid = el('div');
      mid.appendChild(el('div', 'nm', it.name));
      mid.appendChild(el('div', 'mt', colorName(it.color) + ' · ' + it.size + ' · ' + it.qty + '개'));
      var rm = el('button', 'rm', '빼기');
      rm.type = 'button';
      rm.addEventListener('click', function () { cartRemove(i); });
      mid.appendChild(rm);
      row.appendChild(mid);

      row.appendChild(el('div', 'pr', money(it.price * it.qty)));
      dbody.appendChild(row);
    });

    var ship = cartTotal() >= 50000 ? 0 : 3000;

    var s1 = el('div', 'sum');
    s1.appendChild(el('span', null, '상품 금액'));
    s1.appendChild(el('span', null, money(cartTotal())));
    dfoot.appendChild(s1);

    var s2 = el('div', 'sum');
    s2.appendChild(el('span', null, '배송비'));
    s2.appendChild(el('span', null, ship === 0 ? '무료' : money(ship)));
    dfoot.appendChild(s2);

    var s3 = el('div', 'sum total');
    s3.appendChild(el('span', null, '합계'));
    s3.appendChild(el('span', null, money(cartTotal() + ship)));
    dfoot.appendChild(s3);

    var go = el('button', 'btn block', '주문하기');
    go.type = 'button';
    go.addEventListener('click', function () {
      toast('프로토타입이에요 — 결제는 아직 연결되어 있지 않습니다');
    });
    dfoot.appendChild(go);
    dfoot.appendChild(el('p', 'note', '결제 미연결 · 장바구니는 이 브라우저에만 저장됩니다'));
  }

  function openDrawer() {
    if (!drawer) return;
    lastFocus = document.activeElement;
    drawer.hidden = false;
    requestAnimationFrame(function () {
      scrim.classList.add('on');
      drawer.classList.add('on');
    });
    var f = drawer.querySelector('button');
    if (f) f.focus();
  }
  function closeDrawer() {
    if (!drawer) return;
    scrim.classList.remove('on');
    drawer.classList.remove('on');
    setTimeout(function () { drawer.hidden = true; }, 260);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer && !drawer.hidden) closeDrawer();
  });

  /* ================================================================ 내비 == */

  function initNav() {
    var here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    var links = document.querySelectorAll('.nav .lnk');
    for (var i = 0; i < links.length; i++) {
      var href = (links[i].getAttribute('href') || '').split('?')[0].split('#')[0].toLowerCase();
      if (href && href === here) links[i].setAttribute('aria-current', 'page');
    }
    badge = document.querySelector('.cartbtn .cnt');
    var btn = document.querySelector('.cartbtn');
    if (btn) btn.addEventListener('click', openDrawer);
  }

  /* ============================================================== 대기자 == */

  function initWaitlist() {
    var form = document.getElementById('wl');
    if (!form) return;
    var input = form.querySelector('input[type=email]');
    var msg = document.getElementById('wlmsg');
    var countBox = document.getElementById('wlcount');

    function paintCount() {
      if (!countBox) return;
      var list = load(WL_KEY, []);
      var n = Array.isArray(list) ? list.length : 0;
      countBox.hidden = n === 0;
      var b = countBox.querySelector('b');
      if (b) b.textContent = n;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = (input.value || '').trim().toLowerCase();
      var at = v.indexOf('@');

      if (!v || at < 1 || v.indexOf('.', at) < at + 2 || v.length - v.lastIndexOf('.') < 3) {
        msg.hidden = false;
        msg.className = 'msg err';
        msg.textContent = '이메일 주소를 한 번만 확인해 주세요.';
        input.focus();
        return;
      }

      var list = load(WL_KEY, []);
      if (!Array.isArray(list)) list = [];

      if (list.some(function (r) { return r.email === v; })) {
        msg.hidden = false;
        msg.className = 'msg';
        msg.textContent = '이미 적어 두셨어요. 아직 서버가 없어서 이 브라우저에만 남아 있습니다.';
        input.value = '';
        return;
      }

      list.push({ email: v, at: new Date().toISOString() });
      var ok = save(WL_KEY, list);

      msg.hidden = false;
      msg.className = 'msg';
      msg.textContent = ok
        ? '적어 뒀습니다. 다만 아직 서버가 없어서 이 브라우저에만 저장되고, 메일은 가지 않습니다.'
        : '브라우저가 저장을 막고 있어 기록하지 못했어요.';
      input.value = '';
      paintCount();
    });

    paintCount();
  }

  /* ============================================================ 제품 상세 == */

  function initProduct() {
    var root = document.getElementById('pdp');
    if (!root) return;

    var id = new URLSearchParams(location.search).get('id');
    if (!CATALOG[id]) id = 'sleep-set';
    var p = CATALOG[id];

    var size = null;
    var color = p.colors[0];
    var qty = 1;

    document.title = p.name + ' · 솜구름';

    var f = function (k) { return root.querySelector('[data-f=' + k + ']'); };

    f('cat').textContent = p.cat;
    f('name').textContent = p.name;
    f('desc').textContent = p.desc;
    f('fabric').textContent = p.fabric + ' · ' + p.gsm + ' gsm';
    f('comp').textContent = p.fabric;
    f('yarn').textContent = p.yarn;
    f('gsm').textContent = p.gsm + ' gsm';
    f('finish').textContent = p.finish;
    f('wipegrade').textContent = p.wipe.grade;
    f('wipenote').textContent = p.wipe.note;
    f('lead').textContent = p.lead;

    var crumb = document.querySelector('[data-f=crumb]');
    if (crumb) crumb.textContent = p.name;

    /* 그림 ------------------------------------------------------------- */
    var main = f('artmain');
    var thumbs = f('artthumbs');

    function paintArt() {
      main.textContent = '';
      main.appendChild(figure(p.art, colorHex(color)));
      tryPhoto(main, 'assets/img/' + p.id + '-1.jpg');

      thumbs.textContent = '';
      p.artAlt.forEach(function (sym, i) {
        var cell = el('div', 'artpanel');
        cell.appendChild(figure(sym, colorHex(color)));
        tryPhoto(cell, 'assets/img/' + p.id + '-' + (i + 2) + '.jpg');
        thumbs.appendChild(cell);
      });
    }

    /* 컬러 -------------------------------------------------------------- */
    var cwrap = f('colors');
    var cname = f('colorname');
    p.colors.forEach(function (cid) {
      var b = el('button', 'swatch');
      b.type = 'button';
      b.style.background = colorHex(cid);
      b.setAttribute('aria-pressed', cid === color ? 'true' : 'false');
      b.setAttribute('aria-label', colorName(cid));
      b.title = colorName(cid);
      b.addEventListener('click', function () {
        color = cid;
        var all = cwrap.querySelectorAll('.swatch');
        for (var k = 0; k < all.length; k++) all[k].setAttribute('aria-pressed', 'false');
        b.setAttribute('aria-pressed', 'true');
        cname.textContent = colorName(cid);
        paintArt();
      });
      cwrap.appendChild(b);
    });
    cname.textContent = colorName(color);

    /* 사이즈 ------------------------------------------------------------ */
    var grid = f('sizes');
    SIZES.forEach(function (s) {
      var b = el('button', 'sizebtn', s.id);
      b.type = 'button';
      b.setAttribute('aria-pressed', 'false');
      var offGroup = p.groups.indexOf(s.group) === -1;
      var offList = p.only && p.only.indexOf(s.id) === -1;
      if (offGroup || offList) {
        b.disabled = true;
        b.title = offList && !offGroup
          ? '이 품목에는 없는 사이즈예요'
          : GROUP_LABEL[s.group] + ' 사이즈는 이 품목에 없어요';
      } else {
        b.addEventListener('click', function () {
          size = s.id;
          var all = grid.querySelectorAll('.sizebtn');
          for (var k = 0; k < all.length; k++) all[k].setAttribute('aria-pressed', 'false');
          b.setAttribute('aria-pressed', 'true');
          paint();
        });
      }
      grid.appendChild(b);
    });

    /* 값 ---------------------------------------------------------------- */
    var priceNode = f('price');
    var pickedNode = f('picked');
    var addBtn = f('add');
    var qtyOut = f('qty');
    var barPrice = document.querySelector('[data-f=barprice]');
    var barBtn = document.querySelector('[data-f=baradd]');

    function range() {
      var vals = p.groups.map(function (g) { return p.price[g]; });
      var lo = Math.min.apply(null, vals), hi = Math.max.apply(null, vals);
      return lo === hi ? money(lo) : money(lo) + ' – ' + money(hi);
    }

    function paint() {
      var txt = size ? money(priceOf(p, size) * qty) : range();
      priceNode.textContent = txt;
      if (barPrice) barPrice.textContent = txt;
      pickedNode.textContent = size ? size : '사이즈 선택';
      pickedNode.className = 'picked' + (size ? ' on' : '');
      addBtn.disabled = !size;
      if (barBtn) barBtn.disabled = !size;
      qtyOut.value = qty;
    }

    f('minus').addEventListener('click', function () { if (qty > 1) { qty--; paint(); } });
    f('plus').addEventListener('click', function () { if (qty < 9) { qty++; paint(); } });

    function add() {
      if (!size) {
        toast('사이즈를 먼저 골라주세요');
        grid.scrollIntoView({ block: 'center', behavior: 'smooth' });
        return;
      }
      cartAdd(p.id, size, color, qty);
      toast(p.name + ' ' + size + ' · ' + qty + '개 담았어요');
      openDrawer();
    }
    addBtn.addEventListener('click', add);
    if (barBtn) barBtn.addEventListener('click', add);

    paintArt();
    paint();
  }


  /* ================================================================ 시작 == */


  function start() {
    buildDrawer();
    initNav();
    hydrateArt();
    hydrateCardSwatches();
    paintCart();
    initWaitlist();
    initProduct();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
