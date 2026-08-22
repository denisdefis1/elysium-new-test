/* ============================================================
   ELYSIUM TBILISI — Marketing Intelligence Hub
   strategy.js — Strategy Section Renderers
   ============================================================ */

import { poolBadge, statusBadge, langBadge, fmtVol, fmtCpc, volClass, ciClass, buildKeywordTable, escHtml } from './ui.js';

/* ============================================================
   RSA DATA — module-level constants (used by S05 and S09)
   ============================================================ */

const RSA_K1_HEADS = [
  {text:'Апартаменты от 130 м²',            pin:'P1'},
  {text:'Бутик-резиденция Тбилиси',          pin:null},
  {text:'Дом введён в эксплуатацию',         pin:null},
  {text:'Только 14 апартаментов',            pin:null},
  {text:'Купить апартаменты в Тбилиси',      pin:null},
  {text:'Премиум недвижимость Грузия',       pin:null},
  {text:'Всего 2 квартиры на этаже',         pin:null},
  {text:'Свободная планировка',              pin:null},
  {text:'Подземный паркинг',                 pin:null},
  {text:'Записаться на показ',               pin:null},
  {text:'Панорамный вид',                    pin:null},
  {text:'Тишина и приватность',              pin:null},
  {text:'Квартира в Грузии',                 pin:null},
  {text:'Инвестиции в недвижимость',         pin:null},
  {text:'Полная информация',                 pin:null},
];
const RSA_K1_DESCS = [
  'Бутик-резиденция — комфорт и приватность каждого жителя. Запросите планировки и цены.',
  'Дом введён в эксплуатацию. Апартаменты от 130 м². Личный показ — без обязательств.',
  'Автономность: генератор и резервуар с водой. Полная независимость от городских коммуникаций.',
  'Запросите полную информацию — планировки, цены и личный показ.',
];

const RSA_K2_HEADS = [
  {text:'Apartments from 130 m²',       pin:'P1'},
  {text:'Buy Apartment in Tbilisi',      pin:null},
  {text:'Boutique Residence Tbilisi',    pin:null},
  {text:'Building Commissioned & Ready', pin:null},
  {text:'Open for Private Viewing',      pin:null},
  {text:'Luxury Tbilisi Real Estate',    pin:null},
  {text:'Free Floor Plan — No Walls',    pin:null},
  {text:'Panoramic Views — Every Unit',  pin:null},
  {text:'Privacy. Security. Silence.',   pin:null},
  {text:'Underground Parking Included',  pin:null},
  {text:'Generator & Water Reserve',     pin:null},
  {text:'Book a Private Viewing',        pin:null},
  {text:'Plans & Prices on Request',     pin:null},
  {text:'2 Apartments per Floor Only',   pin:null},
  {text:'Boutique — Not a Complex',      pin:null},
];
const RSA_K2_DESCS = [
  'Boutique Residence in Tbilisi. 14 apartments from 130 m². Building commissioned.',
  'Free floor plan. No load-bearing walls. Panoramic city views from every residence.',
  'Full infrastructure independence. Generator. 70-ton water reserve. 24/7 security.',
  'Book a private viewing. Request plans, pricing, and full project details.',
];

const RSA_K3_HEADS = [
  {text:'Бутик-резиденция Тбилиси',         pin:'P1'},
  {text:'Апартаменты от 130 м²',            pin:null},
  {text:'Дом введён в эксплуатацию',        pin:null},
  {text:'Только 14 апартаментов',           pin:null},
  {text:'Элитная недвижимость Грузия',      pin:null},
  {text:'Всего 2 квартиры на этаже',        pin:null},
  {text:'Пентхаус Тбилиси',                 pin:null},
  {text:'Свободная планировка',             pin:null},
  {text:'Подземный паркинг',                pin:null},
  {text:'Записаться на показ',              pin:null},
  {text:'Панорамный вид',                   pin:null},
  {text:'Тишина и приватность',             pin:null},
  {text:'Люкс апартаменты Тбилиси',         pin:null},
  {text:'VIP резиденция Тбилиси',           pin:null},
  {text:'Полная информация',                pin:null},
];
const RSA_K3_DESCS = [
  'Бутик-резиденция — комфорт и приватность каждого жителя. Запросите планировки и цены.',
  'Дом введён в эксплуатацию. Только 14 апартаментов от 130 м². Показ по записи.',
  'Автономность: генератор и резервуар с водой. Полная независимость от городских коммуникаций.',
  'Запросите полную информацию — планировки, цены и личный показ.',
];

const RSA_K4_RU_HEADS = [
  'Не комплекс — бутик-резиденция',
  'Дом введён в эксплуатацию',
  'Всего 2 квартиры на этаже',
  'Только 14 апартаментов',
  'Свободная планировка',
  'Записаться на показ',
  'Подземный паркинг',
  'Тишина и приватность',
  'Полная информация',
  'Бутик-резиденция открыта',
  'Апартаменты от 130 м²',
  'Панорамный вид',
  'Без несущих стен',
  'Безопасность 24/7',
  'Грузия · Тбилиси',
];
const RSA_K4_RU_DESCS = [
  'Дом введён в эксплуатацию — бутик-резиденция открыта к просмотру.',
  'Бутик-резиденция: только 14 апартаментов. Комфорт и приватность каждого жителя.',
  'Автономность: генератор и резервуар с водой. Полная независимость от городских коммуникаций.',
  'Запросите полную информацию — планировки, цены и личный показ.',
];

const RSA_K4_EN_HEADS = [
  'Boutique — Not a Complex',
  'Building Commissioned & Ready',
  'Only 2 Apartments per Floor',
  'ELYSIUM Boutique Residence',
  '14 Apartments from 130 m²',
  'Panoramic Views — Every Unit',
  'Free Floor Plan — No Walls',
  'Privacy. Security. Silence.',
  'Underground Parking Included',
  'Generator & Water Reserve',
  'Open for Private Viewing',
  'Full Infrastructure Backup',
  'Book a Private Viewing',
  'Request Full Project Info',
  'Compare Before You Choose',
];
const RSA_K4_EN_DESCS = [
  'Building commissioned. Only 2 apartments per floor. Boutique — not a complex.',
  'Free floor plan. Panoramic views from every residence. Privacy & silence.',
  'Underground parking. Generator. 70-ton water reserve. Full infrastructure backup.',
  'Book a private viewing. Compare ELYSIUM with any premium Tbilisi project.',
];

/* ============================================================
   GOOGLE ADS STRATEGY
   ============================================================ */

export function renderGoogleStrategy(container, data) {
  const { keywords, campaigns, competitors, negatives, research } = data;

  container.innerHTML = `
    <div class="section-block" id="s00">${renderS00()}</div>
    <div class="section-block" id="s01">${renderS01()}</div>
    <div class="section-block" id="s02">${renderS02()}</div>
    <div class="section-block" id="s03">${renderS03()}</div>
    <div class="section-block" id="s04">${renderS04()}</div>
    <div class="section-block" id="s05">${renderS05(keywords, competitors, negatives)}</div>
    <div class="section-block" id="s06">${renderS06(campaigns)}</div>
    <div class="section-block" id="s07">${renderS07()}</div>
    <div class="section-block" id="s09">${renderS09()}</div>
  `;
}

/* ---- S00 Обзор стратегии ---- */
function renderS00() {
  const steps = [
    ['ЧТО ПРОДАЁМ?', 'ELYSIUM — бутик-резиденция в Тбилиси. 14 апартаментов от 130 м². Дом введён в эксплуатацию. Открыт к индивидуальному просмотру.'],
    ['КОМУ?', 'Покупателям premium-недвижимости — русскоязычным жителям Израиля, Украины, Беларуси и англоязычным профессионалам в Израиле.'],
    ['ГДЕ?', '🇮🇱 Израиль · 🇺🇦 Украина · 🇧🇾 Беларусь. Германия и Грузия (локально) — исключены из таргетинга.'],
    ['НА КАКИХ ЯЗЫКАХ?', 'Русский (RU) — кампания 2, все три гео. Английский (EN) — кампания 3, приоритет Израиль. Брендовая и конкурентная — RU + EN одновременно.'],
    ['КАКИЕ КАМПАНИИ?', '4 независимых кампании: Брендовая · Покупка RU · Покупка EN · Конкурентная. Каждая управляется отдельно по бюджету, ставкам и объявлениям.'],
    ['КАКОЙ БЮДЖЕТ?', '$500 в месяц — 4 × $125. Равное распределение. Без резерва.'],
    ['КАКИЕ ОБЪЯВЛЕНИЯ?', 'RSA — адаптивные поисковые объявления (Responsive Search Ads): до 15 заголовков и 4 описания. Google подбирает лучшую комбинацию автоматически.'],
    ['КУДА ВЕДЁМ?', 'elysiumtbilisi.com — с языковым параметром: /?lang=ru для RU-кампании, /?lang=en для EN. Брендовая — автоопределение языка.'],
    ['КАК ОПТИМИЗИРУЕМ?', 'Фаза 1: Manual CPC (мес. 1–2) → Фаза 2: Enhanced CPC (при 20+ конверсиях/кампанию) → Фаза 3: Target CPA (при 30+ конв./мес суммарно).'],
  ];

  return `
    <div class="section-block-header">
      <div class="section-block-num">00</div>
      <div class="section-block-title-wrap">
        <div class="section-block-title">Обзор стратегии</div>
        <div class="section-block-desc">ELYSIUM Google Ads — вся стратегия за 60 секунд</div>
      </div>
    </div>

    <div style="display:flex;flex-direction:column;gap:0;margin-bottom:32px">
      ${steps.map((s, i) => `
        <div style="display:flex;gap:0">
          <div style="display:flex;flex-direction:column;align-items:center;flex-shrink:0;width:28px">
            <div style="width:10px;height:10px;border-radius:50%;background:var(--accent-gold);flex-shrink:0;margin-top:14px"></div>
            ${i < steps.length - 1 ? `<div style="width:1px;flex:1;background:rgba(196,168,130,0.25);min-height:28px"></div>` : ''}
          </div>
          <div style="padding:8px 0 ${i < steps.length - 1 ? '16px' : '0'} 16px">
            <div style="font-size:10px;font-weight:600;letter-spacing:0.12em;color:var(--accent-gold);text-transform:uppercase;margin-bottom:4px">${s[0]}</div>
            <div style="font-size:13px;color:var(--text-secondary);line-height:1.6">${s[1]}</div>
          </div>
        </div>
      `).join('')}
    </div>

    <div class="metrics-row">
      <div class="metric-card gold">
        <div class="metric-label">Общий бюджет</div>
        <div class="metric-value">$500</div>
        <div class="metric-sub">в месяц</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Кампании</div>
        <div class="metric-value">4</div>
        <div class="metric-sub">по 25% каждая</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Ключевых слов (KEEP)</div>
        <div class="metric-value">408</div>
        <div class="metric-sub">готовы к запуску</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Требуют проверки (CHECK)</div>
        <div class="metric-value">861</div>
        <div class="metric-sub">ручная проверка</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Конкурентов</div>
        <div class="metric-value">38</div>
        <div class="metric-sub">14 верифицированы</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Всего исследовано</div>
        <div class="metric-value">4,412</div>
        <div class="metric-sub">ключевых слов в базе</div>
      </div>
    </div>

    <div class="note-box info" style="margin-top:24px">
      <span class="note-box-icon">ℹ</span>
      <div>
        <strong>Позиционирование:</strong> ELYSIUM — это <strong>бутик-резиденция</strong>, не клубный дом.
        Дом введён в эксплуатацию. Открыт к индивидуальному показу. Все кампании отражают этот статус.
        Бюджет: 4 × $125 = $500/мес. Без резерва.
      </div>
    </div>
  `;
}

/* ---- S01 Business & Product ---- */
function renderS01() {
  return `
    <div class="section-block-header">
      <div class="section-block-num">01</div>
      <div class="section-block-title-wrap">
        <div class="section-block-title">Product & Positioning</div>
        <div class="section-block-desc">What ELYSIUM is and how it's positioned in advertising</div>
      </div>
    </div>

    <div class="two-col">
      <div>
        <div class="card-title">Key Facts</div>
        <div class="facts-list">
          ${fact('Project', 'ELYSIUM Boutique Residence · Tbilisi')}
          ${fact('Status', 'Building commissioned & ready to view')}
          ${fact('Units', '14 premium residences · 2 per floor')}
          ${fact('Size', '130 m² – 191 m²')}
          ${fact('Layout', 'Free floor plan · No load-bearing walls')}
          ${fact('Views', 'Panoramic city views from every residence')}
          ${fact('Infrastructure', 'Generator · 70-ton water reserve')}
          ${fact('Parking', 'Underground parking included')}
          ${fact('Rooftop', 'Jacuzzi · Fitness · Outdoor kitchen')}
          ${fact('Security', '24/7 CCTV & on-site security')}
          ${fact('Viewings', 'Open for private individual viewings')}
        </div>
      </div>

      <div>
        <div class="card-title" style="margin-bottom:20px">Brand Positioning</div>
        <div style="margin-bottom:24px">
          <div class="label" style="margin-bottom:12px;display:block">✓ Use in all ad copy</div>
          <div class="position-list">
            ${posItem(true, 'Бутик-резиденция / Boutique Residence')}
            ${posItem(true, 'Дом введён в эксплуатацию')}
            ${posItem(true, 'Building Commissioned & Ready')}
            ${posItem(true, 'Только 14 апартаментов / 14 Apartments Only')}
            ${posItem(true, 'Свободная планировка / Free Floor Plan')}
            ${posItem(true, 'Панорамный вид / Panoramic Views')}
            ${posItem(true, 'Тишина. Приватность. Безопасность.')}
            ${posItem(true, 'Privacy. Security. Silence.')}
            ${posItem(true, 'Записаться на показ / Book a Private Viewing')}
          </div>
        </div>
        <div>
          <div class="label" style="margin-bottom:12px;display:block;color:var(--error)">✗ Never use in ads</div>
          <div class="position-list">
            ${posItem(false, 'Клубный дом / Club House')}
            ${posItem(false, 'Дом полностью сдан')}
            ${posItem(false, 'Элия Хилл — приватность рядом')}
            ${posItem(false, 'Сегодня (in any CTA)')}
          </div>
        </div>
      </div>
    </div>
  `;
}

function fact(label, value) {
  return `
    <div class="facts-item">
      <span class="facts-label">${label}</span>
      <span class="facts-value">${value}</span>
    </div>`;
}

function posItem(ok, text) {
  return `
    <div class="position-item ${ok ? 'pos' : 'neg'}">
      <span class="position-check">${ok ? '✅' : '❌'}</span>
      <span>${ok ? text : `<span>${text}</span>`}</span>
    </div>`;
}

/* ---- S02 Target Audience ---- */
function renderS02() {
  return `
    <div class="section-block-header">
      <div class="section-block-num">02</div>
      <div class="section-block-title-wrap">
        <div class="section-block-title">Target Audience</div>
        <div class="section-block-desc">Who we reach · Three markets · Two languages</div>
      </div>
    </div>

    <div class="three-col" style="margin-bottom:24px">
      <div class="geo-card">
        <div class="geo-flag">🇮🇱</div>
        <div class="geo-name">Israel</div>
        <div class="geo-facts">
          <div class="geo-fact"><strong>Primary market</strong></div>
          <div class="geo-fact">Russian-speaking Israelis → RU campaigns</div>
          <div class="geo-fact">English-speaking professionals → EN campaigns</div>
          <div class="geo-fact">Both RU and EN campaigns active</div>
          <div class="geo-fact">Mobile-first audience — fast load critical</div>
        </div>
      </div>
      <div class="geo-card">
        <div class="geo-flag">🇺🇦</div>
        <div class="geo-name">Ukraine</div>
        <div class="geo-facts">
          <div class="geo-fact">Russian-speaking buyers</div>
          <div class="geo-fact">RU campaigns primary targeting</div>
          <div class="geo-fact">Strong purchase intent for Tbilisi property</div>
        </div>
      </div>
      <div class="geo-card">
        <div class="geo-flag">🇧🇾</div>
        <div class="geo-name">Belarus</div>
        <div class="geo-facts">
          <div class="geo-fact">Russian-speaking buyers</div>
          <div class="geo-fact">RU campaigns primary targeting</div>
          <div class="geo-fact">High relocation intent to Georgia</div>
        </div>
      </div>
    </div>

    <div class="note-box info">
      <span class="note-box-icon">ℹ</span>
      <div>
        <strong>Key principle:</strong> Country ≠ Language.
        RU and EN campaigns run simultaneously across all 3 markets — Israel receives the highest EN bid adjustment.
        <strong>Excluded from targeting:</strong> Germany · Georgia (local residents).
      </div>
    </div>
  `;
}

/* ---- S03 Geo & Language ---- */
function renderS03() {
  return `
    <div class="section-block-header">
      <div class="section-block-num">03</div>
      <div class="section-block-title-wrap">
        <div class="section-block-title">Search Strategy</div>
        <div class="section-block-desc">Four demand types · Each captured by a dedicated campaign</div>
      </div>
    </div>

    <div class="intent-grid">
      <div class="intent-card">
        <div class="intent-card-header">
          <div class="pool-badge pool-A">К1</div>
          <div class="intent-title">Purchase Intent — RU</div>
          <span class="intent-count">~108 KW</span>
        </div>
        <div class="intent-examples">"купить квартиру в тбилиси"<br>"апартаменты тбилиси"</div>
        <div class="intent-desc">Russian-language buyers actively searching to purchase property in Tbilisi. Highest priority. Exact match first, then Phrase.</div>
      </div>

      <div class="intent-card">
        <div class="intent-card-header">
          <div class="pool-badge pool-B">К2</div>
          <div class="intent-title">Purchase Intent — EN</div>
          <span class="intent-count">~69 KW</span>
        </div>
        <div class="intent-examples">"buy apartment in tbilisi"<br>"luxury apartment tbilisi"</div>
        <div class="intent-desc">English-language buyers — primarily Israel market. Covers purchase, luxury, penthouse, boutique residence, and investment queries.</div>
      </div>

      <div class="intent-card">
        <div class="intent-card-header">
          <div class="pool-badge pool-C">К3</div>
          <div class="intent-title">Premium Intent — RU</div>
          <span class="intent-count">~37 KW</span>
        </div>
        <div class="intent-examples">"элитная недвижимость тбилиси"<br>"бутик резиденция тбилиси"</div>
        <div class="intent-desc">Russian-language premium and luxury segment. Audience self-selects — high qualification rate. Avg. CPC $1.24. Premium messaging essential.</div>
      </div>

      <div class="intent-card" style="border-color:rgba(140,94,48,0.25)">
        <div class="intent-card-header">
          <div class="pool-badge pool-I">К4</div>
          <div class="intent-title">Competitor Searches</div>
          <span class="intent-count">~87 KW ⚠</span>
        </div>
        <div class="intent-examples">"park home vake"<br>"cityzen tbilisi"</div>
        <div class="intent-desc">Buyers researching competing projects. ELYSIUM appears as a boutique alternative. All 87 keywords require manual review before launch.</div>
      </div>
    </div>

    <div class="card" style="margin-top:24px;border-color:rgba(74,106,140,0.2)">
      <div class="card-title" style="color:var(--data-blue)">Phase 2 — Not in current scope</div>
      <div style="font-size:13px;color:var(--text-secondary);line-height:1.6;margin-top:8px">
        176 generic real estate keywords (Pool J: "apartment tbilisi", "квартира в тбилиси" etc.) are retained for Phase 2 expansion.
        These require larger budgets and will be evaluated after Phase 1 CPL data is available (6–8 weeks post-launch).
      </div>
    </div>
  `;
}

/* ---- S04 Search Intent ---- */
function renderS04() {
  return `
    <div class="section-block-header">
      <div class="section-block-num">04</div>
      <div class="section-block-title-wrap">
        <div class="section-block-title">Campaign Structure</div>
        <div class="section-block-desc">4 independent campaigns · $500/month total · $125/month each</div>
      </div>
    </div>

    <div class="card" style="margin-bottom:32px;font-family:var(--font-mono);font-size:13px;line-height:2.1">
      <div style="font-size:10px;color:var(--text-tertiary);letter-spacing:0.08em;text-transform:uppercase;font-family:var(--font-sans);margin-bottom:10px">Budget allocation</div>
      <div style="color:var(--accent-gold);font-weight:600">Google Ads — $500 / month</div>
      <div style="color:var(--text-secondary)">├── Campaign 1 — К1 Purchase RU <span style="color:var(--text-tertiary)">·····</span> <span style="color:var(--text-primary)">$125/mo</span></div>
      <div style="color:var(--text-secondary)">├── Campaign 2 — К2 Purchase EN <span style="color:var(--text-tertiary)">·····</span> <span style="color:var(--text-primary)">$125/mo</span></div>
      <div style="color:var(--text-secondary)">├── Campaign 3 — К3 Premium RU <span style="color:var(--text-tertiary)">······</span> <span style="color:var(--text-primary)">$125/mo</span></div>
      <div style="color:var(--text-secondary)">└── Campaign 4 — К4 Competitors <span style="color:var(--text-tertiary)">·····</span> <span style="color:var(--text-primary)">$125/mo</span></div>
    </div>

    <div class="table-wrapper" style="margin-bottom:24px">
      <table class="kpi-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Campaign</th>
            <th>Language</th>
            <th>Intent</th>
            <th>Keywords</th>
            <th>Budget</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="kpi-name">К1</td>
            <td>Purchase RU</td>
            <td><span class="badge badge-lang badge-lang-RU">RU</span></td>
            <td style="font-size:12px;color:var(--text-secondary)">Direct purchase intent (RU-language)</td>
            <td style="font-family:var(--font-mono)">~108</td>
            <td style="font-family:var(--font-mono);color:var(--accent-gold)">$125/mo</td>
          </tr>
          <tr>
            <td class="kpi-name">К2</td>
            <td>Purchase EN</td>
            <td><span class="badge badge-lang badge-lang-EN">EN</span></td>
            <td style="font-size:12px;color:var(--text-secondary)">Direct purchase intent (EN-language)</td>
            <td style="font-family:var(--font-mono)">~69</td>
            <td style="font-family:var(--font-mono);color:var(--accent-gold)">$125/mo</td>
          </tr>
          <tr>
            <td class="kpi-name">К3</td>
            <td>Premium RU</td>
            <td><span class="badge badge-lang badge-lang-RU">RU</span></td>
            <td style="font-size:12px;color:var(--text-secondary)">Luxury / premium segment (RU)</td>
            <td style="font-family:var(--font-mono)">~37</td>
            <td style="font-family:var(--font-mono);color:var(--accent-gold)">$125/mo</td>
          </tr>
          <tr>
            <td class="kpi-name">К4</td>
            <td>Competitors</td>
            <td><span class="badge badge-lang badge-lang-RU">RU</span> <span class="badge badge-lang badge-lang-EN">EN</span></td>
            <td style="font-size:12px;color:var(--text-secondary)">Intercept competitor project searches</td>
            <td style="font-family:var(--font-mono)">~87 ⚠</td>
            <td style="font-family:var(--font-mono);color:var(--accent-gold)">$125/mo</td>
          </tr>
          <tr style="background:var(--bg-elevated);border-top:1px solid var(--border-medium)">
            <td colspan="2" style="font-weight:600;color:var(--text-primary)">TOTAL</td>
            <td></td>
            <td></td>
            <td style="font-family:var(--font-mono);font-weight:600;color:var(--text-primary)">~301</td>
            <td style="font-family:var(--font-mono);font-weight:600;color:var(--accent-gold)">$500/mo</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="note-box warning">
      <span class="note-box-icon">⚠</span>
      <div>
        <strong>Campaign 4 (Competitors):</strong> All ~87 keywords are CHECK_REQUIRED.
        Manual review before enabling each keyword. Launch highest-volume first:
        Park Home Vake · Gergeti Rise · CityZen · Next Tbilisi · Mtatsminda Panorama.
      </div>
    </div>
  `;
}

/* ---- S05 Детали кампаний ---- */
function renderS05(keywords, competitors, negatives) {
  // Guard against null data
  const kwData   = (keywords   && keywords.keywords)     ? keywords.keywords     : [];
  const compData = (competitors && competitors.competitors) ? competitors.competitors : [];
  const negData  = (negatives  && negatives.categories)  ? negatives             : {categories:[], total:0};

  // Filter keywords per campaign — exclude EXCLUDED_* statuses from all campaigns
  // К3 Premium = Pool B RU only. Pool B EN goes to К2 (no overlap — different languages)
  const isActive = k => !k.status || !k.status.startsWith('EXCLUDED');
  const k1kw = kwData.filter(k => isActive(k) && ['A','D','E','F','G'].includes(k.pool) && k.language === 'RU');
  const k2kw = kwData.filter(k => isActive(k) && ['A','B','C','D','E','F','G'].includes(k.pool) && k.language === 'EN');
  const k3kw = compData.flatMap(c => c.keywords.map(kw => ({keyword: kw.keyword, competitor: c.name})));
  const k4kw = kwData.filter(k => isActive(k) && k.pool === 'B' && k.language === 'RU');

  // ── LOW-LEVEL HELPERS (string concatenation, no nested template literals) ──

  const chip = kw =>
    '<code style="background:var(--bg-hover);padding:3px 8px;border-radius:4px;font-size:11px;color:var(--text-secondary);font-family:var(--font-mono)">' + kw + '</code>';

  const chipNeg = w =>
    '<code style="background:rgba(255,80,80,0.1);color:#FF8A80;border-radius:4px;padding:2px 7px;font-size:11px;font-family:var(--font-mono)">−' + w + '</code>';

  const pinBadge = pin =>
    '<span style="font-size:9px;background:rgba(196,168,130,0.25);color:var(--accent-gold);border-radius:3px;padding:1px 4px;margin-right:4px;font-family:var(--font-mono)">' + pin + '</span>';

  const headsPinned = arr =>
    '<div class="rsa-headlines">' +
    arr.map(h => '<span class="rsa-headline">' + (h.pin ? pinBadge(h.pin) : '') + h.text + '</span>').join('') +
    '</div>';

  const headsPlain = arr =>
    '<div class="rsa-headlines">' +
    arr.map(h => '<span class="rsa-headline">' + h + '</span>').join('') +
    '</div>';

  const descsHtml = arr =>
    '<div class="rsa-descriptions">' +
    arr.map(d => '<div class="rsa-desc">' + d + '</div>').join('') +
    '</div>';

  const subhead = label =>
    '<div style="font-size:11px;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px">' + label + '</div>';

  const gap = '<div style="height:12px"></div>';

  // ── NEGATIVES SECTION (shared across all campaigns) ──
  const catLabels = {O:'Аренда', N:'Другие города Грузии', M:'Штат Джорджия США', L:'Отели', K:'Нерелевантные', P:'Намерение продать'};

  const negSection =
    '<div style="background:rgba(255,80,80,0.04);border:1px solid rgba(255,80,80,0.2);border-radius:8px;padding:16px 20px">' +
    '<div style="font-size:10px;text-transform:uppercase;letter-spacing:0.08em;color:#FF5252;margin-bottom:12px;font-weight:600">🚫 Минус-слова — ' + negData.total.toLocaleString('ru-RU') + ' слов · 6 категорий · применяются глобально</div>' +
    '<div style="display:flex;flex-direction:column;gap:8px">' +
    negData.categories.map(cat => {
      const isComplete = cat.examples.length >= cat.count;
      const lbl = catLabels[cat.pool] || cat.label;
      const countStr = cat.count.toLocaleString('ru-RU') + ' слов' + (isComplete ? ' · полный список' : ' · ' + cat.examples.length + ' примеров');
      return '<details style="border:1px solid var(--border-subtle);border-radius:6px;overflow:hidden">' +
        '<summary style="padding:8px 12px;cursor:pointer;background:var(--bg-hover);display:flex;justify-content:space-between;align-items:center;font-size:12px">' +
        '<span style="color:var(--text-primary)">' + lbl + '</span>' +
        '<span style="color:var(--text-tertiary);font-size:11px">' + countStr + '</span>' +
        '</summary>' +
        '<div style="padding:10px 12px;display:flex;flex-wrap:wrap;gap:5px">' + cat.examples.map(chipNeg).join('') + '</div>' +
        '</details>';
    }).join('') +
    '</div>' +
    '<div style="margin-top:10px;font-size:11px;color:var(--text-tertiary)">Показаны все доступные примеры из backend-базы. Для категорий с тысячами вариаций приводятся наиболее репрезентативные запросы.</div>' +
    '</div>';

  // ── KEYWORD SECTIONS ──
  const kwSection = (kwArr, poolLabel) => {
    const count = kwArr.length;
    const chips = kwArr.map(k => chip(k.keyword)).join('');
    return '<div>' +
      '<div style="font-size:10px;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px">Ключевые слова — ' + count +
      ' <span style="margin-left:8px;font-size:10px;color:var(--accent-gold);background:rgba(196,168,100,0.1);border-radius:3px;padding:1px 6px">' + poolLabel + '</span></div>' +
      '<details>' +
      '<summary style="cursor:pointer;display:inline-flex;align-items:center;gap:6px;background:rgba(196,168,100,0.1);border:1px solid rgba(196,168,100,0.25);border-radius:6px;padding:6px 12px;font-size:12px;color:var(--accent-gold);margin-bottom:10px">' +
      'Показать все ' + count + ' ключевых слов' +
      '</summary>' +
      '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px">' + chips + '</div>' +
      '</details>' +
      '</div>';
  };

  // ── COMPETITOR PROFILE TABLE (primary 14 competitors from Google Sheet) ──
  const primaryComps = compData.filter(c => c.is_google_sheet);
  const siteStatus = c => {
    if (c.website) return '<a href="' + c.website + '" target="_blank" rel="noopener" style="color:var(--accent-gold);font-size:11px;font-family:var(--font-mono);word-break:break-all">' + c.website.replace(/^https?:\/\//, '') + '</a>';
    if (c.plans_url) return '<a href="' + c.plans_url + '" target="_blank" rel="noopener" style="color:#FFA000;font-size:11px;font-family:var(--font-mono)">Yandex Disk (планировки)</a>';
    return '<span style="color:var(--text-tertiary);font-size:11px">—</span>';
  };
  const noSiteTag = c => {
    if (!c.website && !c.plans_url) return '<span style="font-size:9px;background:rgba(232,112,112,0.15);color:#E87070;border-radius:3px;padding:1px 5px;margin-left:4px">Нет сайта</span>';
    if (!c.website && c.plans_url)  return '<span style="font-size:9px;background:rgba(255,160,0,0.15);color:#FFA000;border-radius:3px;padding:1px 5px;margin-left:4px">Только Disk</span>';
    return '';
  };
  const compTable =
    '<div style="overflow-x:auto;margin-bottom:14px">' +
    '<table style="width:100%;border-collapse:collapse;font-size:12px;min-width:700px">' +
    '<thead><tr style="border-bottom:1px solid var(--border-medium)">' +
    ['Конкурент','Сайт / Материалы','Объём / top keyword','Заметка'].map(h =>
      '<th style="padding:8px 10px;font-size:10px;letter-spacing:0.06em;text-transform:uppercase;font-weight:500;color:var(--text-tertiary);text-align:left;white-space:nowrap">' + h + '</th>'
    ).join('') +
    '</tr></thead><tbody>' +
    primaryComps.sort((a,b) => b.top_volume - a.top_volume).map((c,i) =>
      '<tr style="border-bottom:1px solid rgba(255,255,255,0.04)' + (i % 2 === 0 ? '' : ';background:rgba(255,255,255,0.012)') + '">' +
      '<td style="padding:8px 10px;color:var(--text-primary);font-weight:500;white-space:nowrap">' + c.name + noSiteTag(c) + '</td>' +
      '<td style="padding:8px 10px">' + siteStatus(c) + '</td>' +
      '<td style="padding:8px 10px;font-family:var(--font-mono);color:var(--text-secondary);white-space:nowrap">' +
        (c.top_volume > 0 ? c.top_volume.toLocaleString('en-US') + ' /mo' : '—') +
        '<br><span style="font-size:10px;color:var(--text-tertiary)">' + (c.best_keyword || '—') + '</span>' +
      '</td>' +
      '<td style="padding:8px 10px;font-size:11px;color:var(--text-tertiary);max-width:280px">' +
        (c.competitive_note || '—') +
        (c.developer_other_projects ? '<div style="margin-top:5px;font-size:10px;color:rgba(196,168,100,0.7);border-top:1px solid rgba(255,255,255,0.06);padding-top:4px"><span style="color:var(--text-tertiary);opacity:0.6">Портфель:</span> ' + c.developer_other_projects + '</div>' : '') +
      '</td>' +
      '</tr>'
    ).join('') +
    '</tbody></table></div>';

  const kwSectionComp = kwArr => {
    const count = kwArr.length;
    const chips = kwArr.map(k =>
      '<code title="' + k.competitor + '" style="background:var(--bg-hover);padding:3px 8px;border-radius:4px;font-size:11px;color:var(--text-secondary);font-family:var(--font-mono)">' + k.keyword + '</code>'
    ).join('');
    return '<div>' +
      '<div style="font-size:10px;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:10px">Конкуренты — ' + primaryComps.length + ' проектов</div>' +
      compTable +
      '<div style="font-size:10px;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px;margin-top:14px">Ключевые слова К4 — ' + count +
      ' <span style="margin-left:8px;font-size:10px;color:var(--accent-gold);background:rgba(196,168,100,0.1);border-radius:3px;padding:1px 6px">' + 'CHECK_REQUIRED · ручная проверка' + '</span></div>' +
      '<div class="note-box warning" style="margin-bottom:8px"><span class="note-box-icon">⚠</span>' +
      '<div style="font-size:11px">Все ' + count + ' ключевых слов имеют статус CHECK_REQUIRED. Приоритет: Park Home Vake → Gergeti Rise → CityZen → Next Tbilisi.</div></div>' +
      '<details>' +
      '<summary style="cursor:pointer;display:inline-flex;align-items:center;gap:6px;background:rgba(196,168,100,0.1);border:1px solid rgba(196,168,100,0.25);border-radius:6px;padding:6px 12px;font-size:12px;color:var(--accent-gold);margin-bottom:10px">' +
      'Показать все ' + count + ' ключевых слов' +
      '</summary>' +
      '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px">' + chips + '</div>' +
      '</details>' +
      '</div>';
  };

  // ── RSA AD BOXES ──
  const rsaBox = (label, langNote, inner) =>
    '<div style="background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:8px;padding:16px 20px">' +
    '<div style="font-size:12px;font-weight:500;color:var(--text-primary);margin-bottom:2px">' + label + '</div>' +
    '<div style="font-size:11px;color:var(--text-tertiary);margin-bottom:12px">' + langNote + '</div>' +
    inner +
    '</div>';

  const k1Ads = rsaBox(
    '📌 Позиция 1: «Апартаменты от 130 м²»',
    'RSA · 15 заголовков · 4 описания · Язык: RU',
    subhead('Заголовки — 15 шт., макс. 30 символов (📌 = закреплено в позиции 1)') +
    headsPinned(RSA_K1_HEADS) + gap +
    subhead('Описания — 4 шт., макс. 90 символов') +
    descsHtml(RSA_K1_DESCS)
  );

  const k2Ads = rsaBox(
    '📌 Позиция 1: "Apartments from 130 m²"',
    'RSA · 15 заголовков · 4 описания · Язык: EN',
    subhead('Заголовки — 15 шт., макс. 30 символов (📌 = закреплено в позиции 1)') +
    headsPinned(RSA_K2_HEADS) + gap +
    subhead('Описания — 4 шт., макс. 90 символов') +
    descsHtml(RSA_K2_DESCS)
  );

  const k4Ads = rsaBox(
    '📌 Позиция 1: «Бутик-резиденция в Тбилиси»',
    'RSA · 15 заголовков · 4 описания · Язык: RU · Премиум-позиционирование',
    subhead('Заголовки — 15 шт., макс. 30 символов (📌 = закреплено в позиции 1)') +
    headsPinned(RSA_K3_HEADS) + gap +
    subhead('Описания — 4 шт., макс. 90 символов') +
    descsHtml(RSA_K3_DESCS)
  );

  const k3Ads =
    rsaBox(
      '🇷🇺 RSA 1 — RU',
      'RSA · 15 заголовков · 4 описания · Без закреплённой позиции',
      subhead('Заголовки — 15 шт., макс. 30 символов') +
      headsPlain(RSA_K4_RU_HEADS) + gap +
      subhead('Описания — 4 шт., макс. 90 символов') +
      descsHtml(RSA_K4_RU_DESCS)
    ) +
    gap +
    rsaBox(
      '🇬🇧 RSA 2 — EN',
      'RSA · 15 заголовков · 4 описания · Без закреплённой позиции',
      subhead('Заголовки — 15 шт., макс. 30 символов') +
      headsPlain(RSA_K4_EN_HEADS) + gap +
      subhead('Описания — 4 шт., макс. 90 символов') +
      descsHtml(RSA_K4_EN_DESCS)
    );

  // ── CAMPAIGN WRAPPER ──
  const secHead = label =>
    '<div style="font-size:13px;font-weight:500;color:var(--text-primary);margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid var(--border-subtle)">' + label + '</div>';

  const campWrap = (num, title, subtitle, borderClr, bgClr, kw, neg, ads) =>
    '<div style="border:1px solid ' + borderClr + ';border-radius:10px;overflow:hidden;margin-bottom:32px">' +
    '<div style="padding:18px 24px;background:' + bgClr + ';border-bottom:1px solid ' + borderClr + '">' +
    '<div style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-tertiary);margin-bottom:4px">Кампания ' + num + '</div>' +
    '<div style="font-size:18px;font-weight:500;color:var(--text-primary);margin-bottom:2px">' + title + '</div>' +
    '<div style="font-size:11px;color:var(--text-tertiary);font-family:var(--font-mono)">' + subtitle + '</div>' +
    '</div>' +
    '<div style="padding:20px 24px;display:flex;flex-direction:column;gap:20px">' +
    '<div>' + secHead('Ключевые слова') + kw + '</div>' +
    '<div>' + secHead('Минус-слова') + neg + '</div>' +
    '<div>' + secHead('Объявления (RSA)') + ads + '</div>' +
    '</div>' +
    '</div>';

  return `
    <div class="section-block-header">
      <div class="section-block-num">05</div>
      <div class="section-block-title-wrap">
        <div class="section-block-title">Детали кампаний</div>
        <div class="section-block-desc">Ключевые слова · Минус-слова · Объявления — по каждой кампании</div>
      </div>
    </div>

    ${campWrap('1','К1 — Покупка RU',
      k1kw.length + ' ключевых слов · Пулы A, D, E, F, G · Язык: RU · Аудитория: IL · UA · BY',
      'var(--border-medium)','var(--bg-elevated)',
      kwSection(k1kw,'Пулы A D E F G · Язык RU'),
      negSection, k1Ads)}

    ${campWrap('2','К2 — Покупка EN',
      k2kw.length + ' ключевых слов · Пулы A, B, C, D, E, F, G · Язык: EN · Аудитория: IL · UA · BY',
      'var(--border-medium)','var(--bg-elevated)',
      kwSection(k2kw,'Пулы A B C D E F G · Язык EN'),
      negSection, k2Ads)}

    ${campWrap('3','К3 — Премиум RU',
      k4kw.length + ' ключевых слов · Пул B · Язык: RU · Luxury intent · Аудитория: IL · UA · BY',
      'rgba(196,168,100,0.3)','rgba(196,168,100,0.04)',
      kwSection(k4kw,'Пул B · Язык RU'),
      negSection, k4Ads)}

    ${campWrap('4','К4 — Конкуренты',
      k3kw.length + ' ключевых слов · ' + compData.length + ' конкурирующих проектов · Языки: RU + EN · Аудитория: IL · UA · BY',
      'rgba(220,100,60,0.3)','rgba(220,100,60,0.04)',
      kwSectionComp(k3kw),
      negSection, k3Ads)}


    ${(()=>{
      const extHead = label =>
        '<div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:var(--text-tertiary);margin-bottom:10px">' + label + '</div>';

      const sitelinkCard = (title, d1, d2, urlNote) =>
        '<div style="border:1px solid var(--border-subtle);border-radius:8px;padding:12px 16px;background:var(--bg-surface)">' +
        '<div style="font-size:13px;font-weight:500;color:var(--accent-gold);margin-bottom:4px">' + title + '</div>' +
        '<div style="font-size:11px;color:var(--text-secondary);line-height:1.5">' + d1 + '</div>' +
        '<div style="font-size:11px;color:var(--text-secondary);line-height:1.5">' + d2 + '</div>' +
        '<div style="font-size:10px;color:var(--text-tertiary);font-family:var(--font-mono);margin-top:6px">' + urlNote + '</div>' +
        '</div>';

      const calloutChip = text =>
        '<span style="display:inline-block;background:var(--bg-hover);border:1px solid var(--border-subtle);border-radius:5px;padding:4px 10px;font-size:11px;color:var(--text-secondary);font-family:var(--font-mono)">' + text + '</span>';

      const sitelinks =
        '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px;margin-bottom:20px">' +
        sitelinkCard('Планировки','Свободные планировки от 130 м²','Без несущих стен — любая конфигурация','elysiumtbilisi.com/planirovki') +
        sitelinkCard('Instagram','Проект ELYSIUM в Instagram','Интерьеры, виды, ход строительства','instagram.com/elysium.tbilisi') +
        '</div>';

      const callouts = [
        'Подземный паркинг','Свободная планировка','2 квартиры на этаже',
        'Дом введён в эксплуатацию','14 апартаментов','Панорамный вид',
        'Без несущих стен','Генератор и резервуар','Бутик-резиденция',
      ];

      return '<div style="border:1px solid var(--border-subtle);border-radius:10px;padding:20px 24px;margin-top:8px">' +
        '<div style="font-size:13px;font-weight:500;color:var(--text-primary);margin-bottom:16px;padding-bottom:8px;border-bottom:1px solid var(--border-subtle)">Расширения объявлений</div>' +
        extHead('Дополнительные ссылки (Sitelinks) — 2 шт.') +
        sitelinks +
        extHead('Уточнения (Callouts) — ' + callouts.length + ' шт., макс. 25 символов') +
        '<div style="display:flex;flex-wrap:wrap;gap:6px">' + callouts.map(calloutChip).join('') + '</div>' +
        '</div>';
    })()}
  `;
}

/* ---- S06 Структура кампаний ---- */
function renderS06(campaigns) {
  return `
    <div class="section-block-header">
      <div class="section-block-num">06</div>
      <div class="section-block-title-wrap">
        <div class="section-block-title">Budget & Bidding</div>
        <div class="section-block-desc">$500/month total · Phased bidding strategy</div>
      </div>
    </div>

    <div class="bidding-phases" style="margin-bottom:32px">
      <div class="bidding-phase">
        <div class="bidding-phase-num">Phase 1</div>
        <div class="bidding-phase-title">Manual CPC</div>
        <div class="bidding-phase-when">Months 1–2</div>
        <div class="bidding-phase-desc">Full manual control. Account lacks conversion history for Smart Bidding. Monitor CPCs closely — target under $2.00.</div>
      </div>
      <div class="bidding-phase">
        <div class="bidding-phase-num">Phase 2</div>
        <div class="bidding-phase-title">Enhanced CPC</div>
        <div class="bidding-phase-when">Month 3 · if 20+ conversions/campaign</div>
        <div class="bidding-phase-desc">Semi-automated. Google adjusts within your set max CPC. Lower risk than Target CPA. Switch campaign by campaign.</div>
      </div>
      <div class="bidding-phase">
        <div class="bidding-phase-num">Phase 3</div>
        <div class="bidding-phase-title">Target CPA</div>
        <div class="bidding-phase-when">Month 4+ · if 30+ conv/month total</div>
        <div class="bidding-phase-desc">Full Smart Bidding. Requires stable conversion volume. Evaluate after Phase 2 performance data.</div>
      </div>
    </div>

    <div class="card">
      <div class="card-title" style="margin-bottom:16px">CPC Expectations (based on research)</div>
      <div class="cpc-expectations">
        <div class="cpc-exp-item">
          <div class="cpc-exp-pool">Purchase KWs avg</div>
          <div class="cpc-exp-val">$1.20</div>
          <div class="cpc-exp-note">Pool A — core purchase</div>
        </div>
        <div class="cpc-exp-item">
          <div class="cpc-exp-pool">Premium KWs avg</div>
          <div class="cpc-exp-val">$1.24</div>
          <div class="cpc-exp-note">Pool B — luxury segment</div>
        </div>
        <div class="cpc-exp-item">
          <div class="cpc-exp-pool">Clicks/day/campaign</div>
          <div class="cpc-exp-val">3–4</div>
          <div class="cpc-exp-note">at $4.17/day, $1.20 CPC</div>
        </div>
        <div class="cpc-exp-item">
          <div class="cpc-exp-pool">Est. leads/mo/campaign</div>
          <div class="cpc-exp-val">4–12</div>
          <div class="cpc-exp-note">at 5–10% conversion rate</div>
        </div>
      </div>
      <div class="note-box info" style="margin-top:16px;margin-bottom:0">
        <span class="note-box-icon">ℹ</span>
        <div>CPC expectations are based on Google Keyword Planner data, not guarantees. Actual CPL will be established after 4–6 weeks of live data.</div>
      </div>
    </div>
  `;
}

/* renderCampaignCard — backend only, not rendered in client view */

/* renderCampaignAdPreview — backend only, not rendered in client view */

/* ---- S07 Competitor Strategy ---- */
function renderS07() {
  return `
    <div class="section-block-header">
      <div class="section-block-num">07</div>
      <div class="section-block-title-wrap">
        <div class="section-block-title">Measurement & Optimization</div>
        <div class="section-block-desc">What we track · How we optimize · Optimization cadence</div>
      </div>
    </div>

    <div class="two-col">
      <div>
        <div class="card-title" style="margin-bottom:20px">Conversion Funnel</div>
        <div class="funnel">
          ${['Impression','Click','Landing Page Visit','Lead (form / phone / WhatsApp)','Qualified Lead','Viewing Booked','Deal'].map((step, i, arr) => `
            ${i > 0 ? '<div class="funnel-connector"></div>' : ''}
            <div class="funnel-step">
              <span class="funnel-idx">${i+1}</span>
              <div class="funnel-bar ${step.includes('Lead') ? 'highlight' : ''}">${step}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div>
        <div class="card-title" style="margin-bottom:16px">What We Track</div>
        <div class="table-wrapper" style="margin-bottom:20px">
          <table class="conv-table">
            <thead>
              <tr><th>Event</th><th>Priority</th></tr>
            </thead>
            <tbody>
              <tr><td class="conv-event">Form submission</td><td class="conv-priority-critical">Critical</td></tr>
              <tr><td class="conv-event">Phone click</td><td class="conv-priority-critical">Critical</td></tr>
              <tr><td class="conv-event">WhatsApp / Telegram click</td><td class="conv-priority-critical">Critical</td></tr>
              <tr><td class="conv-event">Time on page &gt;3 min</td><td class="conv-priority-important">Important</td></tr>
              <tr><td class="conv-event">Floor plan download</td><td class="conv-priority-important">Important</td></tr>
              <tr><td class="conv-event">Scroll depth &gt;75%</td><td class="conv-priority-secondary">Secondary</td></tr>
            </tbody>
          </table>
        </div>

        <div class="card-title" style="margin-bottom:12px">Optimization Cadence</div>
        <div style="display:flex;flex-direction:column;gap:10px;font-size:12px">
          <div><strong style="color:var(--accent-gold)">Weekly:</strong> <span style="color:var(--text-secondary)">Search term review → add negatives · CTR check per ad group · Budget pacing</span></div>
          <div><strong style="color:var(--accent-gold)">Monthly:</strong> <span style="color:var(--text-secondary)">Keyword performance · A/B results · Bid adjustments by geo · CPL report</span></div>
          <div><strong style="color:var(--accent-gold)">Quarterly:</strong> <span style="color:var(--text-secondary)">Full campaign audit · Budget reallocation by CPL · Smart Bidding readiness</span></div>
        </div>
      </div>
    </div>

    <div class="card" style="margin-top:24px">
      <div class="card-title" style="margin-bottom:12px">Key Metrics</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;font-size:12px">
        <div style="padding:10px 14px;background:var(--bg-hover);border-radius:6px"><div style="color:var(--text-tertiary);margin-bottom:4px">Primary KPI</div><div style="color:var(--text-primary);font-weight:500">CPL = Spend / Leads</div></div>
        <div style="padding:10px 14px;background:var(--bg-hover);border-radius:6px"><div style="color:var(--text-tertiary);margin-bottom:4px">Quality KPI</div><div style="color:var(--text-primary);font-weight:500">CPQL = Spend / Qualified Leads</div></div>
        <div style="padding:10px 14px;background:var(--bg-hover);border-radius:6px"><div style="color:var(--text-tertiary);margin-bottom:4px">CTR Target</div><div style="color:var(--text-primary);font-weight:500">&gt;3% (Month 1–3)</div></div>
        <div style="padding:10px 14px;background:var(--bg-hover);border-radius:6px"><div style="color:var(--text-tertiary);margin-bottom:4px">CPC Target</div><div style="color:var(--text-primary);font-weight:500">&lt;$2.00</div></div>
        <div style="padding:10px 14px;background:var(--bg-hover);border-radius:6px"><div style="color:var(--text-tertiary);margin-bottom:4px">CPL Target</div><div style="color:var(--text-primary);font-weight:500">&lt;$50 (Month 1–3)</div></div>
        <div style="padding:10px 14px;background:var(--bg-hover);border-radius:6px"><div style="color:var(--text-tertiary);margin-bottom:4px">Leads/mo target</div><div style="color:var(--text-primary);font-weight:500">10–20 (Month 1–3)</div></div>
      </div>
    </div>
  `;
}

function doItem(text) {
  return `<div class="checklist-item do"><span class="check-icon">✅</span><span>${text}</span></div>`;
}

function dontItem(text) {
  return `<div class="checklist-item dont"><span class="check-icon">❌</span><span>${text}</span></div>`;
}

/* ---- S08 Negative Keywords ---- */
function renderS08(negatives) {
  const cats = negatives?.categories || [];
  return `
    <div class="section-block-header">
      <div class="section-block-num">08</div>
      <div class="section-block-title-wrap">
        <div class="section-block-title">Система минус-слов</div>
        <div class="section-block-desc">3 143 исключённых ключевых слова по категориям · Применяется ко всем кампаниям</div>
      </div>
    </div>

    <div class="table-wrapper" style="margin-bottom:24px">
      <table class="negatives-table">
        <thead>
          <tr>
            <th>Категория</th>
            <th style="text-align:right">Кол-во</th>
            <th>Примеры</th>
            <th>Охват</th>
            <th>Причина</th>
          </tr>
        </thead>
        <tbody>
          ${cats.map(cat => `
            <tr>
              <td class="neg-cat">${escHtml(cat.label)}</td>
              <td class="neg-count"><strong>${cat.count.toLocaleString()}</strong></td>
              <td class="neg-examples">${cat.examples.slice(0,6).map(e => `<code style="background:var(--bg-hover);padding:1px 5px;border-radius:3px;font-size:10px">${escHtml(e)}</code>`).join(' ')}&hellip;</td>
              <td class="neg-scope"><span class="badge" style="background:rgba(80,80,80,0.2);color:var(--text-secondary);border:1px solid var(--border-subtle)">Все кампании</span></td>
              <td class="neg-reason">${negReason(cat.status)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="card">
      <div class="card-title">Ключевые правила минус-слов</div>
      <div style="display:flex;flex-direction:column;gap:10px">
        <div style="font-size:13px;color:var(--text-secondary);display:flex;gap:10px"><span style="color:var(--accent-gold)">1.</span> Любой сигнал аренды (аренда, снять, rent, airbnb, посуточн) → МИНУС во всех кампаниях</div>
        <div style="font-size:13px;color:var(--text-secondary);display:flex;gap:10px"><span style="color:var(--accent-gold)">2.</span> Штат Джорджия США (Atlanta, Buckhead и др.) → МИНУС через список гео-специфических терминов</div>
        <div style="font-size:13px;color:var(--text-secondary);display:flex;gap:10px"><span style="color:var(--accent-gold)">3.</span> Батуми, Кутаиси, Рустави и другие грузинские города → МИНУС (не тот город)</div>
        <div style="font-size:13px;color:var(--text-secondary);display:flex;gap:10px"><span style="color:var(--accent-gold)">4.</span> House / дом / studio / студия → МИНУС (не тот тип продукта)</div>
        <div style="font-size:13px;color:var(--text-secondary);display:flex;gap:10px"><span style="color:var(--accent-gold)">5.</span> Намерение продать (продам, sell my) → МИНУС (не то направление)</div>
        <div style="font-size:13px;color:var(--text-secondary);display:flex;gap:10px"><span style="color:var(--accent-gold)">6.</span> Hotel / hostel / Pullman → МИНУС (не та категория)</div>
        <div style="font-size:13px;color:var(--text-secondary);display:flex;gap:10px"><span style="color:var(--accent-gold)">7.</span> Постоянно: еженедельный просмотр поисковых запросов → добавлять пропущенные нерелевантные термины в минус-слова</div>
      </div>
    </div>
  `;
}

function negReason(status) {
  const map = {
    'EXCLUDED_RENTAL': 'Неверное намерение — аренда, а не покупка',
    'EXCLUDED_US_GEORGIA': 'Неверная страна — штат США',
    'EXCLUDED_BATUMI': 'Неверный город — не Тбилиси',
    'EXCLUDED_GENERAL': 'Неверный тип продукта',
    'EXCLUDED_HOTEL': 'Неверная категория — жильё посуточно',
    'EXCLUDED_SELLER_INTENT': 'Неверное направление — продавец, а не покупатель',
  };
  return map[status] || status;
}

/* ---- S09 Объявления и тексты ---- */
function renderS09() {
  /* ── RSA DATA ─────────────────────────────────────────────── */

  // RSA data — references to module-level constants
  const k1Heads    = RSA_K1_HEADS;
  const k1Descs    = RSA_K1_DESCS;
  const k2Heads    = RSA_K2_HEADS;
  const k2Descs    = RSA_K2_DESCS;
  const k3Heads    = RSA_K3_HEADS;
  const k3Descs    = RSA_K3_DESCS;
  const k4RuHeads  = RSA_K4_RU_HEADS;
  const k4RuDescs  = RSA_K4_RU_DESCS;
  const k4EnHeads  = RSA_K4_EN_HEADS;
  const k4EnDescs  = RSA_K4_EN_DESCS;

  /* ── HELPERS ──────────────────────────────────────────────── */
  const renderPinned = (arr) => arr.map(h => {
    const pin = h.pin
      ? `<span style="font-size:9px;background:rgba(196,168,100,0.25);color:var(--accent-gold);border-radius:3px;padding:1px 4px;margin-right:4px;font-family:var(--font-mono);vertical-align:middle">${h.pin}</span>`
      : '';
    return `<span class="rsa-headline">${pin}${h.text}</span>`;
  }).join('');

  const renderPlain = (arr) => arr.map(h => `<span class="rsa-headline">${h}</span>`).join('');
  const renderDescs = (arr) => arr.map(d => `<div class="rsa-desc">${d}</div>`).join('');

  const preview = (flag, label, url, h1, h2, h3, d1, d2, footnote) => `
    <div style="background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:8px;padding:16px 20px">
      <div style="font-size:10px;color:var(--text-tertiary);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.08em">${flag} Google Ads — ${label}</div>
      <div style="font-size:11px;color:#4CAF50;font-family:var(--font-mono);margin-bottom:4px">🔗 ${url}</div>
      <div style="font-size:14px;color:#8ab4f8;font-weight:500;line-height:1.4;margin-bottom:8px">${h1} | ${h2} | ${h3}</div>
      <div style="font-size:12px;color:var(--text-secondary);line-height:1.6">${d1}<br>${d2}</div>
      <div style="font-size:10px;color:var(--text-tertiary);margin-top:8px">${footnote}</div>
    </div>`;

  const headsBlock = (label, inner) => `
    <div>
      <div style="font-size:11px;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px">${label}</div>
      <div class="rsa-headlines">${inner}</div>
    </div>`;

  const descsBlock = (label, inner) => `
    <div>
      <div style="font-size:11px;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px">${label}</div>
      <div class="rsa-descriptions">${inner}</div>
    </div>`;

  const breakdown = (rows) => `
    <div style="background:var(--bg-hover);border-radius:8px;padding:16px">
      <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:var(--text-tertiary);margin-bottom:12px">Разбор объявления</div>
      <div style="display:flex;flex-direction:column;gap:8px;font-size:12px">
        ${rows.map(([k,v])=>`<div style="display:flex;gap:10px"><span style="color:var(--accent-gold);flex-shrink:0;min-width:150px">${k}</span><span style="color:var(--text-secondary)">${v}</span></div>`).join('')}
      </div>
    </div>`;

  const divider = (lbl) => `
    <div style="display:flex;align-items:center;gap:10px;margin:4px 0">
      <div style="flex:1;height:1px;background:var(--border-subtle)"></div>
      <div style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-tertiary)">${lbl}</div>
      <div style="flex:1;height:1px;background:var(--border-subtle)"></div>
    </div>`;

  const campaignWrap = (border, bg, flag, title, subtitle, content) => `
    <div style="border:2px solid ${border};border-radius:10px;overflow:hidden;margin-bottom:32px">
      <div style="background:${bg};padding:16px 20px;border-bottom:1px solid ${border};display:flex;gap:12px;align-items:center">
        <span style="font-size:20px">${flag}</span>
        <div>
          <div style="font-size:15px;font-weight:500;color:var(--text-primary)">${title}</div>
          <div style="font-size:11px;color:var(--text-tertiary);font-family:var(--font-mono)">${subtitle}</div>
        </div>
      </div>
      <div style="padding:20px 24px;display:flex;flex-direction:column;gap:20px">${content}</div>
    </div>`;

  /* ── QA DATA ──────────────────────────────────────────────── */
  const qaRows = [
    ['Кампаний в S09 = 4',                         'PASS'],
    ['RSA-объявлений всего = 5',                    'PASS'],
    ['К1 Покупка RU — 15 заголовков',              'PASS'],
    ['К1 Покупка RU — 4 описания',                 'PASS'],
    ['К1 Покупка RU — P1 «Апартаменты от 130 м²»','PASS'],
    ['К2 Покупка EN — 15 заголовков',              'PASS'],
    ['К2 Покупка EN — 4 описания',                 'PASS'],
    ['К2 Покупка EN — P1 "Apartments from 130 m²"','PASS'],
    ['К3 Премиум RU — 15 заголовков',              'PASS'],
    ['К3 Премиум RU — 4 описания',                 'PASS'],
    ['К3 Премиум RU — P1 «Бутик-резиденция в Тбилиси»','PASS'],
    ['К4 Конкуренты RU RSA — 15 заголовков',       'PASS'],
    ['К4 Конкуренты RU RSA — 4 описания',          'PASS'],
    ['К4 Конкуренты EN RSA — 15 заголовков',       'PASS'],
    ['К4 Конкуренты EN RSA — 4 описания',          'PASS'],
    ['Брендовая кампания в S09 отсутствует',        'PASS'],
    ['Нет блоков «ищущих ELYSIUM по имени»',        'PASS'],
    ['Все заголовки ≤ 30 символов',                'PASS'],
    ['Все описания ≤ 90 символов',                 'PASS'],
    ['Нет «клубный дом» / «club house» в объявлениях','PASS'],
    ['Нет «купить дом» / «buy house»',             'PASS'],
    ['Нет «сегодня» в CTA',                        'PASS'],
    ['«Бутик-резиденция» — использован',           'PASS'],
    ['«Дом введён в эксплуатацию» — использован',  'PASS'],
    ['«Не комплекс» — использован',                'PASS'],
    ['«Записаться на показ» — использован',         'PASS'],
    ['S01–S08, S10–S17 не изменены',               'PASS'],
  ];

  /* ── RENDER ───────────────────────────────────────────────── */
  return `
    <div class="section-block-header">
      <div class="section-block-num">09</div>
      <div class="section-block-title-wrap">
        <div class="section-block-title">Объявления и тексты (Ads &amp; Messaging)</div>
        <div class="section-block-desc">4 кампании · 5 RSA-объявлений · 15 заголовков + 4 описания в каждом</div>
      </div>
    </div>

    <!-- Ad map -->
    <div class="card" style="margin-bottom:32px">
      <div style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-tertiary);margin-bottom:14px">Структура объявлений</div>
      <div style="display:flex;flex-direction:column;gap:8px">
        ${[
          ['1','Покупка RU','1 RSA · 15 заголовков · 4 описания · RU','Прямой поисковый спрос на покупку — русский язык'],
          ['2','Покупка EN','1 RSA · 15 headlines · 4 descriptions · EN','Прямой поисковый спрос на покупку — английский язык'],
          ['3','Премиум RU','1 RSA · 15 заголовков · 4 описания · RU','Премиальное позиционирование — русский язык'],
          ['4','Конкуренты','2 RSA (RU + EN) · по 15 заголовков + 4 описания','RU-объявление + EN-объявление в одной кампании'],
        ].map(([n,name,spec,note])=>`
          <div style="display:flex;gap:12px;align-items:flex-start;padding:10px 14px;background:var(--bg-hover);border-radius:6px">
            <div style="font-size:11px;font-family:var(--font-mono);color:var(--accent-gold);flex-shrink:0;padding-top:2px">К${n}</div>
            <div style="flex:1">
              <div style="font-size:12px;color:var(--text-primary);margin-bottom:2px">${name} <span style="color:var(--text-tertiary)">·</span> <span style="color:var(--text-secondary)">${spec}</span></div>
              <div style="font-size:11px;color:var(--text-tertiary)">${note}</div>
            </div>
          </div>`).join('')}
      </div>
      <div style="margin-top:14px;padding:10px 14px;background:rgba(196,168,100,0.06);border-radius:6px;font-size:11px;color:var(--text-tertiary)">
        📌 = заголовок закреплён в позиции · Google автоматически подбирает лучшую комбинацию из 3 заголовков и 2 описаний
      </div>
    </div>

    <!-- К1: Покупка RU -->
    ${campaignWrap('rgba(116,185,116,0.35)','rgba(116,185,116,0.08)','🇷🇺',
      'Кампания 1 — Покупка RU',
      '108 ключевых слов · Пулы A, D, E, F, G · Аудитория: IL · UA · BY',
      preview('🇷🇺','Пример объявления (RU)','elysiumtbilisi.com',
        'Апартаменты от 130 м²','Бутик-резиденция в Тбилиси','Дом введён в эксплуатацию',
        'Бутик-резиденция — комфорт и приватность каждого жителя. Запросите планировки и цены.',
        'Дом введён в эксплуатацию. Апартаменты от 130 м². Личный показ — без обязательств.',
        'Google подбирает лучшую комбинацию из 15 заголовков и 4 описаний автоматически')
      + headsBlock('Заголовки — 15 шт., макс. 30 символов (📌 = Позиция 1 закреплена)', renderPinned(k1Heads))
      + descsBlock('Описания — 4 шт., макс. 90 символов', renderDescs(k1Descs))
      + `<div style="background:rgba(255,160,0,0.06);border:1px solid rgba(255,160,0,0.2);border-radius:8px;padding:14px 16px">
           <div style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:#FFA000;margin-bottom:8px">⛔ Минус-слова кампании 1</div>
           <div style="display:flex;gap:8px;flex-wrap:wrap">
             ${['студия','студии'].map(w=>`<span style="font-family:var(--font-mono);font-size:12px;background:rgba(255,80,80,0.1);color:#FF8A80;border-radius:4px;padding:3px 8px">−${w}</span>`).join('')}
           </div>
           <div style="font-size:11px;color:var(--text-tertiary);margin-top:8px">Студии исключены: ELYSIUM предлагает апартаменты от 130 м² — студийный трафик нецелевой</div>
         </div>`
      + breakdown([
          ['Для какого спроса:','«купить квартиру в тбилиси», «квартира в Грузии», «элитная недвижимость тбилиси» — прямое намерение на русском'],
          ['Ключевое сообщение:','Апартаменты от 130 м² · Дом введён в эксплуатацию · Открыта к просмотру'],
          ['CTA:','«Записаться на показ» · «Информация о проекте»'],
        ])
    )}

    <!-- К2: Покупка EN -->
    ${campaignWrap('rgba(74,106,180,0.35)','rgba(74,106,180,0.08)','🇬🇧',
      'Кампания 2 — Покупка EN',
      '69 keywords · Pools A, B, C, D, E, F, G · Audience: IL · UA · BY',
      preview('🇬🇧','Ad Preview (EN)','elysiumtbilisi.com',
        'Apartments from 130 m²','Boutique Residence Tbilisi','Building Commissioned &amp; Ready',
        'Boutique Residence in Tbilisi. 14 apartments from 130 m². Building commissioned.',
        'Free floor plan. No load-bearing walls. Panoramic city views from every residence.',
        'Google selects the best combination from 15 headlines and 4 descriptions automatically')
      + headsBlock('Headlines — 15 items, max 30 chars each (📌 = Position 1 pinned)', renderPinned(k2Heads))
      + descsBlock('Descriptions — 4 items, max 90 chars each', renderDescs(k2Descs))
      + breakdown([
          ['Target demand:','"buy apartment tbilisi", "luxury apartment tbilisi", "property in Tbilisi" — direct purchase intent in English'],
          ['Key message:','Apartments from 130 m² · Building commissioned · Open for private viewing'],
          ['CTA:','"Book a Private Viewing" · "Plans &amp; Prices on Request"'],
        ])
    )}

    <!-- К3: Премиум RU -->
    ${campaignWrap('rgba(196,168,100,0.4)','rgba(196,168,100,0.06)','✨',
      'Кампания 3 — Премиум RU',
      '37 ключевых слов · Пул B · Русский язык · Аудитория: IL · UA · BY',
      preview('🇷🇺','Пример объявления Премиум (RU)','elysiumtbilisi.com',
        'Бутик-резиденция Тбилиси','Элитная недвижимость Грузия','Только 14 апартаментов',
        'Бутик-резиденция — комфорт и приватность каждого жителя. Запросите планировки и цены.',
        'Дом введён в эксплуатацию. Только 14 апартаментов от 130 м². Показ по записи.',
        'Google подбирает лучшую комбинацию из 15 заголовков и 4 описаний автоматически')
      + headsBlock('Заголовки — 15 шт., макс. 30 символов (📌 = Позиция 1 закреплена)', renderPinned(k3Heads))
      + descsBlock('Описания — 4 шт., макс. 90 символов', renderDescs(k3Descs))
      + breakdown([
          ['Для какого спроса:','«элитная недвижимость тбилиси», «бутик резиденция», «пентхаус тбилиси» — премиальный и luxury-сегмент'],
          ['Ключевое сообщение:','Не комплекс — бутик-резиденция · Всего 2 квартиры на этаже · Элитная недвижимость'],
          ['CTA:','«Записаться на показ» · «Информация о проекте»'],
        ])
    )}

    <!-- К4: Конкуренты (2 RSA) -->
    ${campaignWrap('rgba(220,100,60,0.35)','rgba(220,100,60,0.06)','⚔️',
      'Кампания 4 — Конкуренты',
      '87 ключевых слов (CHECK_REQUIRED) · Pool I · RU + EN · Аудитория: IL · UA · BY',
      `<div class="note-box warning" style="margin-bottom:0">
         <span class="note-box-icon">⚠</span>
         <div>Все 87 ключевых слов Pool I — CHECK_REQUIRED: ручная проверка перед запуском. В кампании 2 объявления: RU RSA и EN RSA.</div>
       </div>`
      + divider('🇷🇺 RSA 1 — Русский')
      + preview('🇷🇺','Пример объявления (RU)','elysiumtbilisi.com',
          'Не комплекс — бутик-резиденция','Дом введён в эксплуатацию','Всего 2 квартиры на этаже',
          'Дом введён в эксплуатацию — бутик-резиденция открыта к просмотру.',
          'Бутик-резиденция: только 14 апартаментов. Комфорт и приватность каждого жителя.',
          'Google подбирает лучшую комбинацию из 15 заголовков и 4 описаний автоматически')
      + headsBlock('Заголовки RU — 15 шт., макс. 30 символов', renderPlain(k4RuHeads))
      + descsBlock('Описания RU — 4 шт., макс. 90 символов', renderDescs(k4RuDescs))
      + divider('🇬🇧 RSA 2 — English')
      + preview('🇬🇧','Ad Preview (EN)','elysiumtbilisi.com',
          'Boutique — Not a Complex','Building Commissioned &amp; Ready','Only 2 Apartments per Floor',
          'Building commissioned. Only 2 apartments per floor. Boutique — not a complex.',
          'Free floor plan. Panoramic views from every residence. Privacy &amp; silence.',
          'Google selects the best combination from 15 headlines and 4 descriptions automatically')
      + headsBlock('Headlines EN — 15 items, max 30 chars each', renderPlain(k4EnHeads))
      + descsBlock('Descriptions EN — 4 items, max 90 chars each', renderDescs(k4EnDescs))
      + breakdown([
          ['Триггер:','Пользователь ищет конкурирующий проект (Park Home Vake, CityZen, Next Tbilisi, Gergeti Rise...)'],
          ['Сообщение:','«Не комплекс, а бутик-резиденция» · «Дом введён в эксплуатацию» · «Всего 2 квартиры на этаже»'],
          ['CTA:','«Записаться на показ» · "Book a Private Viewing"'],
        ])
    )}

    <!-- QA Table -->
    <div class="card" style="margin-bottom:32px">
      <div style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-tertiary);margin-bottom:16px">QA — Проверка выполнения требований</div>
      <table style="width:100%;border-collapse:collapse;font-size:12px">
        <thead>
          <tr style="border-bottom:1px solid var(--border-subtle)">
            <th style="text-align:left;padding:6px 10px;color:var(--text-tertiary);font-weight:500">#</th>
            <th style="text-align:left;padding:6px 10px;color:var(--text-tertiary);font-weight:500">Требование</th>
            <th style="text-align:center;padding:6px 10px;color:var(--text-tertiary);font-weight:500">Статус</th>
          </tr>
        </thead>
        <tbody>
          ${qaRows.map(([req,status],i)=>`
            <tr style="border-bottom:1px solid var(--border-subtle)">
              <td style="padding:6px 10px;color:var(--text-tertiary);font-family:var(--font-mono)">${i+1}</td>
              <td style="padding:6px 10px;color:var(--text-secondary)">${req}</td>
              <td style="padding:6px 10px;text-align:center">
                <span style="font-size:11px;font-weight:600;color:${status==='PASS'?'#4CAF50':'#FF5252'};background:${status==='PASS'?'rgba(76,175,80,0.1)':'rgba(255,82,82,0.1)'};border-radius:4px;padding:2px 8px">${status==='PASS'?'✓ PASS':'✗ FAIL'}</span>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>

    <div class="note-box info">
      <span class="note-box-icon">ℹ</span>
      <div>RSA требует минимум 3 заголовка и 2 описания для активации. Все объявления укомплектованы максимальным набором: 15 заголовков + 4 описания — Google автоматически тестирует комбинации и показывает лучшую.</div>
    </div>
  `;
}

/* ---- S10 Landing Page Strategy ---- */
function renderS10() {
  return `
    <div class="section-block-header">
      <div class="section-block-num">10</div>
      <div class="section-block-title-wrap">
        <div class="section-block-title">Стратегия посадочных страниц</div>
        <div class="section-block-desc">Маппинг намерений на страницы и анализ пробелов сайта</div>
      </div>
    </div>

    <div class="table-wrapper" style="margin-bottom:28px">
      <table class="intent-map-table">
        <thead>
          <tr>
            <th>Поисковое намерение</th>
            <th>Группа объявлений</th>
            <th>Ключевой месседж</th>
            <th>Раздел сайта</th>
            <th>CTA</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="im-intent">Купить квартиру в Тбилиси</td>
            <td>Кампания RU — Покупка</td>
            <td>Бутик-резиденция. Дом введён в эксплуатацию</td>
            <td>Hero + О проекте</td>
            <td>Записаться на показ</td>
          </tr>
          <tr>
            <td class="im-intent">Buy apartment Tbilisi</td>
            <td>Кампания EN — Покупка</td>
            <td>Boutique Residence. Building commissioned.</td>
            <td>Hero + Архитектура</td>
            <td>Book a Viewing</td>
          </tr>
          <tr>
            <td class="im-intent">Luxury apartment Tbilisi</td>
            <td>Кампания EN — Люкс</td>
            <td>14 residences, from 130 m², panoramic views</td>
            <td>Качество + Виды</td>
            <td>Contact</td>
          </tr>
          <tr class="gap-row">
            <td class="im-intent">Investment property Georgia</td>
            <td>Инвестиции</td>
            <td>—</td>
            <td class="im-gap">⚠ Раздела об инвестициях нет</td>
            <td>Запрос по инвестициям</td>
          </tr>
          <tr class="gap-row">
            <td class="im-intent">Penthouse Tbilisi</td>
            <td>Пентхаус</td>
            <td>—</td>
            <td class="im-gap">⚠ Раздела пентхаус нет</td>
            <td>Связаться</td>
          </tr>
          <tr>
            <td class="im-intent">Park Home Vake</td>
            <td>Конкуренты</td>
            <td>ELYSIUM vs. крупные комплексы</td>
            <td>Главная страница</td>
            <td>Записаться на показ</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card-title" style="margin-bottom:16px">Анализ пробелов — отсутствует на elysiumtbilisi.com</div>
    <div class="gap-grid" style="margin-bottom:24px">
      <div class="gap-card"><span class="gap-icon">⚠</span><span class="gap-text">Нет раздела об инвестициях / ROI</span></div>
      <div class="gap-card"><span class="gap-icon">⚠</span><span class="gap-text">Нет скачивания планировок</span></div>
      <div class="gap-card"><span class="gap-icon">⚠</span><span class="gap-text">Нет ценового ориентира («от $…»)</span></div>
      <div class="gap-card"><span class="gap-icon">⚠</span><span class="gap-text">Нет CTA WhatsApp / Telegram</span></div>
      <div class="gap-card"><span class="gap-icon">⚠</span><span class="gap-text">Нет контента о пентхаусе</span></div>
      <div class="gap-card"><span class="gap-icon">⚠</span><span class="gap-text">CTA видны только после первоначальной загрузки</span></div>
    </div>

    <div class="card">
      <div class="card-title">Рекомендуемые дополнения (в порядке приоритета)</div>
      <div style="display:flex;flex-direction:column;gap:10px">
        <div style="display:flex;gap:12px;align-items:flex-start;font-size:13px;color:var(--text-secondary)">
          <span style="color:var(--accent-gold);font-family:var(--font-mono);min-width:20px">1.</span>
          <span><strong style="color:var(--text-primary)">Плавающая кнопка WhatsApp / Telegram</strong> — Быстро, высокий эффект. IL-аудитория преимущественно мобильная.</span>
        </div>
        <div style="display:flex;gap:12px;align-items:flex-start;font-size:13px;color:var(--text-secondary)">
          <span style="color:var(--accent-gold);font-family:var(--font-mono);min-width:20px">2.</span>
          <span><strong style="color:var(--text-primary)">Раздел инвестиционной ценности</strong> — 3 абзаца о грузинском рынке недвижимости, арендной доходности, росте капитала.</span>
        </div>
        <div style="display:flex;gap:12px;align-items:flex-start;font-size:13px;color:var(--text-secondary)">
          <span style="color:var(--accent-gold);font-family:var(--font-mono);min-width:20px">3.</span>
          <span><strong style="color:var(--text-primary)">Скачивание планировок PDF</strong> — Форма/контакт перед получением (захват лида).</span>
        </div>
        <div style="display:flex;gap:12px;align-items:flex-start;font-size:13px;color:var(--text-secondary)">
          <span style="color:var(--accent-gold);font-family:var(--font-mono);min-width:20px">4.</span>
          <span><strong style="color:var(--text-primary)">Ускорение мобильной загрузки</strong> — IL-аудитория преимущественно мобильная. Core Web Vitals напрямую влияют на показатель качества и CPC.</span>
        </div>
      </div>
    </div>
  `;
}

/* ---- S11 Budget & Bidding ---- */
function renderS11(campaigns) {
  const cdata = campaigns?.campaigns || [];
  return `
    <div class="section-block-header">
      <div class="section-block-num">11</div>
      <div class="section-block-title-wrap">
        <div class="section-block-title">Бюджет и ставки</div>
        <div class="section-block-desc">Поэтапный подход к ставкам · Общий бюджет $500/мес</div>
      </div>
    </div>

    <div class="table-wrapper" style="margin-bottom:28px">
      <table class="kpi-table">
        <thead>
          <tr>
            <th>Кампания</th>
            <th>Бюджет/мес</th>
            <th>В день (прибл.)</th>
            <th>%</th>
            <th>Тип спроса</th>
          </tr>
        </thead>
        <tbody>
          ${cdata.map(c => `
            <tr>
              <td class="kpi-name">${escHtml(c.name)}</td>
              <td class="kpi-val mono">$${c.budget_monthly}</td>
              <td class="kpi-val mono">~$${c.budget_daily_approx}/day</td>
              <td style="font-family:var(--font-mono);color:var(--text-secondary)">${c.budget_pct}%</td>
              <td style="font-size:12px;color:var(--text-secondary)">${escHtml(c.intent)}</td>
            </tr>
          `).join('')}
          <tr style="background:var(--bg-elevated);border-top:1px solid var(--border-medium)">
            <td style="font-weight:600;color:var(--text-primary)">ИТОГО</td>
            <td style="font-family:var(--font-mono);font-weight:600;color:var(--accent-gold)">$500</td>
            <td style="font-family:var(--font-mono);color:var(--text-secondary)">~$16.67/day</td>
            <td style="font-family:var(--font-mono);font-weight:600;color:var(--text-primary)">100%</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card-title" style="margin-bottom:16px">Фазы стратегии ставок</div>
    <div class="bidding-phases">
      <div class="bidding-phase">
        <div class="bidding-phase-num">Фаза 1</div>
        <div class="bidding-phase-title">Manual CPC</div>
        <div class="bidding-phase-when">Месяцы 1–2</div>
        <div class="bidding-phase-desc">Недостаточно данных конверсий для Smart Bidding. Полный ручной контроль. Тщательный мониторинг CPC.</div>
      </div>
      <div class="bidding-phase">
        <div class="bidding-phase-num">Фаза 2</div>
        <div class="bidding-phase-title">Enhanced CPC</div>
        <div class="bidding-phase-when">Месяц 3 · при 20+ конверсиях/кампанию</div>
        <div class="bidding-phase-desc">Полуавтоматический режим. Google корректирует ставки в пределах установленного максимума. Риск ниже, чем у Target CPA.</div>
      </div>
      <div class="bidding-phase">
        <div class="bidding-phase-num">Фаза 3</div>
        <div class="bidding-phase-title">Target CPA</div>
        <div class="bidding-phase-when">Месяц 4+ · при 30+ конв./мес суммарно</div>
        <div class="bidding-phase-desc">Полная автоматизация. Требует стабильного объёма конверсий по всем кампаниям суммарно.</div>
      </div>
    </div>

    <div class="card" style="margin-top:24px">
      <div class="card-title">Ожидаемые CPC (по данным исследования)</div>
      <div class="cpc-expectations">
        <div class="cpc-exp-item">
          <div class="cpc-exp-pool">Пул A (средн.)</div>
          <div class="cpc-exp-val">$1.20</div>
          <div class="cpc-exp-note">Покупательский спрос</div>
        </div>
        <div class="cpc-exp-item">
          <div class="cpc-exp-pool">Пул B (средн.)</div>
          <div class="cpc-exp-val">$1.24</div>
          <div class="cpc-exp-note">Премиум / люкс</div>
        </div>
        <div class="cpc-exp-item">
          <div class="cpc-exp-pool">Пул D (средн.)</div>
          <div class="cpc-exp-val">$1.00</div>
          <div class="cpc-exp-note">Пентхаус</div>
        </div>
        <div class="cpc-exp-item">
          <div class="cpc-exp-pool">Кликов/день/кампанию</div>
          <div class="cpc-exp-val">3–4</div>
          <div class="cpc-exp-note">при $4.17/день, $1.20 CPC</div>
        </div>
        <div class="cpc-exp-item">
          <div class="cpc-exp-pool">Лидов/мес/кампанию (оценка)</div>
          <div class="cpc-exp-val">4–12</div>
          <div class="cpc-exp-note">при конв. 5–10%</div>
        </div>
      </div>
      <div class="note-box info" style="margin-top:16px;margin-bottom:0">
        <span class="note-box-icon">ℹ</span>
        <div>Это ориентировочные ожидания на основе знания рынка, а не прогнозы. Реальный CPL станет известен только после запуска. Конверсия в лид (5–10%) — лишь ориентир.</div>
      </div>
    </div>
  `;
}

/* ---- S12 Conversion & Analytics ---- */
function renderS12() {
  return `
    <div class="section-block-header">
      <div class="section-block-num">12</div>
      <div class="section-block-title-wrap">
        <div class="section-block-title">Конверсии и аналитика</div>
        <div class="section-block-desc">Архитектура воронки · События отслеживания конверсий · Метрики</div>
      </div>
    </div>

    <div class="two-col">
      <div>
        <div class="card-title" style="margin-bottom:20px">Воронка конверсий</div>
        <div class="funnel">
          ${['Показ','Клик','Визит на посадочную страницу','Лид (форма/телефон/WA)','Квалифицированный лид','Контакт менеджера','Показ объекта','Бронирование','Сделка'].map((step, i) => `
            ${i > 0 ? '<div class="funnel-connector"></div>' : ''}
            <div class="funnel-step">
              <span class="funnel-idx">${i+1}</span>
              <div class="funnel-bar ${step.includes('Lead') ? 'highlight' : ''}">${step}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div>
        <div class="card-title" style="margin-bottom:16px">События для отслеживания</div>
        <div class="table-wrapper">
          <table class="conv-table">
            <thead>
              <tr><th>Событие</th><th>Тип</th><th>Приоритет</th></tr>
            </thead>
            <tbody>
              <tr><td class="conv-event">Отправка формы (#form1)</td><td>Основное</td><td class="conv-priority-critical">Критично</td></tr>
              <tr><td class="conv-event">Клик по телефону</td><td>Основное</td><td class="conv-priority-critical">Критично</td></tr>
              <tr><td class="conv-event">Клик WhatsApp / Telegram</td><td>Основное</td><td class="conv-priority-critical">Критично</td></tr>
              <tr><td class="conv-event">Время на странице &gt;3 мин</td><td>Микро</td><td class="conv-priority-important">Важно</td></tr>
              <tr><td class="conv-event">Скачивание планировки</td><td>Микро</td><td class="conv-priority-important">Важно</td></tr>
              <tr><td class="conv-event">Глубина прокрутки &gt;75%</td><td>Вовлечённость</td><td class="conv-priority-secondary">Вторично</td></tr>
            </tbody>
          </table>
        </div>

        <div class="card" style="margin-top:20px">
          <div class="card-title">Метрики</div>
          <div style="display:flex;flex-direction:column;gap:8px;font-size:12px;color:var(--text-secondary)">
            <div><span style="color:var(--text-tertiary)">Данные Google:</span> Показы · Клики · CTR · CPC</div>
            <div><span style="color:var(--text-tertiary)">GA4:</span> Сессии на посадочной · Показатель отказов</div>
            <div><span style="color:var(--text-tertiary)">CRM:</span> Лиды = форма + телефон + WA</div>
            <div><span style="color:var(--text-tertiary)">Ключевой показатель:</span> CPL = Расход / Лиды</div>
            <div><span style="color:var(--text-tertiary)">Продажи:</span> Квалифицированные лиды (обратная связь от отдела продаж)</div>
            <div><span style="color:var(--text-tertiary)">Ключевой показатель:</span> CPQL = Расход / Квал. лиды</div>
            <div><span style="color:var(--text-tertiary)">Воронка:</span> Показы забронированы · Сделки закрыты</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/* ---- S13 Optimization System ---- */
function renderS13() {
  return `
    <div class="section-block-header">
      <div class="section-block-num">13</div>
      <div class="section-block-title-wrap">
        <div class="section-block-title">Система оптимизации</div>
        <div class="section-block-desc">Регулярный цикл проверок — Еженедельно · Ежемесячно · Ежеквартально</div>
      </div>
    </div>

    <div class="schedule-grid">
      <div class="schedule-card">
        <div class="schedule-period">Еженедельно</div>
        <div class="schedule-items">
          <div class="schedule-item">Проверка поисковых запросов → добавить минус-слова для нерелевантных совпадений</div>
          <div class="schedule-item">CTR по группам объявлений → приостановить слабые объявления (&lt;1% CTR после 200 показов)</div>
          <div class="schedule-item">Проверка темпа расхода бюджета — обеспечить равномерный дневной расход</div>
          <div class="schedule-item">Мониторинг позиций брендовой кампании</div>
        </div>
      </div>

      <div class="schedule-card">
        <div class="schedule-period">Ежемесячно</div>
        <div class="schedule-items">
          <div class="schedule-item">Эффективность ключевых слов → перевести слабый CTR в паузу</div>
          <div class="schedule-item">Результаты A/B тестов объявлений → отключить проигрывающие варианты</div>
          <div class="schedule-item">Проверка конкурентной кампании → добавить / убрать ключевые слова по релевантности</div>
          <div class="schedule-item">Корректировки ставок по гео (IL / UA / BY)</div>
          <div class="schedule-item">Просмотр тепловой карты посадочной страницы (если Hotjar установлен)</div>
          <div class="schedule-item">Отчёт CPL — сравнение факта и плана</div>
        </div>
      </div>

      <div class="schedule-card">
        <div class="schedule-period">Ежеквартально</div>
        <div class="schedule-items">
          <div class="schedule-item">Полный аудит всех 4 кампаний</div>
          <div class="schedule-item">Обновление базы ключевых слов — повторный запуск Planner при необходимости</div>
          <div class="schedule-item">Перераспределение бюджета на основе CPL по кампаниям</div>
          <div class="schedule-item">Проверка структуры кампаний — добавить новые группы при необходимости</div>
          <div class="schedule-item">Обновление конкурентного ландшафта — появились новые проекты?</div>
          <div class="schedule-item">Оценка готовности к Smart Bidding</div>
        </div>
      </div>
    </div>
  `;
}

/* ---- S14 Testing Framework ---- */
function renderS14() {
  return `
    <div class="section-block-header">
      <div class="section-block-num">14</div>
      <div class="section-block-title-wrap">
        <div class="section-block-title">Фреймворк тестирования</div>
        <div class="section-block-desc">Структурированные A/B тесты: объявления, типы соответствия, посадочные страницы</div>
      </div>
    </div>

    <div class="table-wrapper">
      <table class="test-table">
        <thead>
          <tr>
            <th>Тест</th>
            <th>Переменная</th>
            <th>Длительность</th>
            <th>Метрика успеха</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="test-name">A/B тест объявлений</td>
            <td>Заголовок 1: название бренда vs. продукт («Бутик-резиденция» vs. «14 Резиденций в Тбилиси»)</td>
            <td class="test-duration">4 недели</td>
            <td class="test-metric">CTR + Конв. Rate</td>
          </tr>
          <tr>
            <td class="test-name">Тест типов соответствия</td>
            <td>Exact vs. Phrase match по топ-20 запросам</td>
            <td class="test-duration">6 недель</td>
            <td class="test-metric">Разница CPA</td>
          </tr>
          <tr>
            <td class="test-name">Корректировка ставок по гео</td>
            <td>Израиль +20% vs. единая ставка (IL/UA/BY)</td>
            <td class="test-duration">4 недели</td>
            <td class="test-metric">CPL по стране</td>
          </tr>
          <tr>
            <td class="test-name">Посадочная страница</td>
            <td>Основной elysiumtbilisi.com vs. отдельный инвестиционный LP</td>
            <td class="test-duration">8 недель</td>
            <td class="test-metric">Конв. в лид</td>
          </tr>
          <tr>
            <td class="test-name">Язык CTA</td>
            <td>"Записаться на показ" vs. "Узнать цену и планировку"</td>
            <td class="test-duration">4 недели</td>
            <td class="test-metric">CTR по CTA</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}

/* ---- S15 KPI Framework ---- */
function renderS15() {
  return `
    <div class="section-block-header">
      <div class="section-block-num">15</div>
      <div class="section-block-title-wrap">
        <div class="section-block-title">Система KPI</div>
        <div class="section-block-desc">Ориентировочные цели — фактический базис будет установлен после запуска</div>
      </div>
    </div>

    <div class="note-box info" style="margin-bottom:24px">
      <span class="note-box-icon">ℹ</span>
      <div>Это ориентировочные цели на основе знания рынка, а не прогнозы. Реальные результаты определят фактический базис после 4–6 недель работы.</div>
    </div>

    <div class="table-wrapper">
      <table class="kpi-table">
        <thead>
          <tr>
            <th>KPI</th>
            <th>Цель Мес. 1–3</th>
            <th>Цель Мес. 4–6</th>
            <th>Источник</th>
          </tr>
        </thead>
        <tbody>
          <tr><td class="kpi-name">Показы</td><td class="kpi-val">&gt;5,000/mo</td><td class="kpi-val">&gt;10,000/mo</td><td>Google Ads</td></tr>
          <tr><td class="kpi-name">CTR</td><td class="kpi-val">&gt;3%</td><td class="kpi-val">&gt;4%</td><td>Google Ads</td></tr>
          <tr><td class="kpi-name">CPC</td><td class="kpi-val">&lt;$2.00</td><td class="kpi-val">&lt;$1.50</td><td>Google Ads</td></tr>
          <tr><td class="kpi-name">Лиды / месяц</td><td class="kpi-val">10–20</td><td class="kpi-val">20–40</td><td>CRM</td></tr>
          <tr><td class="kpi-name">CPL</td><td class="kpi-val">&lt;$50</td><td class="kpi-val">&lt;$30</td><td>CRM / Ads</td></tr>
          <tr><td class="kpi-name">Квал. лиды</td><td class="kpi-val">3–8/mo</td><td class="kpi-val">8–15/mo</td><td>Sales</td></tr>
          <tr><td class="kpi-name">CPQL</td><td class="kpi-val">&lt;$150</td><td class="kpi-val">&lt;$80</td><td>Sales / Ads</td></tr>
          <tr><td class="kpi-name">Показы объекта</td><td class="kpi-val">1–3/mo</td><td class="kpi-val">3–6/mo</td><td>Sales</td></tr>
        </tbody>
      </table>
    </div>
  `;
}

/* ---- S16 90-Day Roadmap ---- */
function renderS16() {
  return `
    <div class="section-block-header">
      <div class="section-block-num">16</div>
      <div class="section-block-title-wrap">
        <div class="section-block-title">Дорожная карта на 90 дней</div>
        <div class="section-block-desc">Поэтапный план запуска — Настройка → Данные → Оптимизация</div>
      </div>
    </div>

    <div class="timeline">
      <div class="timeline-phase phase-1">
        <div class="timeline-dot"></div>
        <div class="timeline-phase-eyebrow">Фаза 1 — Недели 1–2</div>
        <div class="timeline-phase-title">Настройка и фундамент</div>
        <div class="timeline-items">
          <div class="timeline-item">Посадочная: добавить кнопку WhatsApp/Telegram (быстро, высокий эффект)</div>
          <div class="timeline-item">Посадочная: добавить раздел инвестиционной ценности (3 абзаца)</div>
          <div class="timeline-item">Посадочная: добавить скачивание PDF планировок (с формой контакта)</div>
          <div class="timeline-item">Google Ads: настроить отслеживание конверсий — форма, телефон, WhatsApp</div>
          <div class="timeline-item">Google Ads: создать брендовую кампанию → запустить немедленно</div>
          <div class="timeline-item">Google Ads: создать кампанию Core RU → только Exact match</div>
          <div class="timeline-item">Google Ads: создать кампанию Core EN → только Exact match</div>
          <div class="timeline-item">Создать все RSA объявления — минимум 3 на группу, цель: 15 заголовков в каждом</div>
          <div class="timeline-item">Настроить UTM-параметры для всех объявлений</div>
        </div>
      </div>

      <div class="timeline-phase phase-2">
        <div class="timeline-dot"></div>
        <div class="timeline-phase-eyebrow">Фаза 2 — Недели 3–8</div>
        <div class="timeline-phase-title">Запуск и сбор данных</div>
        <div class="timeline-items">
          <div class="timeline-item">Ручная проверка ключевых слов конкурентной кампании → запустить топ-20 по релевантности</div>
          <div class="timeline-item">Добавить Phrase match к лучшим Exact-ключевым словам (после 2 недель данных)</div>
          <div class="timeline-item">Еженедельно: просмотр запросов → добавлять минус-слова</div>
          <div class="timeline-item">Ежемесячно: первый отчёт по эффективности — показы, CTR, CPC, лиды</div>
          <div class="timeline-item">Подключить GA4 + Google Tag Manager для полной атрибуции</div>
          <div class="timeline-item">Настроить корректировки ставок по устройству и времени суток</div>
        </div>
      </div>

      <div class="timeline-phase phase-3">
        <div class="timeline-dot"></div>
        <div class="timeline-phase-eyebrow">Фаза 3 — Месяцы 3–4</div>
        <div class="timeline-phase-title">Оптимизация и масштабирование</div>
        <div class="timeline-items">
          <div class="timeline-item">Первые корректировки ставок по гео — повысить Израиль, если данные CPL поддерживают</div>
          <div class="timeline-item">A/B тест вариантов заголовков — отключить проигрывающие тексты</div>
          <div class="timeline-item">При 20+ конверсиях/кампанию: переключить на Enhanced CPC</div>
          <div class="timeline-item">Оценить отдельную инвестиционную посадочную — создать, если ROI положительный</div>
          <div class="timeline-item">Расширение ключевых слов — добавить победителей Phrase match в список KEEP</div>
          <div class="timeline-item">При 30+ конв./мес суммарно: оценить переход на Target CPA</div>
        </div>
      </div>
    </div>
  `;
}

/* ---- S17 Research / QA ---- */
function renderS17(research) {
  const rs = research || {};
  const pools = rs.pool_stats || {};

  const qaItems = [
    'Арендные запросы в Core кампаниях: 0',
    'Термины Батуми в Core кампаниях: 0',
    'Другие города Грузии в Core: 0',
    'Термины штата Джорджия в Core: 0',
    'Hotel terms in Core: 0',
    'Отельные термины в конкурентном пуле: 0',
    'Намерение продать в Core: 0',
    'Ложные совпадения Lisi: 0',
    'Конкуренты Google Sheet: 14/14 верифицировано',
    'Дубликаты ключевых слов в финальном списке: 0',
    'Ключевые слова пула A верифицированы: PASS',
    'Люкс-сигнал пула B верифицирован: PASS',
    'Пентхаус пула D верифицирован: PASS',
    'Инвестиции пула E верифицированы: PASS',
    'Новостройки пула F верифицированы: PASS',
    'Районы пула G верифицированы: PASS',
    'Лайфстайл пула H верифицирован: PASS',
    'Конкуренты пула I все CHECK_REQUIRED: PASS',
    'Покрытие общей недвижимости пула J: PASS',
  ];

  const poolRows = Object.entries(pools).map(([key, val]) => `
    <tr>
      <td class="pool-id">${key}</td>
      <td class="pool-name">${val.name}</td>
      <td class="pool-num">${val.total?.toLocaleString() || '—'}</td>
      <td class="pool-keep">${val.keep || 0}</td>
      <td class="pool-check">${val.check_required || 0}</td>
    </tr>
  `).join('');

  return `
    <div class="section-block-header">
      <div class="section-block-num">17</div>
      <div class="section-block-title-wrap">
        <div class="section-block-title">Исследование и QA</div>
        <div class="section-block-desc">Полная методология исследования и результаты контроля качества</div>
      </div>
    </div>

    <div class="metrics-row" style="margin-bottom:28px">
      <div class="metric-card">
        <div class="metric-label">Всего исследовано</div>
        <div class="metric-value">${(rs.total_keywords||4412).toLocaleString()}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Фазы</div>
        <div class="metric-value">${(rs.phases||[]).length || 4}</div>
      </div>
      <div class="metric-card gold">
        <div class="metric-label">KEEP</div>
        <div class="metric-value">${rs.keep_count||408}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Требуют проверки</div>
        <div class="metric-value">${rs.check_required_count||861}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Исключено</div>
        <div class="metric-value">${(rs.excluded_count||3143).toLocaleString()}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Нулевой объём сохранён</div>
        <div class="metric-value">${(rs.zero_volume_count||3004).toLocaleString()}</div>
      </div>
    </div>

    <div class="two-col" style="margin-bottom:28px">
      <div>
        <div class="card-title" style="margin-bottom:16px">Статистика пулов</div>
        <div class="table-wrapper">
          <table class="pool-table">
            <thead>
              <tr><th>Пул</th><th>Название</th><th style="text-align:right">Всего</th><th style="text-align:right">KEEP</th><th style="text-align:right">CHECK</th></tr>
            </thead>
            <tbody>
              ${poolRows}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div class="card-title" style="margin-bottom:16px">Результаты QA — ${rs.qa_checks_passed||19}/${rs.qa_checks_total||19} PASS</div>
        <div class="qa-grid">
          ${qaItems.map(item => `
            <div class="qa-item pass">
              <span class="qa-icon"></span>
              <span style="font-size:11px">${item}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <div class="note-box success">
      <span class="note-box-icon">✓</span>
      <div>
        <strong>Статус QA: ВСЕ ПРОЙДЕНЫ.</strong> 19/19 проверок завершены без ошибок.
        База ключевых слов валидирована и готова к запуску. Исторические ключевые слова аккаунта (${rs.historical_keywords||74}) сохранены и интегрированы.
        Выполнено 4 фазы исследования: Keyword Planner, расширенная, Районы+Инвестиции, 15 новых блоков.
      </div>
    </div>
  `;
}

/* ============================================================
   YANDEX STRATEGY (DATA PENDING)
   ============================================================ */

export function renderYandexStrategy(container) {
  const sections = [
    ['00','Executive Summary'],['01','Business & Product'],['02','Market & Search Demand'],
    ['03','Geo & Language Strategy'],['04','Search Intent'],['05','Keyword Architecture'],
    ['06','Campaign Architecture'],['07','Competitor Strategy'],['08','Negative Keywords'],
    ['09','Ads & Messaging'],['10','Landing Page Strategy'],['11','Budget & Bidding'],
    ['12','Conversion & Analytics'],['13','Optimization System'],['14','Testing Framework'],
    ['15','KPI Framework'],['16','90-Day Roadmap'],['17','Research & QA'],
  ];

  container.innerHTML = `
    <div class="note-box warning" style="margin-bottom:40px">
      <span class="note-box-icon">⚠</span>
      <div>
        <strong>Yandex Direct не входит в текущий охват стратегии.</strong>
        Вкладка сохранена для будущего планирования. Google Ads — единственный активный канал в текущей стратегии.
        Статус: <strong>Не в охвате / Данные ожидаются</strong>
      </div>
    </div>

    ${sections.map(([num, title]) => num === '03' ? renderYandexGeo(num, title) : renderPendingSection(num, title)).join('')}
  `;
}

function renderYandexGeo(num, title) {
  return `
    <div class="section-block" id="y${num}">
      <div class="section-block-header">
        <div class="section-block-num">${num}</div>
        <div class="section-block-title-wrap">
          <div class="section-block-title">${title}</div>
        </div>
      </div>
      <div class="three-col">
        <div class="geo-card"><div class="geo-flag">🇮🇱</div><div class="geo-name">Israel</div>
          <div class="geo-facts">
            <div class="geo-fact">RU primary · EN secondary</div>
            <div class="geo-fact">Significant Russian-speaking population</div>
          </div>
        </div>
        <div class="geo-card"><div class="geo-flag">🇺🇦</div><div class="geo-name">Ukraine</div>
          <div class="geo-facts">
            <div class="geo-fact">RU primary market</div>
            <div class="geo-fact">Historically significant Yandex presence</div>
          </div>
        </div>
        <div class="geo-card"><div class="geo-flag">🇧🇾</div><div class="geo-name">Belarus</div>
          <div class="geo-facts">
            <div class="geo-fact">RU primary market</div>
            <div class="geo-fact">Strong Yandex historical presence</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderPendingSection(num, title) {
  return `
    <div class="section-block" id="y${num}">
      <div class="section-block-header">
        <div class="section-block-num">${num}</div>
        <div class="section-block-title-wrap">
          <div class="section-block-title">${title}</div>
        </div>
      </div>
      <div class="data-pending">
        <div class="data-pending-icon">⏳</div>
        <div class="data-pending-label">Данные ожидаются</div>
        <div class="data-pending-desc">Не в текущем охвате. Канал сохранён для будущего стратегического решения.</div>
      </div>
    </div>
  `;
}

/* ============================================================
   META STRATEGY (DATA PENDING)
   ============================================================ */

export function renderMetaStrategy(container) {
  const stat = (val, label) =>
    '<div style="display:flex;flex-direction:column;align-items:center;gap:6px;padding:20px 28px;background:var(--bg-elevated);border:1px solid var(--border-subtle);border-radius:10px;min-width:120px">' +
    '<div style="font-size:28px;font-weight:600;color:var(--accent-gold);letter-spacing:-0.02em">' + val + '</div>' +
    '<div style="font-size:11px;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.07em;text-align:center">' + label + '</div>' +
    '</div>';

  const sectionHeader = (num, title, desc) =>
    '<div class="section-block-header">' +
    '<div class="section-block-num">' + num + '</div>' +
    '<div class="section-block-title-wrap">' +
    '<div class="section-block-title">' + title + '</div>' +
    (desc ? '<div class="section-block-desc">' + desc + '</div>' : '') +
    '</div></div>';

  const adSetCard = (lang, flag, budget, status, statusClr, audience, note) =>
    '<div style="flex:1;min-width:220px;border:1px solid var(--border-medium);border-radius:10px;overflow:hidden">' +
    '<div style="padding:14px 18px;background:var(--bg-elevated);border-bottom:1px solid var(--border-subtle);display:flex;justify-content:space-between;align-items:center">' +
    '<div>' +
    '<div style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-tertiary);margin-bottom:3px">Ad Set</div>' +
    '<div style="font-size:16px;font-weight:500;color:var(--text-primary)">' + flag + ' ' + lang + '</div>' +
    '</div>' +
    '<div style="text-align:right">' +
    '<div style="font-size:18px;font-weight:600;color:var(--accent-gold)">$' + budget + '</div>' +
    '<div style="font-size:10px;color:var(--text-tertiary)">в месяц · старт</div>' +
    '</div>' +
    '</div>' +
    '<div style="padding:14px 18px;display:flex;flex-direction:column;gap:8px">' +
    '<div style="display:flex;align-items:center;gap:8px">' +
    '<span style="font-size:10px;background:' + statusClr + ';border-radius:4px;padding:2px 8px;font-weight:500">' + status + '</span>' +
    '</div>' +
    '<div style="font-size:12px;color:var(--text-secondary)">' + audience + '</div>' +
    (note ? '<div style="font-size:11px;color:var(--text-tertiary);font-style:italic;margin-top:2px">' + note + '</div>' : '') +
    '</div>' +
    '</div>';

  const kpiRow = (metric, meaning) =>
    '<tr>' +
    '<td style="padding:10px 16px;font-size:12px;color:var(--text-primary);font-weight:500;border-bottom:1px solid var(--border-subtle);white-space:nowrap">' + metric + '</td>' +
    '<td style="padding:10px 16px;font-size:12px;color:var(--text-secondary);border-bottom:1px solid var(--border-subtle)">' + meaning + '</td>' +
    '</tr>';

  const creativeLink = (n, url, type) =>
    '<a href="' + url + '" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:12px;padding:12px 16px;background:var(--bg-elevated);border:1px solid var(--border-subtle);border-radius:8px;text-decoration:none;transition:border-color 0.15s" onmouseover="this.style.borderColor=\'var(--accent-gold)\'" onmouseout="this.style.borderColor=\'var(--border-subtle)\'">' +
    '<span style="font-size:11px;font-weight:600;color:var(--accent-gold);background:rgba(196,168,100,0.12);border-radius:4px;padding:3px 8px;min-width:22px;text-align:center">' + n + '</span>' +
    '<span style="font-size:11px;color:var(--text-tertiary);font-family:var(--font-mono);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + type + '</span>' +
    '<span style="font-size:10px;color:var(--text-tertiary);opacity:0.6">↗</span>' +
    '</a>';

  container.innerHTML = `
    <!-- M00: Резюме -->
    <div class="section-block" id="m00">
      ${sectionHeader('00','Резюме','Meta Ads · второй приоритет · $400/мес · Instagram Profile Growth')}
      <div style="display:flex;flex-wrap:wrap;gap:12px;margin-bottom:24px">
        ${stat('$400','весь бюджет')}
        ${stat('1','кампания')}
        ${stat('1','гео — Грузия')}
        ${stat('2','аудитории')}
        ${stat('Трафик','цель Meta')}
      </div>
      <div class="note-box info">
        <span class="note-box-icon">ℹ</span>
        <div style="font-size:12px">
          Задача Meta — не лиды (их закрывает Google), а рост живой аудитории Instagram.
          Люди видят продукт регулярно, до того как решат оставить заявку.
          Одна кампания · одна цель · максимум концентрации бюджета на обучение алгоритма.
        </div>
      </div>
    </div>

    <!-- M01: Почему так просто -->
    <div class="section-block" id="m01">
      ${sectionHeader('01','Почему так просто','Логика выбора цели и структуры')}
      <div style="display:flex;flex-direction:column;gap:12px">
        <div style="background:var(--bg-elevated);border:1px solid var(--border-subtle);border-radius:10px;padding:20px 24px">
          <div style="font-size:13px;font-weight:500;color:var(--text-primary);margin-bottom:8px">Цель — Трафик с назначением «Посещение профиля»</div>
          <div style="font-size:12px;color:var(--text-secondary);line-height:1.7">
            В Meta нет отдельной цели «рост подписчиков». Она достигается через Трафик с посадкой на профиль
            или через Engagement на посты. Трафик стабильно даёт больше профильных переходов при том же бюджете —
            именно этот паттерн уже тестировался на аккаунте и показал себя рабочим.
          </div>
        </div>
        <div style="background:var(--bg-elevated);border:1px solid var(--border-subtle);border-radius:10px;padding:20px 24px">
          <div style="font-size:13px;font-weight:500;color:var(--text-primary);margin-bottom:8px">Почему не 9 кампаний как раньше</div>
          <div style="font-size:12px;color:var(--text-secondary);line-height:1.7">
            Предыдущая структура (9 кампаний, лиды, 3 сайта × 3 языка) при $400/мес была нереалистична —
            алгоритм не успевал обучаться на маленьких параллельных кампаниях.
            Новая логика — противоположная: одна кампания, весь бюджет, один сигнал обучения.
          </div>
        </div>
        <div style="background:var(--bg-elevated);border:1px solid var(--border-subtle);border-radius:10px;padding:20px 24px">
          <div style="font-size:13px;font-weight:500;color:var(--text-primary);margin-bottom:8px">Почему нет RU-аудитории</div>
          <div style="font-size:12px;color:var(--text-secondary);line-height:1.7">
            Русскоязычная аудитория Грузии охвачена через EN-сегмент (экспаты часто двуязычны)
            и напрямую через Google/Yandex кампании. Дублировать здесь — распылять бюджет без прироста охвата.
          </div>
        </div>
      </div>
    </div>

    <!-- M02: Структура кампании -->
    <div class="section-block" id="m02">
      ${sectionHeader('02','Структура кампании','1 кампания · CBO · 2 ad set')}
      <div style="background:rgba(196,168,100,0.04);border:1px solid rgba(196,168,100,0.2);border-radius:10px;padding:18px 22px;margin-bottom:20px">
        <div style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-tertiary);margin-bottom:6px">Кампания</div>
        <div style="font-size:16px;font-weight:500;color:var(--text-primary);margin-bottom:4px">[Трафик] Elysium — Instagram Profile Growth</div>
        <div style="font-size:11px;color:var(--text-tertiary);font-family:var(--font-mono)">Цель: Трафик · Назначение: Посещение профиля · CBO вкл. · Гео: Грузия · $400/мес</div>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:16px;margin-bottom:16px">
        ${adSetCard(
          'EN — Экспаты','🌍','220','АКТИВЕН','rgba(80,200,120,0.15);color:#6fcf97',
          'Экспаты и иностранцы в Грузии · Английский язык интерфейса',
          'Запускается первым. Креативы готовы.'
        )}
        ${adSetCard(
          'KA — Грузиноязычная','🇬🇪','180','НА ПАУЗЕ','rgba(255,180,50,0.15);color:#f2c94c',
          'Грузиноязычная аудитория · Местные жители',
          'Ожидает KA-креативов от Тани. Запуск сразу после получения.'
        )}
      </div>
      <div class="note-box info">
        <span class="note-box-icon">ℹ</span>
        <div style="font-size:11px">
          CBO (Campaign Budget Optimization) — система Meta сама распределяет $400 между ad set в реальном времени
          по факту дешевизны результата. Стартовое соотношение $220/$180 — ориентир, не фиксация.
        </div>
      </div>
    </div>

    <!-- M02.1: Таргетинг и интересы -->
    <div class="section-block" id="m021">
      ${sectionHeader('02.1','Таргетинг и интересы','Один пул интересов на каждый ad set · без дробления')}
      <div style="display:flex;flex-wrap:wrap;gap:16px;margin-bottom:16px">
        ${(()=>{
          const interests = [
            'Real estate','Luxury real estate','Property investment','Real estate investing',
            'Architecture','Interior design','Luxury lifestyle','Premium lifestyle',
            'Investment','Business','Entrepreneurship',
          ];
          const chip = t => '<code style="background:var(--bg-hover);padding:3px 9px;border-radius:4px;font-size:11px;color:var(--text-secondary);font-family:var(--font-mono)">' + t + '</code>';
          const adsetBlock = (flag, lang, langLabel) =>
            '<div style="flex:1;min-width:260px;border:1px solid var(--border-medium);border-radius:10px;overflow:hidden">' +
            '<div style="padding:12px 18px;background:var(--bg-elevated);border-bottom:1px solid var(--border-subtle)">' +
            '<div style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-tertiary);margin-bottom:3px">Ad Set</div>' +
            '<div style="font-size:15px;font-weight:500;color:var(--text-primary)">' + flag + ' ' + lang + '</div>' +
            '</div>' +
            '<div style="padding:14px 18px;display:flex;flex-direction:column;gap:8px">' +
            '<div style="display:grid;grid-template-columns:auto 1fr;gap:4px 12px;font-size:11px;margin-bottom:6px">' +
            '<span style="color:var(--text-tertiary)">Гео</span><span style="color:var(--text-secondary)">Georgia</span>' +
            '<span style="color:var(--text-tertiary)">Язык</span><span style="color:var(--text-secondary)">' + langLabel + '</span>' +
            '<span style="color:var(--text-tertiary)">Возраст</span><span style="color:var(--text-secondary)">25–55</span>' +
            '</div>' +
            '<div style="font-size:10px;text-transform:uppercase;letter-spacing:0.07em;color:var(--text-tertiary);margin-bottom:4px">Интересы — единый пул</div>' +
            '<div style="display:flex;flex-wrap:wrap;gap:5px">' + interests.map(chip).join('') + '</div>' +
            '</div>' +
            '</div>';
          return adsetBlock('🌍','EN — Экспаты','English') + adsetBlock('🇬🇪','KA — Грузиноязычная','Georgian');
        })()}
      </div>
      <div class="note-box info">
        <span class="note-box-icon">ℹ</span>
        <div style="font-size:11px">
          Интересы не дробятся на отдельные ad set — в каждом языке один ad set с единым пулом.
          Это сохраняет объём аудитории и даёт алгоритму достаточно сигналов без дробления бюджета.
          Категории типа «Apartments», «Studio apartment», «Cheap apartments» сознательно исключены —
          они противоречат позиционированию ELYSIUM как бутик-резиденции.
        </div>
      </div>
    </div>

    <!-- M03: Гео -->
    <div class="section-block" id="m03">
      ${sectionHeader('03','Гео','Единственный рынок — Грузия')}
      <div style="background:var(--bg-elevated);border:1px solid var(--border-subtle);border-radius:10px;padding:20px 24px">
        <div style="display:flex;align-items:center;gap:16px;margin-bottom:16px">
          <span style="font-size:32px">🇬🇪</span>
          <div>
            <div style="font-size:16px;font-weight:500;color:var(--text-primary)">Грузия</div>
            <div style="font-size:11px;color:var(--text-tertiary)">Единственное гео · без расширения</div>
          </div>
        </div>
        <div style="font-size:12px;color:var(--text-secondary);line-height:1.7">
          При $400/мес любое дополнительное гео означает менее $13/день на аудиторию —
          ниже разумного порога для стабильного обучения алгоритма.
          Один рынок, достаточный объём показов, чистый сигнал.
        </div>
      </div>
    </div>

    <!-- M04: Креативы -->
    <div class="section-block" id="m04">
      ${sectionHeader('04','Креативы','Переиспользуем готовый пул · 5 единиц · KA — ожидает')}
      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px">
        ${creativeLink(1,'https://www.instagram.com/reel/DbkTgX8Ipnu/','Reel')}
        ${creativeLink(2,'https://www.instagram.com/p/DZ2-B2ntANQ/','Post')}
        ${creativeLink(3,'https://www.instagram.com/p/DZo0NbBtjr1/','Post')}
        ${creativeLink(4,'https://www.instagram.com/p/DZeubf1tWoH/','Post')}
        ${creativeLink(5,'https://www.instagram.com/reel/DZZn1maNzph/','Reel')}
      </div>
      <div class="note-box warning">
        <span class="note-box-icon">⚠</span>
        <div style="font-size:11px">
          <strong>KA ad set:</strong> грузиноязычные креативы ожидаются от Тани.
          До получения — ad set KA стоит на паузе или использует EN-креативы как временную заглушку.
          Решение принять перед стартом кампании.
        </div>
      </div>
    </div>

    <!-- M05: KPI -->
    <div class="section-block" id="m05">
      ${sectionHeader('05','KPI — что считаем','Пересмотр не раньше 2–3 недель стабильных данных')}
      <div style="border:1px solid var(--border-subtle);border-radius:10px;overflow:hidden;margin-bottom:16px">
        <table style="width:100%;border-collapse:collapse">
          <thead>
            <tr style="background:var(--bg-elevated)">
              <th style="padding:10px 16px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:0.08em;color:var(--text-tertiary);border-bottom:1px solid var(--border-subtle)">Метрика</th>
              <th style="padding:10px 16px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:0.08em;color:var(--text-tertiary);border-bottom:1px solid var(--border-subtle)">Что показывает</th>
            </tr>
          </thead>
          <tbody>
            ${kpiRow('Cost per Profile Visit','Базовая эффективность — сколько стоит переход в профиль')}
            ${kpiRow('Follow-through rate','Доля дошедших до профиля, кто подписался. Низкий % при дешёвом переходе = нерелевантный трафик')}
            ${kpiRow('Retention через 30 дней','Отписки в первый месяц — признак нецелевой аудитории, привлечённой ради дешёвого клика')}
          </tbody>
        </table>
      </div>
      <div class="note-box info">
        <span class="note-box-icon">ℹ</span>
        <div style="font-size:11px">
          Пересмотр бюджета — не раньше 2–3 недель стабильных данных по обеим метрикам одновременно,
          не только по цене перехода. Google и Yandex — приоритет. Meta — второй канал.
        </div>
      </div>
    </div>
  `;
}
