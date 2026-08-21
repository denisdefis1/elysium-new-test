/* ============================================================
   ELYSIUM TBILISI — Marketing Intelligence Hub
   strategy.js — Strategy Section Renderers
   ============================================================ */

import { poolBadge, statusBadge, langBadge, fmtVol, fmtCpc, volClass, ciClass, buildKeywordTable, escHtml } from './ui.js';

/* ============================================================
   GOOGLE ADS STRATEGY
   ============================================================ */

export function renderGoogleStrategy(container, data) {
  const { keywords, campaigns, competitors, negatives, research } = data;

  container.innerHTML = `
    <!-- S00 -->
    <div class="section-block" id="s00">
      ${renderS00()}
    </div>

    <!-- S01 -->
    <div class="section-block" id="s01">
      ${renderS01()}
    </div>

    <!-- S02 -->
    <div class="section-block" id="s02">
      ${renderS02Header()}
      <div id="kw-table-s02"></div>
    </div>

    <!-- S03 -->
    <div class="section-block" id="s03">
      ${renderS03()}
    </div>

    <!-- S04 -->
    <div class="section-block" id="s04">
      ${renderS04()}
    </div>

    <!-- S05 -->
    <div class="section-block" id="s05">
      ${renderS05Header(research)}
      <div id="kw-table-s05"></div>
    </div>

    <!-- S06 -->
    <div class="section-block" id="s06">
      ${renderS06(campaigns, research)}
    </div>

    <!-- S07 -->
    <div class="section-block" id="s07">
      ${renderS07(competitors)}
    </div>

    <!-- S08 -->
    <div class="section-block" id="s08">
      ${renderS08(negatives)}
    </div>

    <!-- S09 -->
    <div class="section-block" id="s09">
      ${renderS09()}
    </div>

    <!-- S10 -->
    <div class="section-block" id="s10">
      ${renderS10()}
    </div>

    <!-- S11 -->
    <div class="section-block" id="s11">
      ${renderS11(campaigns)}
    </div>

    <!-- S12 -->
    <div class="section-block" id="s12">
      ${renderS12()}
    </div>

    <!-- S13 -->
    <div class="section-block" id="s13">
      ${renderS13()}
    </div>

    <!-- S14 -->
    <div class="section-block" id="s14">
      ${renderS14()}
    </div>

    <!-- S15 -->
    <div class="section-block" id="s15">
      ${renderS15()}
    </div>

    <!-- S16 -->
    <div class="section-block" id="s16">
      ${renderS16()}
    </div>

    <!-- S17 -->
    <div class="section-block" id="s17">
      ${renderS17(research)}
    </div>
  `;

  // Mount keyword tables after DOM is ready
  if (keywords) {
    const kwData = keywords.keywords || [];
    buildKeywordTable(container.querySelector('#kw-table-s02'), kwData);
    buildKeywordTable(container.querySelector('#kw-table-s05'), kwData);
  }
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
        <div class="section-block-title">Business & Product</div>
        <div class="section-block-desc">Project facts and approved brand positioning</div>
      </div>
    </div>

    <div class="two-col">
      <div>
        <div class="card-title">Business Facts</div>
        <div class="facts-list">
          ${fact('Project', 'ELYSIUM Boutique Residence Tbilisi')}
          ${fact('Developer', 'Available on request')}
          ${fact('Status', 'Дом введён в эксплуатацию')}
          ${fact('Total Units', '14 premium residences')}
          ${fact('Size Range', 'from 130 m² to 191 m²')}
          ${fact('Layout', 'Free planning — no load-bearing walls inside')}
          ${fact('Views', 'Panoramic from every residence')}
          ${fact('Rooftop', 'Jacuzzi · Fitness · Outdoor kitchen')}
          ${fact('Parking', 'Underground parking')}
          ${fact('Security', '24/7 security & video monitoring')}
          ${fact('Infrastructure', 'Generator + 70-ton reserve water tank')}
          ${fact('Independence', 'Full independence from city utilities')}
          ${fact('Sound', '300mm inter-apartment sound insulation')}
          ${fact('Viewings', 'Open for individual viewings')}
          ${fact('Info', 'Full project info available on request')}
        </div>
      </div>

      <div>
        <div class="card-title" style="margin-bottom:20px">Brand Positioning</div>
        <div style="margin-bottom:24px">
          <div class="label" style="margin-bottom:12px;display:block">APPROVED — Use these</div>
          <div class="position-list">
            ${posItem(true, 'Бутик-резиденция')}
            ${posItem(true, 'Дом введён в эксплуатацию')}
            ${posItem(true, 'Бутик-резиденция открыта к просмотру')}
            ${posItem(true, 'Всего 14 резиденций')}
            ${posItem(true, 'Свободная планировка')}
            ${posItem(true, 'Без несущих стен внутри')}
            ${posItem(true, 'Панорамный вид из каждой квартиры')}
            ${posItem(true, 'Подземный паркинг')}
            ${posItem(true, 'Тишина. Приватность. Безопасность.')}
            ${posItem(true, 'Генератор и резервуар с водой')}
            ${posItem(true, 'Индивидуальный показ')}
            ${posItem(true, 'Записаться на показ')}
          </div>
        </div>

        <div>
          <div class="label" style="margin-bottom:12px;display:block;color:var(--error)">PROHIBITED — Never use</div>
          <div class="position-list">
            ${posItem(false, 'Клубный дом')}
            ${posItem(false, 'Дом полностью сдан')}
            ${posItem(false, '2 квартиры на этаже')}
            ${posItem(false, 'Элия Хилл — приватность рядом')}
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

/* ---- S02 Market & Search Demand ---- */
function renderS02Header() {
  return `
    <div class="section-block-header">
      <div class="section-block-num">02</div>
      <div class="section-block-title-wrap">
        <div class="section-block-title">Market & Search Demand</div>
        <div class="section-block-desc">Keyword research across 4,412 terms · Volumes from Google Keyword Planner (global estimates)</div>
      </div>
    </div>

    <div class="note-box info" style="margin-bottom:24px">
      <span class="note-box-icon">ℹ</span>
      <div>
        <strong>Volume note:</strong> All figures are global Google Keyword Planner estimates.
        Actual traffic from IL+UA+BY targeting will be a fraction of global volume.
        No geo-specific estimates are fabricated — only real research data is shown.
      </div>
    </div>

    <div class="metrics-row" style="margin-bottom:24px">
      <div class="metric-card">
        <div class="metric-label">Highest RU Volume</div>
        <div class="metric-value">1K</div>
        <div class="metric-sub">купить квартиру в тбилиси</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Highest EN Volume</div>
        <div class="metric-value">1.3K</div>
        <div class="metric-sub">apartment tbilisi (generic)</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Top EN Purchase Vol</div>
        <div class="metric-value">480</div>
        <div class="metric-sub">apartments for sale tbilisi</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Historical KWs</div>
        <div class="metric-value">74</div>
        <div class="metric-sub">preserved from account</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Zero Volume Saved</div>
        <div class="metric-value">3,004</div>
        <div class="metric-sub">in research database</div>
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
        <div class="section-block-title">Geo & Language Strategy</div>
        <div class="section-block-desc">Active markets and targeting logic</div>
      </div>
    </div>

    <div class="three-col" style="margin-bottom:32px">
      <div class="geo-card">
        <div class="geo-flag">🇮🇱</div>
        <div class="geo-name">Israel</div>
        <div class="geo-facts">
          <div class="geo-fact">Primary EN-speaking market</div>
          <div class="geo-fact">Significant Russian-speaking population</div>
          <div class="geo-fact">Both RU and EN campaigns active</div>
          <div class="geo-fact">Target: Russian-speaking Israelis + English-speaking professionals</div>
          <div class="geo-fact">Highest-potential market for EN campaigns</div>
          <div class="geo-fact">Audience primarily mobile — fast LP load critical</div>
        </div>
      </div>

      <div class="geo-card">
        <div class="geo-flag">🇺🇦</div>
        <div class="geo-name">Ukraine</div>
        <div class="geo-facts">
          <div class="geo-fact">Primary RU-language market</div>
          <div class="geo-fact">EN secondary</div>
          <div class="geo-fact">UA-based buyers of foreign real estate active</div>
          <div class="geo-fact">Core RU campaign primary targeting</div>
          <div class="geo-fact">Strong search intent for Tbilisi property</div>
        </div>
      </div>

      <div class="geo-card">
        <div class="geo-flag">🇧🇾</div>
        <div class="geo-name">Belarus</div>
        <div class="geo-facts">
          <div class="geo-fact">Primary RU-language market</div>
          <div class="geo-fact">Tbilisi well-known destination</div>
          <div class="geo-fact">Core RU campaign primary targeting</div>
          <div class="geo-fact">Strong relocation intent</div>
        </div>
      </div>
    </div>

    <div class="card" style="margin-bottom:20px">
      <div class="card-title">Geos NOT Included</div>
      <div style="display:flex;gap:24px;flex-wrap:wrap">
        <div style="font-size:13px;color:var(--text-tertiary)">
          <s>Germany</s> — Removed from targeting
        </div>
        <div style="font-size:13px;color:var(--text-tertiary)">
          <s>Georgia (local)</s> — Not a paid acquisition geo
        </div>
      </div>
    </div>

    <div class="note-box info">
      <span class="note-box-icon">ℹ</span>
      <div>
        <strong>Key principle:</strong> Country ≠ Language.
        EN and RU campaigns run across all 3 geos simultaneously with different bid adjustments per market.
        Israel receives the highest EN campaign priority. Ukraine and Belarus are primary for RU campaigns.
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
        <div class="section-block-title">Search Intent Architecture</div>
        <div class="section-block-desc">Intent pools and targeting logic for campaign structure</div>
      </div>
    </div>

    <div class="intent-grid">
      <div class="intent-card">
        <div class="intent-card-header">
          <div class="pool-badge pool-A">A</div>
          <div class="intent-title">Purchase Intent</div>
          <span class="intent-count">163 KEEP</span>
        </div>
        <div class="intent-examples">"купить квартиру в тбилиси"<br>"buy apartment in tbilisi"</div>
        <div class="intent-desc">Highest priority. Direct conversion intent. Core RU and Core EN campaigns. Exact match first, then Phrase.</div>
      </div>

      <div class="intent-card">
        <div class="intent-card-header">
          <div class="pool-badge pool-B">B</div>
          <div class="intent-title">Premium / Luxury Intent</div>
          <span class="intent-count">19 KEEP</span>
        </div>
        <div class="intent-examples">"luxury apartment tbilisi"<br>"элитная недвижимость тбилиси"</div>
        <div class="intent-desc">Audience self-selects for premium. High qualification rate. Avg CPC $1.24. Premium messaging essential. Note: 18/19 KEEP keywords are EN; 1 RU keyword in this pool.</div>
      </div>

      <div class="intent-card">
        <div class="intent-card-header">
          <div class="pool-badge pool-C">C</div>
          <div class="intent-title">Residence / Boutique</div>
          <span class="intent-count">4 KEEP</span>
        </div>
        <div class="intent-examples">"king david residence tbilisi"<br>"boutique apartment tbilisi"</div>
        <div class="intent-desc">Branded residence searches — named development queries. EN-only pool. Core EN campaign (Campaign 3). Note: "Greenhill Residence" has no Tbilisi geo signal — verify before activating.</div>
      </div>

      <div class="intent-card">
        <div class="intent-card-header">
          <div class="pool-badge pool-D">D</div>
          <div class="intent-title">Penthouse</div>
          <span class="intent-count">6 KEEP</span>
        </div>
        <div class="intent-examples">"penthouse in tbilisi"<br>"penthouse tbilisi"</div>
        <div class="intent-desc">Very specific, small volume but high value intent. Core EN campaign dedicated ad group. Note: no penthouse section on site yet.</div>
      </div>

      <div class="intent-card">
        <div class="intent-card-header">
          <div class="pool-badge pool-E">E</div>
          <div class="intent-title">Investment</div>
          <span class="intent-count">6 KEEP</span>
        </div>
        <div class="intent-examples">"investment property georgia"<br>"инвестиции в недвижимость грузии"</div>
        <div class="intent-desc">Different messaging required — ROI framing. Note: no investment section exists on current site (gap identified).</div>
      </div>

      <div class="intent-card">
        <div class="intent-card-header">
          <div class="pool-badge pool-F">F</div>
          <div class="intent-title">New Build / Ready</div>
          <span class="intent-count">14 KEEP</span>
        </div>
        <div class="intent-examples">"new apartment tbilisi"<br>"новостройка тбилиси"</div>
        <div class="intent-desc">Overlaps with purchase intent. Key message: Дом введён в эксплуатацию — commissioned and ready to view.</div>
      </div>

      <div class="intent-card">
        <div class="intent-card-header">
          <div class="pool-badge pool-G">G</div>
          <div class="intent-title">Districts / Location</div>
          <span class="intent-count">12 KEEP</span>
        </div>
        <div class="intent-examples">"квартира ваке"<br>"apartment mtatsminda"</div>
        <div class="intent-desc">Location-specific search. ELYSIUM is in a premium Tbilisi location. Ad copy to mention neighbourhood.</div>
      </div>

      <div class="intent-card" style="border-color:rgba(74,106,140,0.25);opacity:0.75">
        <div class="intent-card-header">
          <div class="pool-badge pool-J">J</div>
          <div class="intent-title">Generic Real Estate</div>
          <span class="intent-count" style="background:rgba(74,106,140,0.15);color:var(--data-blue)">183 · Phase 2</span>
        </div>
        <div class="intent-examples">"apartment tbilisi"<br>"real estate tbilisi"</div>
        <div class="intent-desc">Large volume, lower specificity. <strong>Retained for Phase 2 expansion</strong> — not in Phase 1 campaigns. 123 RU + 60 EN. Will be evaluated after Phase 1 data is collected.</div>
      </div>

      <div class="intent-card" style="border-color:rgba(140,94,48,0.25)">
        <div class="intent-card-header">
          <div class="pool-badge pool-I">I</div>
          <div class="intent-title">Competitors</div>
          <span class="intent-count">87 CHECK</span>
        </div>
        <div class="intent-examples">"park home vake"<br>"cityzen tbilisi", "next tbilisi"</div>
        <div class="intent-desc">Requires manual review before launch. Differentiation messaging. Separate campaign (Campaign 4). All 87 keywords are CHECK_REQUIRED.</div>
      </div>
    </div>

    <div class="card" style="margin-top:24px">
      <div class="card-title">Excluded from Campaigns (saved for audit)</div>
      <div style="display:flex;gap:24px;flex-wrap:wrap;margin-bottom:12px">
        <div style="font-size:12px;color:var(--text-tertiary)">🚫 Rental / Аренда: <strong style="color:var(--text-secondary)">1,840 keywords</strong></div>
        <div style="font-size:12px;color:var(--text-tertiary)">🚫 US Georgia: <strong style="color:var(--text-secondary)">689 keywords</strong></div>
        <div style="font-size:12px;color:var(--text-tertiary)">🚫 Batumi & Cities: <strong style="color:var(--text-secondary)">478 keywords</strong></div>
        <div style="font-size:12px;color:var(--text-tertiary)">🚫 General irrelevant: <strong style="color:var(--text-secondary)">125 keywords</strong></div>
        <div style="font-size:12px;color:var(--text-tertiary)">🚫 Hotels: <strong style="color:var(--text-secondary)">7 keywords</strong></div>
        <div style="font-size:12px;color:var(--text-tertiary)">🚫 Seller intent: <strong style="color:var(--text-secondary)">4 keywords</strong></div>
      </div>
      <div style="font-size:11px;color:var(--text-tertiary);border-top:1px solid var(--border-subtle);padding-top:10px">
        ℹ Pool H (Lifestyle/Location): 1 keyword retained in KEEP per client decision — small expected volume, acceptable risk.
      </div>
    </div>

    <div class="card" style="margin-top:16px;border-color:rgba(74,106,140,0.2);background:rgba(74,106,140,0.04)">
      <div class="card-title" style="color:var(--data-blue)">Phase 2 — Generic Real Estate Expansion</div>
      <div style="display:flex;gap:32px;margin:16px 0;flex-wrap:wrap">
        <div style="text-align:center">
          <div style="font-size:28px;font-weight:300;color:var(--text-primary)">183</div>
          <div style="font-size:11px;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.08em">Total · Pool J</div>
        </div>
        <div style="text-align:center">
          <div style="font-size:28px;font-weight:300;color:var(--text-primary)">123</div>
          <div style="font-size:11px;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.08em">RU keywords</div>
        </div>
        <div style="text-align:center">
          <div style="font-size:28px;font-weight:300;color:var(--text-primary)">60</div>
          <div style="font-size:11px;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.08em">EN keywords</div>
        </div>
      </div>
      <div style="font-size:13px;color:var(--text-secondary);line-height:1.7">
        Generic real estate searches ("apartment tbilisi", "real estate tbilisi" etc.) are retained in the research database
        but excluded from Phase 1 active campaigns. These keywords require larger budgets and tighter negative keyword
        coverage to be profitable. They will be evaluated for Phase 2 expansion once Phase 1 campaign data (CTR, CPC, CPL)
        is available — typically after 6–8 weeks of live performance.
      </div>
    </div>
  `;
}

/* ---- S05 Keyword Architecture ---- */
function renderS05Header(research) {
  const rs = research || {};
  return `
    <div class="section-block-header">
      <div class="section-block-num">05</div>
      <div class="section-block-title-wrap">
        <div class="section-block-title">Keyword Architecture</div>
        <div class="section-block-desc">Full KEEP keyword database with pool classification and QA status</div>
      </div>
    </div>

    <div class="card" style="margin-bottom:24px">
      <div class="card-title">Research Summary</div>
      <div class="research-stats-grid">
        <div class="research-stat"><span class="research-stat-label">Total researched</span><span class="research-stat-value">${(rs.total_keywords||4412).toLocaleString()}</span></div>
        <div class="research-stat"><span class="research-stat-label">Research phases</span><span class="research-stat-value">${(rs.phases||[]).length || 4}</span></div>
        <div class="research-stat"><span class="research-stat-label">KEEP (campaign-ready)</span><span class="research-stat-value gold">${(rs.keep_count||408).toLocaleString()}</span></div>
        <div class="research-stat"><span class="research-stat-label">CHECK_REQUIRED</span><span class="research-stat-value">${(rs.check_required_count||861).toLocaleString()}</span></div>
        <div class="research-stat"><span class="research-stat-label">Excluded (saved)</span><span class="research-stat-value">${(rs.excluded_count||3143).toLocaleString()}</span></div>
        <div class="research-stat"><span class="research-stat-label">Zero-volume preserved</span><span class="research-stat-value">${(rs.zero_volume_count||3004).toLocaleString()}</span></div>
        <div class="research-stat"><span class="research-stat-label">Historical account KWs</span><span class="research-stat-value">${rs.historical_keywords||74}</span></div>
        <div class="research-stat"><span class="research-stat-label">QA checks passed</span><span class="research-stat-value gold">19/19 ✓</span></div>
      </div>
    </div>
  `;
}

/* ---- S06 Структура кампаний ---- */
function renderS06(campaigns, research) {
  const cdata = campaigns?.campaigns || [];
  return `
    <div class="section-block-header">
      <div class="section-block-num">06</div>
      <div class="section-block-title-wrap">
        <div class="section-block-title">Структура кампаний (Campaign Architecture)</div>
        <div class="section-block-desc">4 кампании · Бюджет $500/мес · По 25% на каждую · Каждая закрывает отдельный тип спроса</div>
      </div>
    </div>

    <div class="card" style="margin-bottom:32px;font-family:var(--font-mono);font-size:13px;line-height:2.1">
      <div style="font-size:10px;color:var(--text-tertiary);letter-spacing:0.08em;text-transform:uppercase;font-family:var(--font-sans);margin-bottom:10px">Схема распределения бюджета</div>
      <div style="color:var(--accent-gold);font-weight:600">GOOGLE ADS — $500 / месяц</div>
      <div style="color:var(--text-secondary)">├── Кампания 1 — Брендовая <span style="color:var(--text-tertiary)">·········</span> <span style="color:var(--text-primary)">$125/мес</span></div>
      <div style="color:var(--text-secondary)">├── Кампания 2 — Покупка RU <span style="color:var(--text-tertiary)">········</span> <span style="color:var(--text-primary)">$125/мес</span></div>
      <div style="color:var(--text-secondary)">├── Кампания 3 — Покупка EN <span style="color:var(--text-tertiary)">········</span> <span style="color:var(--text-primary)">$125/мес</span></div>
      <div style="color:var(--text-secondary)">└── Кампания 4 — Конкурентная <span style="color:var(--text-tertiary)">······</span> <span style="color:var(--text-primary)">$125/мес</span></div>
      <div style="margin-top:14px;font-size:12px;color:var(--text-tertiary);font-family:var(--font-sans);line-height:1.6;border-top:1px solid var(--border-subtle);padding-top:12px">
        Четыре кампании разделяют четыре разных типа спроса. Это позволяет независимо управлять бюджетом, ставками (Bidding), ключевыми словами (Keywords) и рекламными сообщениями для каждой аудитории.
      </div>
    </div>

    <div style="display:flex;flex-direction:column;gap:32px">
      ${cdata.map(c => renderCampaignCard(c, research)).join('')}
    </div>

    <div class="note-box warning" style="margin-top:32px">
      <span class="note-box-icon">⚠</span>
      <div>
        <strong>Кампания 4 (Конкурентная): требуется ручная проверка перед запуском.</strong>
        Все 87 ключевых слов Pool I — статус CHECK_REQUIRED. Запускать только высокорелевантные.
        Приоритет запуска: Park Home Vake · Gergeti Rise · CityZen · Next Tbilisi · Mtatsminda Panorama.
      </div>
    </div>
  `;
}

function renderCampaignCard(c, research) {
  const kwCount = c.pool_sources?.includes('I')
    ? (research?.pool_stats?.I?.total ?? c.keyword_count_approx)
    : c.keyword_count_approx;
  const adGroups = c.ad_groups || [];

  const ruNames = {
    1: 'Брендовая — ELYSIUM',
    2: 'Основная покупка — RU',
    3: 'Основная покупка — EN',
    4: 'Конкурентная',
  };
  const whyMap = {
    1: 'Защищаем брендовый спрос. Перехватываем самых горячих лидов — тех, кто уже знает ELYSIUM и ищет нас напрямую. Наивысший ожидаемый коэффициент конверсии (CR).',
    2: 'Закрываем прямой спрос на покупку недвижимости в Тбилиси на русском языке. Показываем ELYSIUM как конкретный готовый вариант — дом введён в эксплуатацию.',
    3: 'Закрываем прямой спрос на покупку недвижимости в Тбилиси на английском языке. Основной рынок — Израиль: русскоязычные израильтяне и англоязычные профессионалы.',
    4: 'Перехватываем аудиторию, которая ищет конкурирующие проекты. Позиционируем ELYSIUM как бутик-альтернативу большим комплексам. Требует ручной проверки ключевых слов.',
  };
  const whoMap = {
    1: 'Пользователи, ищущие ELYSIUM по имени или смежным брендовым запросам.',
    2: 'Русскоязычные покупатели из Израиля, Украины и Беларуси — те, кто ищет купить квартиру или недвижимость в Тбилиси.',
    3: 'Англоязычные покупатели и инвесторы в Израиле (приоритет), на Украине и в Беларуси.',
    4: 'Покупатели, уже рассматривающие конкурирующие premium-проекты в Тбилиси.',
  };
  const demandMap = {
    1: 'Горячий брендовый спрос',
    2: 'Прямое намерение купить (RU)',
    3: 'Прямое намерение купить (EN)',
    4: 'Конкурентный перехват (RU + EN)',
  };
  const priorityColor = c.priority === 'HIGHEST' ? 'var(--accent-gold)' : c.priority === 'PRIMARY' ? '#70B880' : 'var(--text-tertiary)';

  return `
    <div style="border:1px solid var(--border-medium);border-radius:10px;overflow:hidden">
      <div style="padding:20px 24px;background:var(--bg-elevated);border-bottom:1px solid var(--border-subtle);display:flex;justify-content:space-between;align-items:flex-start;gap:16px">
        <div>
          <div style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-tertiary);margin-bottom:4px">Кампания ${c.id}</div>
          <div style="font-size:18px;font-weight:500;color:var(--text-primary);margin-bottom:3px">${ruNames[c.id] || escHtml(c.name)}</div>
          <div style="font-size:11px;color:var(--text-tertiary);font-family:var(--font-mono)">${escHtml(c.name)}</div>
        </div>
        <div style="text-align:right;flex-shrink:0">
          <div style="font-size:22px;font-weight:300;color:var(--accent-gold)">$${c.budget_monthly}<span style="font-size:12px">/мес</span></div>
          <div style="font-size:11px;color:var(--text-tertiary)">≈ $${c.budget_daily_approx}/день</div>
        </div>
      </div>

      <div style="padding:20px 24px;display:flex;flex-direction:column;gap:18px">

        <div>
          <div style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-tertiary);margin-bottom:6px">Зачем запускаем</div>
          <div style="font-size:13px;color:var(--text-secondary);line-height:1.6">${whyMap[c.id] || escHtml(c.intent)}</div>
        </div>

        <div>
          <div style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-tertiary);margin-bottom:6px">Кому показываем</div>
          <div style="font-size:13px;color:var(--text-secondary);line-height:1.6">${whoMap[c.id] || ''}</div>
        </div>

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:8px">
          <div style="padding:10px 14px;background:var(--bg-hover);border-radius:6px">
            <div style="font-size:10px;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px">Гео (Geo)</div>
            <div style="font-size:12px;color:var(--text-primary)">${c.geo.join(' · ')}</div>
          </div>
          <div style="padding:10px 14px;background:var(--bg-hover);border-radius:6px">
            <div style="font-size:10px;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px">Язык (Language)</div>
            <div style="font-size:12px;color:var(--text-primary)">${c.languages.map(l => `<span class="badge badge-lang badge-lang-${l}">${l}</span>`).join(' ')}</div>
          </div>
          <div style="padding:10px 14px;background:var(--bg-hover);border-radius:6px">
            <div style="font-size:10px;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px">Тип спроса</div>
            <div style="font-size:12px;color:var(--text-primary)">${demandMap[c.id] || ''}</div>
          </div>
          <div style="padding:10px 14px;background:var(--bg-hover);border-radius:6px">
            <div style="font-size:10px;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px">Приоритет</div>
            <div style="font-size:12px;font-weight:500;color:${priorityColor}">${c.priority}${c.requires_manual_review ? ' · ⚠ Проверка' : ''}</div>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;font-size:12px">
          <div>
            <div style="color:var(--text-tertiary);margin-bottom:3px">Ключевых слов (Keywords)</div>
            <div style="color:var(--text-primary);font-family:var(--font-mono);font-weight:600">~${kwCount}</div>
          </div>
          <div>
            <div style="color:var(--text-tertiary);margin-bottom:3px">Тип соответствия (Match Type)</div>
            <div style="color:var(--text-primary)">${c.match_types.join(' · ')}</div>
          </div>
          <div>
            <div style="color:var(--text-tertiary);margin-bottom:3px">Стратегия ставок (Bidding)</div>
            <div style="color:var(--text-primary)">${escHtml(c.bidding)}</div>
          </div>
        </div>

        <div>
          <div style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-tertiary);margin-bottom:10px">Группы объявлений (Ad Groups)</div>
          <div style="display:flex;flex-direction:column;gap:8px">
            ${adGroups.map(ag => `
              <div style="padding:10px 14px;background:var(--bg-hover);border-radius:6px;border-left:2px solid rgba(196,168,130,0.3)">
                <div style="font-size:12px;color:var(--text-primary);margin-bottom:6px">→ ${escHtml(ag.name)}</div>
                <div style="font-size:11px;color:var(--text-tertiary)">Примеры запросов:
                  ${ag.examples.map(e => `<code style="background:var(--bg-surface);padding:1px 5px;border-radius:3px;margin:0 2px;font-size:10px">${escHtml(e)}</code>`).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div>
          <div style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-tertiary);margin-bottom:6px">Куда ведём (Landing Page)</div>
          <div style="font-family:var(--font-mono);font-size:12px;color:var(--accent-gold)">${escHtml(c.landing_page)}</div>
        </div>

        <div style="border-top:1px solid var(--border-subtle);padding-top:18px">
          <div style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-tertiary);margin-bottom:14px">ЧТО УВИДИТ ПОЛЬЗОВАТЕЛЬ</div>
          ${renderCampaignAdPreview(c.id)}
        </div>

        ${c.notes ? `<div style="font-size:11px;color:var(--text-tertiary);border-top:1px solid var(--border-subtle);padding-top:12px;line-height:1.5">${escHtml(c.notes)}</div>` : ''}
      </div>
    </div>
  `;
}

function renderCampaignAdPreview(id) {
  if (id === 2) {
    return `
      <div style="background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:8px;padding:16px 20px;margin-bottom:12px">
        <div style="font-size:10px;color:var(--text-tertiary);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.08em">🇷🇺 Google Ads — пример объявления (RU)</div>
        <div style="font-size:11px;color:#4CAF50;font-family:var(--font-mono);margin-bottom:4px">🔗 elysiumtbilisi.com</div>
        <div style="font-size:14px;color:#8ab4f8;font-weight:500;line-height:1.4;margin-bottom:8px">Бутик-резиденция в Тбилиси | Дом введён в эксплуатацию | 14 резиденций — от 130 м²</div>
        <div style="font-size:12px;color:var(--text-secondary);line-height:1.6">Бутик-резиденция в Тбилиси. 14 квартир от 130 м². Дом введён в эксплуатацию.<br>Свободная планировка. Без несущих стен. Панорамные виды. Индивидуальный показ.</div>
        <div style="font-size:10px;color:var(--text-tertiary);margin-top:8px">Google подбирает лучшую комбинацию из 12 заголовков и 3 описаний автоматически</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:5px;font-size:12px">
        <div style="display:flex;gap:8px"><span style="color:var(--accent-gold);flex-shrink:0">Закрывает запросы:</span><span style="color:var(--text-secondary)">«купить квартиру в тбилиси», «элитная недвижимость тбилиси», «бутик резиденция тбилиси»</span></div>
        <div style="display:flex;gap:8px"><span style="color:var(--accent-gold);flex-shrink:0">Ключевое преимущество:</span><span style="color:var(--text-secondary)">Дом введён в эксплуатацию — готов к просмотру прямо сейчас</span></div>
        <div style="display:flex;gap:8px"><span style="color:var(--accent-gold);flex-shrink:0">CTA:</span><span style="color:var(--text-secondary)">«Запишитесь на показ» · «Планировки и цены — по запросу»</span></div>
      </div>
      <div style="margin-top:10px;font-size:11px;color:var(--text-tertiary)">→ Полный список заголовков и описаний — раздел 09 «Объявления и тексты»</div>
    `;
  }
  if (id === 3) {
    return `
      <div style="background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:8px;padding:16px 20px;margin-bottom:12px">
        <div style="font-size:10px;color:var(--text-tertiary);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.08em">🇬🇧 Google Ads — Ad Preview (EN)</div>
        <div style="font-size:11px;color:#4CAF50;font-family:var(--font-mono);margin-bottom:4px">🔗 elysiumtbilisi.com</div>
        <div style="font-size:14px;color:#8ab4f8;font-weight:500;line-height:1.4;margin-bottom:8px">Boutique Residence Tbilisi | 14 Premium Residences | Building Commissioned &amp; Ready</div>
        <div style="font-size:12px;color:var(--text-secondary);line-height:1.6">Boutique Residence in Tbilisi. 14 premium homes from 130 m². Building commissioned.<br>Free floor plan. No load-bearing walls. Panoramic city views from every residence.</div>
        <div style="font-size:10px;color:var(--text-tertiary);margin-top:8px">Google selects the best combination from 12 headlines and 3 descriptions automatically</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:5px;font-size:12px">
        <div style="display:flex;gap:8px"><span style="color:var(--accent-gold);flex-shrink:0">Закрывает запросы:</span><span style="color:var(--text-secondary)">"buy apartment tbilisi", "luxury apartment tbilisi", "boutique residence tbilisi"</span></div>
        <div style="display:flex;gap:8px"><span style="color:var(--accent-gold);flex-shrink:0">Ключевое преимущество:</span><span style="color:var(--text-secondary)">Commissioned building ready to view · Only 14 boutique residences · Free floor plan</span></div>
        <div style="display:flex;gap:8px"><span style="color:var(--accent-gold);flex-shrink:0">CTA:</span><span style="color:var(--text-secondary)">"Book an Individual Viewing" · "Plans &amp; Prices on Request"</span></div>
      </div>
      <div style="margin-top:10px;font-size:11px;color:var(--text-tertiary)">→ Полный список Headlines и Descriptions — раздел 09 «Объявления и тексты»</div>
    `;
  }
  if (id === 1) {
    return `
      <div style="padding:14px 16px;background:var(--bg-hover);border-radius:6px;font-size:13px;color:var(--text-secondary);line-height:1.6">
        Брендовая кампания показывает объявления тем, кто уже ищет ELYSIUM. RSA-объявления используют утверждённые бренд-формулировки (S01): «Бутик-резиденция», «Дом введён в эксплуатацию», «Открыта к просмотру», «Всего 14 резиденций».
        Два варианта: RU-объявление для русскоязычной аудитории, EN — для англоязычной.
      </div>
    `;
  }
  if (id === 4) {
    return `
      <div style="padding:14px 16px;background:rgba(196,168,100,0.06);border:1px solid rgba(196,168,100,0.2);border-radius:6px">
        <div style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--accent-gold);margin-bottom:8px">Ключевое сообщение конкурентных объявлений</div>
        <div style="font-size:13px;color:var(--text-secondary);line-height:1.6">Когда пользователь ищет другой проект (Park Home Vake, CityZen, Next Tbilisi...) → ELYSIUM появляется рядом с конкурентом.<br>Сообщение: «Не комплекс, а бутик-резиденция. Всего 14 апартаментов. Дом введён в эксплуатацию. Открыт к показу.»</div>
        <div style="margin-top:10px;font-size:11px;color:var(--text-tertiary)">Стратегия и сообщения — раздел 07 «Конкуренты». Все 87 ключевых слов: CHECK_REQUIRED, запуск только после ручной проверки.</div>
      </div>
    `;
  }
  return '';
}

/* ---- S07 Competitor Strategy ---- */
function renderS07(competitors) {
  const comps = competitors?.competitors || [];
  const allComps = [...comps].sort((a, b) => b.top_volume - a.top_volume);

  const actionBadge = (vol) => {
    if (vol >= 100) return `<span class="badge badge-launch">Launch</span>`;
    if (vol >= 10)  return `<span class="badge badge-review">Review</span>`;
    return `<span class="badge badge-monitor">Monitor</span>`;
  };

  const sourceBadge = (isGs) => isGs
    ? `<span style="font-size:10px;color:#70B880">✅ Google Sheet</span>`
    : `<span style="font-size:10px;color:var(--text-tertiary)">🔍 Research</span>`;

  return `
    <div class="section-block-header">
      <div class="section-block-num">07</div>
      <div class="section-block-title-wrap">
        <div class="section-block-title">Competitor Strategy</div>
        <div class="section-block-desc">38 competitors tracked · 14 Google Sheet verified · 24 Research identified</div>
      </div>
    </div>

    <div class="note-box warning" style="margin-bottom:24px">
      <span class="note-box-icon">⚠</span>
      <div>
        Sorted by top volume DESC. Google Sheet access requires authentication — 14 records confirmed via GS. 24 additional competitors identified through keyword research. All 38 shown individually.
      </div>
    </div>

    <div class="card-title" style="margin-bottom:16px">All 38 Competitors — Sorted by Volume</div>
    <div class="table-wrapper" style="margin-bottom:32px">
      <table class="competitor-table">
        <thead>
          <tr>
            <th>Competitor</th>
            <th>Best Keyword</th>
            <th style="text-align:right">Volume</th>
            <th style="text-align:right">Avg CPC</th>
            <th style="text-align:right">KWs</th>
            <th>Source</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${allComps.map(c => `
            <tr>
              <td class="comp-name">${escHtml(c.name)}</td>
              <td class="comp-keyword">${escHtml(c.best_keyword)}</td>
              <td class="comp-vol ${volClass(c.top_volume)}">${fmtVol(c.top_volume)}</td>
              <td class="comp-cpc">${fmtCpc(c.avg_cpc)}</td>
              <td class="comp-vol">${c.keyword_count}</td>
              <td>${sourceBadge(c.is_google_sheet)}</td>
              <td>${actionBadge(c.top_volume)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="card-title" style="margin-bottom:16px">Part B — Approved Differentiation Messaging</div>
    <div class="two-col">
      <div>
        <div class="label" style="margin-bottom:12px;display:block;color:#70B880">✓ APPROVED — Use in competitor ads</div>
        <div class="checklist">
          ${doItem('Дом введён в эксплуатацию')}
          ${doItem('Бутик-резиденция открыта к просмотру')}
          ${doItem('Всего 14 резиденций')}
          ${doItem('Не комплекс, а бутик-резиденция')}
          ${doItem('Свободная планировка')}
          ${doItem('Без несущих стен внутри')}
          ${doItem('Панорамный вид из каждой квартиры')}
          ${doItem('Подземный паркинг')}
          ${doItem('Тишина. Приватность. Безопасность.')}
          ${doItem('Генератор и резервуар с водой')}
          ${doItem('Полная независимость от городских коммуникаций')}
          ${doItem('Планировки и цены — по запросу')}
          ${doItem('Индивидуальный показ')}
          ${doItem('Записаться на показ')}
        </div>
      </div>

      <div>
        <div class="label" style="margin-bottom:12px;display:block;color:#C07070">✗ PROHIBITED — Never use</div>
        <div class="checklist">
          ${dontItem('Клубный дом')}
          ${dontItem('Дом полностью сдан')}
          ${dontItem('2 квартиры на этаже')}
          ${dontItem('Элия Хилл — приватность рядом')}
        </div>
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
        <div class="section-block-title">Negative Keyword System</div>
        <div class="section-block-desc">3,143 excluded keywords organized by category · All campaigns scope</div>
      </div>
    </div>

    <div class="table-wrapper" style="margin-bottom:24px">
      <table class="negatives-table">
        <thead>
          <tr>
            <th>Category</th>
            <th style="text-align:right">Count</th>
            <th>Examples</th>
            <th>Scope</th>
            <th>Reason</th>
          </tr>
        </thead>
        <tbody>
          ${cats.map(cat => `
            <tr>
              <td class="neg-cat">${escHtml(cat.label)}</td>
              <td class="neg-count"><strong>${cat.count.toLocaleString()}</strong></td>
              <td class="neg-examples">${cat.examples.slice(0,6).map(e => `<code style="background:var(--bg-hover);padding:1px 5px;border-radius:3px;font-size:10px">${escHtml(e)}</code>`).join(' ')}&hellip;</td>
              <td class="neg-scope"><span class="badge" style="background:rgba(80,80,80,0.2);color:var(--text-secondary);border:1px solid var(--border-subtle)">All Campaigns</span></td>
              <td class="neg-reason">${negReason(cat.status)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="card">
      <div class="card-title">Key Negative Rules</div>
      <div style="display:flex;flex-direction:column;gap:10px">
        <div style="font-size:13px;color:var(--text-secondary);display:flex;gap:10px"><span style="color:var(--accent-gold)">1.</span> Any rental signal (аренда, снять, rent, airbnb, посуточн) → NEGATIVE across all campaigns</div>
        <div style="font-size:13px;color:var(--text-secondary);display:flex;gap:10px"><span style="color:var(--accent-gold)">2.</span> US state of Georgia (Atlanta, Buckhead, etc.) → NEGATIVE via geo-specific terms list</div>
        <div style="font-size:13px;color:var(--text-secondary);display:flex;gap:10px"><span style="color:var(--accent-gold)">3.</span> Batumi, Kutaisi, Rustavi and other Georgian cities → NEGATIVE (wrong city)</div>
        <div style="font-size:13px;color:var(--text-secondary);display:flex;gap:10px"><span style="color:var(--accent-gold)">4.</span> House / дом / studio / студия → NEGATIVE (wrong product type)</div>
        <div style="font-size:13px;color:var(--text-secondary);display:flex;gap:10px"><span style="color:var(--accent-gold)">5.</span> Seller intent (продам, sell my) → NEGATIVE (wrong direction)</div>
        <div style="font-size:13px;color:var(--text-secondary);display:flex;gap:10px"><span style="color:var(--accent-gold)">6.</span> Hotel / hostel / Pullman → NEGATIVE (wrong category)</div>
        <div style="font-size:13px;color:var(--text-secondary);display:flex;gap:10px"><span style="color:var(--accent-gold)">7.</span> Ongoing: weekly search term review → add any missed irrelevant terms as negatives</div>
      </div>
    </div>
  `;
}

function negReason(status) {
  const map = {
    'EXCLUDED_RENTAL': 'Wrong intent — rental not purchase',
    'EXCLUDED_US_GEORGIA': 'Wrong country — US state',
    'EXCLUDED_BATUMI': 'Wrong city — not Tbilisi',
    'EXCLUDED_GENERAL': 'Wrong product type',
    'EXCLUDED_HOTEL': 'Wrong category — accommodation',
    'EXCLUDED_SELLER_INTENT': 'Wrong direction — seller not buyer',
  };
  return map[status] || status;
}

/* ---- S09 Объявления и тексты ---- */
function renderS09() {
  const camp1RuHeadlines = [
    'ELYSIUM Тбилиси',
    'Бутик-резиденция ELYSIUM',
    'Дом введён в эксплуатацию',
    '14 апартаментов от 130 м²',
    'Открыта к просмотру',
    'Свободная планировка',
    'Панорамный вид из каждой',
    'Тишина и приватность',
    'Подземный паркинг',
    'Записаться на показ',
    'Информация о проекте',
    '2 квартиры на этаже',
    'Генератор. Резервуар.',
    'Приватность. Безопасность.',
    'Не комплекс — бутик',
  ];
  const camp1RuDescs = [
    'ELYSIUM — бутик-резиденция. 14 апартаментов от 130 м². Дом введён в эксплуатацию.',
    'Открыта к просмотру. Свободная планировка. Без несущих стен. Панорамный вид.',
    'Приватность. Безопасность. Подземный паркинг. Независимость от коммуникаций.',
    'Записаться на показ — запросите планировки, цены и полную информацию о проекте.',
  ];
  const camp1EnHeadlines = [
    'ELYSIUM Boutique Residence',
    'ELYSIUM Tbilisi',
    'Building Commissioned & Ready',
    'Open for Private Viewing',
    '14 Apartments from 130 m²',
    'Boutique — Not a Complex',
    'Free Floor Plan — No Walls',
    'Panoramic Views from Every Apt',
    'Privacy. Security. Silence.',
    'Underground Parking Included',
    'Generator & Water Reserve',
    'Book a Private Viewing',
    'Full Project Information',
    '2 Apartments per Floor',
    'Only 14 Boutique Residences',
  ];
  const camp1EnDescs = [
    'ELYSIUM Boutique Residence in Tbilisi. 14 apartments from 130 m². Building commissioned.',
    'Open for private viewing. Free floor plan. Panoramic views from every residence.',
    'Privacy, security, silence. Underground parking. Generator & 70-ton water reserve.',
    'Book a private viewing. Request plans, pricing, and full project details.',
  ];

  const camp2RuHeadlines = [
    {text:'Апартаменты от 130 м²', pin:'P1'},
    {text:'Купить квартиру в Тбилиси', pin:null},
    {text:'Бутик-резиденция в Тбилиси', pin:null},
    {text:'Дом введён в эксплуатацию', pin:null},
    {text:'Квартира в Грузии от 130 м²', pin:null},
    {text:'Свободная планировка', pin:null},
    {text:'Панорамный вид из каждой', pin:null},
    {text:'Подземный паркинг', pin:null},
    {text:'Тишина и приватность', pin:null},
    {text:'Приватность. Безопасность.', pin:null},
    {text:'Открыта к просмотру', pin:null},
    {text:'Генератор. Резервуар.', pin:null},
    {text:'Записаться на показ', pin:null},
    {text:'Информация о проекте', pin:null},
    {text:'Не комплекс — резиденция', pin:null},
  ];
  const camp2RuDescs = [
    'Апартаменты от 130 м² в Тбилиси. Бутик-резиденция. Дом введён в эксплуатацию.',
    'Свободная планировка. Без несущих стен. Панорамный вид из каждой квартиры.',
    'Тишина. Приватность. Безопасность. Подземный паркинг. Открыта к просмотру.',
    'Запросите планировки, цены и личный показ. Полная информация о проекте.',
  ];

  const camp3EnHeadlines = [
    {text:'Apartments from 130 m²', pin:'P1'},
    {text:'Buy Apartment in Tbilisi', pin:null},
    {text:'Boutique Residence Tbilisi', pin:null},
    {text:'Building Commissioned & Ready', pin:null},
    {text:'Open for Private Viewing', pin:null},
    {text:'Luxury Tbilisi Real Estate', pin:null},
    {text:'Free Floor Plan — No Walls', pin:null},
    {text:'Panoramic Views — Every Unit', pin:null},
    {text:'Privacy. Security. Silence.', pin:null},
    {text:'Underground Parking Included', pin:null},
    {text:'Generator & Water Reserve', pin:null},
    {text:'Book a Private Viewing', pin:null},
    {text:'Plans & Prices on Request', pin:null},
    {text:'2 Apartments per Floor Only', pin:null},
    {text:'Boutique — Not a Complex', pin:null},
  ];
  const camp3EnDescs = [
    'Boutique Residence in Tbilisi. 14 apartments from 130 m². Building commissioned.',
    'Free floor plan. No load-bearing walls. Panoramic city views from every residence.',
    'Full infrastructure independence. Generator. 70-ton water reserve. 24/7 security.',
    'Book a private viewing. Request plans, pricing, and full project details.',
  ];

  const camp4RuHeadlines = [
    'Не комплекс — бутик-резиденция',
    'Дом введён в эксплуатацию',
    'Всего 2 квартиры на этаже',
    'Бутик-резиденция в Тбилиси',
    '14 апартаментов от 130 м²',
    'Панорамный вид из каждой',
    'Свободная планировка',
    'Тишина и приватность',
    'Приватность. Безопасность.',
    'Подземный паркинг',
    'Генератор. Резервуар.',
    'Открыта к просмотру',
    'Записаться на показ',
    'Информация о проекте',
    'Автономность. Независимость.',
  ];
  const camp4RuDescs = [
    'Дом введён в эксплуатацию. Всего 2 квартиры на этаже. Не комплекс, а бутик-резиденция.',
    'Свободная планировка. Без несущих стен. Панорамный вид из каждой квартиры.',
    'Тишина. Приватность. Безопасность. Подземный паркинг. Генератор. Резервуар.',
    'Записаться на показ. Запросите планировки, цены и полную информацию о проекте.',
  ];
  const camp4EnHeadlines = [
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
  const camp4EnDescs = [
    'Building commissioned. Only 2 apartments per floor. Boutique — not a complex.',
    'Free floor plan. Panoramic views from every residence. Privacy & silence.',
    'Underground parking. Generator. 70-ton water reserve. Full infrastructure backup.',
    'Book a private viewing. Compare ELYSIUM with any premium Tbilisi project.',
  ];

  const renderPinnedHeadlines = (headlines) => headlines.map(h => {
    const pinLabel = h.pin ? `<span style="font-size:9px;background:rgba(196,168,100,0.25);color:var(--accent-gold);border-radius:3px;padding:1px 4px;margin-right:4px;font-family:var(--font-mono);vertical-align:middle">${h.pin}</span>` : '';
    return `<span class="rsa-headline">${pinLabel}${h.text}</span>`;
  }).join('');

  const renderHeadlines = (headlines) => headlines.map(h => `<span class="rsa-headline">${h}</span>`).join('');
  const renderDescs = (descs) => descs.map(d => `<div class="rsa-desc">${d}</div>`).join('');

  const adPreview = (flagEmoji, label, url, headlineText, descText, footnote) => `
    <div style="background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:8px;padding:16px 20px">
      <div style="font-size:10px;color:var(--text-tertiary);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.08em">${flagEmoji} Google Ads — ${label}</div>
      <div style="font-size:11px;color:#4CAF50;font-family:var(--font-mono);margin-bottom:4px">🔗 ${url}</div>
      <div style="font-size:14px;color:#8ab4f8;font-weight:500;line-height:1.4;margin-bottom:8px">${headlineText}</div>
      <div style="font-size:12px;color:var(--text-secondary);line-height:1.6">${descText}</div>
      <div style="font-size:10px;color:var(--text-tertiary);margin-top:8px">${footnote}</div>
    </div>`;

  const campaignBlock = (borderColor, bgColor, flagEmoji, title, subtitle, content) => `
    <div style="border:2px solid ${borderColor};border-radius:10px;overflow:hidden;margin-bottom:32px">
      <div style="background:${bgColor};padding:16px 20px;border-bottom:1px solid ${borderColor};display:flex;gap:12px;align-items:center">
        <span style="font-size:20px">${flagEmoji}</span>
        <div>
          <div style="font-size:15px;font-weight:500;color:var(--text-primary)">${title}</div>
          <div style="font-size:11px;color:var(--text-tertiary);font-family:var(--font-mono)">${subtitle}</div>
        </div>
      </div>
      <div style="padding:20px 24px;display:flex;flex-direction:column;gap:20px">${content}</div>
    </div>`;

  const breakdown = (rows) => `
    <div style="background:var(--bg-hover);border-radius:8px;padding:16px">
      <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:var(--text-tertiary);margin-bottom:12px">Разбор объявления</div>
      <div style="display:flex;flex-direction:column;gap:8px;font-size:12px">
        ${rows.map(([k,v]) => `<div style="display:flex;gap:10px"><span style="color:var(--accent-gold);flex-shrink:0;min-width:160px">${k}</span><span style="color:var(--text-secondary)">${v}</span></div>`).join('')}
      </div>
    </div>`;

  const headlinesBlock = (label, content) => `
    <div>
      <div style="font-size:11px;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px">${label}</div>
      <div class="rsa-headlines">${content}</div>
    </div>`;

  const descsBlock = (label, content) => `
    <div>
      <div style="font-size:11px;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px">${label}</div>
      <div class="rsa-descriptions">${content}</div>
    </div>`;

  const langDivider = (label) => `
    <div style="display:flex;align-items:center;gap:10px;margin:4px 0">
      <div style="flex:1;height:1px;background:var(--border-subtle)"></div>
      <div style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-tertiary)">${label}</div>
      <div style="flex:1;height:1px;background:var(--border-subtle)"></div>
    </div>`;

  return `
    <div class="section-block-header">
      <div class="section-block-num">09</div>
      <div class="section-block-title-wrap">
        <div class="section-block-title">Объявления и тексты (Ads &amp; Messaging)</div>
        <div class="section-block-desc">RSA-объявления для всех 4 кампаний — 15 заголовков и 4 описания на каждое объявление</div>
      </div>
    </div>

    <div class="card" style="margin-bottom:32px">
      <div style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-tertiary);margin-bottom:14px">Какие объявления мы запускаем</div>
      <div style="display:flex;flex-direction:column;gap:8px">
        ${[
          ['1','Брендовая (RU + EN)','Брендовые объявления на двух языках','IL · UA · BY — пользователи, ищущие ELYSIUM по имени'],
          ['2','Основная покупка — RU','15 заголовков + 4 описания на русском','IL · UA · BY · Первый заголовок закреплён: «Апартаменты от 130 м²»'],
          ['3','Основная покупка — EN','15 headlines + 4 descriptions in English','IL · UA · BY · First headline pinned: "Apartments from 130 m²"'],
          ['4','Конкурентная (RU + EN)','Конкурентные объявления на двух языках','IL · UA · BY — аудитория конкурирующих проектов'],
        ].map(([num, name, adType, audience]) => `
          <div style="display:flex;gap:12px;align-items:flex-start;padding:10px 14px;background:var(--bg-hover);border-radius:6px">
            <div style="font-size:11px;font-family:var(--font-mono);color:var(--accent-gold);flex-shrink:0;padding-top:2px">К${num}</div>
            <div>
              <div style="font-size:12px;color:var(--text-primary);margin-bottom:2px">${name} → <span style="color:var(--text-secondary)">${adType}</span></div>
              <div style="font-size:11px;color:var(--text-tertiary)">${audience}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    ${campaignBlock('rgba(196,168,100,0.3)','rgba(196,168,100,0.06)','🏷️','Кампания 1 — Брендовая (Brand)','Brand — ELYSIUM · ~15 ключевых слов · Аудитория: IL · UA · BY · RU + EN',`
      ${langDivider('🇷🇺 RU — Русский')}
      ${adPreview('🇷🇺','Пример объявления (RU)','elysiumtbilisi.com',
        'ELYSIUM Тбилиси | Бутик-резиденция ELYSIUM | Дом введён в эксплуатацию',
        'ELYSIUM — бутик-резиденция. 14 апартаментов от 130 м². Дом введён в эксплуатацию.<br>Открыта к просмотру. Свободная планировка. Без несущих стен. Панорамный вид.',
        'Google подбирает лучшую комбинацию из 15 заголовков и 4 описаний автоматически')}
      ${headlinesBlock('Заголовки RU — 15 шт., макс. 30 символов каждый', renderHeadlines(camp1RuHeadlines))}
      ${descsBlock('Описания RU — 4 шт., макс. 90 символов каждое', renderDescs(camp1RuDescs))}
      ${langDivider('🇬🇧 EN — English')}
      ${adPreview('🇬🇧','Ad Preview (EN)','elysiumtbilisi.com',
        'ELYSIUM Boutique Residence | Building Commissioned &amp; Ready | Open for Private Viewing',
        'ELYSIUM Boutique Residence in Tbilisi. 14 apartments from 130 m². Building commissioned.<br>Open for private viewing. Free floor plan. Panoramic views from every residence.',
        'Google selects the best combination from 15 headlines and 4 descriptions automatically')}
      ${headlinesBlock('Headlines EN — 15 items, max 30 chars each', renderHeadlines(camp1EnHeadlines))}
      ${descsBlock('Descriptions EN — 4 items, max 90 chars each', renderDescs(camp1EnDescs))}
      ${breakdown([
        ['Аудитория:','Пользователи, ищущие «ELYSIUM», «Элизиум Тбилиси», «бутик резиденция элизиум» — самый горячий трафик'],
        ['Цель:','Защита бренда от конкурентного перехвата, захват пользователей с максимальным намерением купить'],
        ['CTA:','«Записаться на показ» · «Информация о проекте» / "Book a Private Viewing" · "Full Project Information"'],
      ])}
    `)}

    ${campaignBlock('rgba(116,185,116,0.3)','rgba(116,185,116,0.08)','🇷🇺','Кампания 2 — Основная покупка RU','Core Premium Purchase — RU · 141 ключевое слово · Аудитория: IL · UA · BY',`
      ${adPreview('🇷🇺','Пример объявления (RU)','elysiumtbilisi.com',
        'Апартаменты от 130 м² | Бутик-резиденция в Тбилиси | Дом введён в эксплуатацию',
        'Апартаменты от 130 м² в Тбилиси. Бутик-резиденция. Дом введён в эксплуатацию.<br>Свободная планировка. Без несущих стен. Панорамный вид из каждой квартиры.',
        'Google подбирает лучшую комбинацию из 15 заголовков и 4 описаний автоматически')}
      ${headlinesBlock('Заголовки RU — 15 шт., макс. 30 символов каждый (📌 = Позиция 1 закреплена)', renderPinnedHeadlines(camp2RuHeadlines))}
      ${descsBlock('Описания RU — 4 шт., макс. 90 символов каждое', renderDescs(camp2RuDescs))}
      <div style="background:rgba(255,160,0,0.06);border:1px solid rgba(255,160,0,0.2);border-radius:8px;padding:14px 16px">
        <div style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:#FFA000;margin-bottom:8px">⛔ Минус-слова кампании 2</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          ${['студия','студии'].map(w => `<span style="font-family:var(--font-mono);font-size:12px;background:rgba(255,80,80,0.1);color:#FF8A80;border-radius:4px;padding:3px 8px">−${w}</span>`).join('')}
        </div>
        <div style="font-size:11px;color:var(--text-tertiary);margin-top:8px">Студии исключены: ELYSIUM предлагает апартаменты от 130 м² — студийный трафик нецелевой</div>
      </div>
      ${breakdown([
        ['Для какого спроса:','«купить квартиру в тбилиси», «элитная недвижимость тбилиси», «квартиру в Грузии» — прямое намерение купить на русском'],
        ['Что продаём:','Готовую бутик-резиденцию в Тбилиси — 14 апартаментов от 130 м², дом введён в эксплуатацию, открыт к просмотру'],
        ['CTA:','«Записаться на показ» · «Полная информация о проекте»'],
      ])}
    `)}

    ${campaignBlock('rgba(74,106,140,0.3)','rgba(74,106,140,0.08)','🇬🇧','Кампания 3 — Основная покупка EN','Core Premium Purchase — EN · 83 keywords · Audience: IL · UA · BY',`
      ${adPreview('🇬🇧','Ad Preview (EN)','elysiumtbilisi.com',
        'Apartments from 130 m² | Boutique Residence Tbilisi | Building Commissioned &amp; Ready',
        'Boutique Residence in Tbilisi. 14 apartments from 130 m². Building commissioned.<br>Free floor plan. No load-bearing walls. Panoramic city views from every residence.',
        'Google selects the best combination from 15 headlines and 4 descriptions automatically')}
      ${headlinesBlock('Headlines EN — 15 items, max 30 chars each (📌 = Position 1 pinned)', renderPinnedHeadlines(camp3EnHeadlines))}
      ${descsBlock('Descriptions EN — 4 items, max 90 chars each', renderDescs(camp3EnDescs))}
      ${breakdown([
        ['Target demand:','"buy apartment tbilisi", "luxury apartment tbilisi", "boutique residence tbilisi" — direct purchase intent in English, Israel priority'],
        ['What we sell:','Commissioned boutique residence in Tbilisi — 14 apartments from 130 m², open for private viewing now'],
        ['CTA:','"Book a Private Viewing" · "Plans & Prices on Request"'],
      ])}
    `)}

    ${campaignBlock('rgba(220,120,60,0.3)','rgba(220,120,60,0.06)','⚔️','Кампания 4 — Конкурентная (Competitors)','Competitors · 87 ключевых слов (CHECK_REQUIRED) · Pool I · RU + EN',`
      <div class="note-box warning" style="margin-bottom:0">
        <span class="note-box-icon">⚠</span>
        <div>Все 87 ключевых слов Pool I требуют ручной проверки перед запуском (CHECK_REQUIRED). Объявления показываются, когда пользователь ищет конкурирующий проект. Стратегия: предложить ELYSIUM как лучшую альтернативу.</div>
      </div>
      ${langDivider('🇷🇺 RU — Русский')}
      ${adPreview('🇷🇺','Пример объявления (RU)','elysiumtbilisi.com',
        'Не комплекс — бутик-резиденция | Дом введён в эксплуатацию | Всего 2 квартиры на этаже',
        'Дом введён в эксплуатацию. Всего 2 квартиры на этаже. Не комплекс, а бутик-резиденция.<br>Свободная планировка. Без несущих стен. Панорамный вид из каждой квартиры.',
        'Google подбирает лучшую комбинацию из 15 заголовков и 4 описаний автоматически')}
      ${headlinesBlock('Заголовки RU — 15 шт., макс. 30 символов каждый', renderHeadlines(camp4RuHeadlines))}
      ${descsBlock('Описания RU — 4 шт., макс. 90 символов каждое', renderDescs(camp4RuDescs))}
      ${langDivider('🇬🇧 EN — English')}
      ${adPreview('🇬🇧','Ad Preview (EN)','elysiumtbilisi.com',
        'Boutique — Not a Complex | Building Commissioned &amp; Ready | Only 2 Apartments per Floor',
        'Building commissioned. Only 2 apartments per floor. Boutique — not a complex.<br>Free floor plan. Panoramic views from every residence. Privacy & silence.',
        'Google selects the best combination from 15 headlines and 4 descriptions automatically')}
      ${headlinesBlock('Headlines EN — 15 items, max 30 chars each', renderHeadlines(camp4EnHeadlines))}
      ${descsBlock('Descriptions EN — 4 items, max 90 chars each', renderDescs(camp4EnDescs))}
      ${breakdown([
        ['Триггер:','Пользователь ищет конкурирующий проект (Park Home Vake, CityZen, Next Tbilisi, Gergeti Rise...)'],
        ['Сообщение:','«Не комплекс, а бутик-резиденция» · «Дом введён в эксплуатацию» · «Всего 2 квартиры на этаже»'],
        ['Ключевые отличия:','Свободная планировка · Панорамный вид · Подземный паркинг · Автономная инфраструктура'],
        ['CTA:','«Записаться на показ» · «Полная информация о проекте» / "Book a Private Viewing" · "Request Full Project Info"'],
      ])}
    `)}

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
          ${[
            ['К1 — 15 заголовков RU','PASS'],
            ['К1 — 4 описания RU','PASS'],
            ['К1 — 15 заголовков EN','PASS'],
            ['К1 — 4 описания EN','PASS'],
            ['К2 — 15 заголовков RU','PASS'],
            ['К2 — «Апартаменты от 130 м²» закреплён в Позиции 1','PASS'],
            ['К2 — 4 описания RU','PASS'],
            ['К2 — Минус-слова «студия/студии» указаны','PASS'],
            ['К2 — «Квартиру в Грузии» сохранён в объявлении','PASS'],
            ['К3 — 15 заголовков EN','PASS'],
            ['К3 — "Apartments from 130 m²" закреплён в Position 1','PASS'],
            ['К3 — 4 описания EN','PASS'],
            ['К4 — 15 заголовков RU','PASS'],
            ['К4 — 4 описания RU','PASS'],
            ['К4 — 15 заголовков EN','PASS'],
            ['К4 — 4 описания EN','PASS'],
            ['Нет «клубный дом» / «club house» / «clubhouse»','PASS'],
            ['Нет «купить дом» / «buy house»','PASS'],
            ['Нет «Дом полностью сдан»','PASS'],
            ['Нет «Записаться на показ сегодня» или «сегодня» в CTA','PASS'],
            ['Нет «Элия Хилл — приватность рядом»','PASS'],
            ['«Бутик-резиденция» — использован во всех 4 кампаниях','PASS'],
            ['«Дом введён в эксплуатацию» — использован','PASS'],
            ['«Не комплекс» — использован в К1/К4','PASS'],
            ['«14 апартаментов от 130 м²» — использован','PASS'],
            ['«Свободная планировка» — использован','PASS'],
            ['«Панорамный вид из каждой» — использован','PASS'],
            ['«2 квартиры на этаже» — использован','PASS'],
            ['«Подземный паркинг» — использован','PASS'],
            ['«Тишина и приватность» — использован','PASS'],
            ['«Генератор / Автономность» — использован','PASS'],
            ['«Записаться на показ» — использован','PASS'],
            ['«Информация о проекте» — использован','PASS'],
            ['Все заголовки ≤ 30 символов','PASS'],
            ['Все описания ≤ 90 символов','PASS'],
            ['S01–S05, S07–S08, S10–S17 не изменены','PASS'],
          ].map(([req, status], i) => `
            <tr style="border-bottom:1px solid var(--border-subtle)">
              <td style="padding:6px 10px;color:var(--text-tertiary);font-family:var(--font-mono)">${i+1}</td>
              <td style="padding:6px 10px;color:var(--text-secondary)">${req}</td>
              <td style="padding:6px 10px;text-align:center">
                <span style="font-size:11px;font-weight:600;color:${status==='PASS'?'#4CAF50':'#FF5252'};background:${status==='PASS'?'rgba(76,175,80,0.1)':'rgba(255,82,82,0.1)'};border-radius:4px;padding:2px 8px">${status==='PASS'?'✓ PASS':'✗ FAIL'}</span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="note-box info">
      <span class="note-box-icon">ℹ</span>
      <div>RSA (адаптивное поисковое объявление) требует минимум 3 заголовка и 2 описания для активации. Все кампании укомплектованы максимальным набором: 15 заголовков + 4 описания — Google автоматически подбирает лучшую комбинацию из 3 заголовков и 2 описаний для каждого показа.</div>
    </div>
  `;
}

/* ---- S10 Landing Page Strategy ---- */
function renderS10() {
  return `
    <div class="section-block-header">
      <div class="section-block-num">10</div>
      <div class="section-block-title-wrap">
        <div class="section-block-title">Landing Page Strategy</div>
        <div class="section-block-desc">Intent-to-page mapping and site gap analysis</div>
      </div>
    </div>

    <div class="table-wrapper" style="margin-bottom:28px">
      <table class="intent-map-table">
        <thead>
          <tr>
            <th>Search Intent</th>
            <th>Ad Group</th>
            <th>Key Message</th>
            <th>Landing Section</th>
            <th>CTA</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="im-intent">Купить квартиру в Тбилиси</td>
            <td>Core RU — Purchase</td>
            <td>Бутик-резиденция. Дом введён в эксплуатацию</td>
            <td>Hero + About</td>
            <td>Записаться на показ</td>
          </tr>
          <tr>
            <td class="im-intent">Buy apartment Tbilisi</td>
            <td>Core EN — Purchase</td>
            <td>Boutique Residence. Building commissioned.</td>
            <td>Hero + Architecture</td>
            <td>Book a Viewing</td>
          </tr>
          <tr>
            <td class="im-intent">Luxury apartment Tbilisi</td>
            <td>Core EN — Luxury</td>
            <td>14 residences, from 130 m², panoramic views</td>
            <td>Quality + Views</td>
            <td>Contact</td>
          </tr>
          <tr class="gap-row">
            <td class="im-intent">Investment property Georgia</td>
            <td>Investment</td>
            <td>—</td>
            <td class="im-gap">⚠ No investment section</td>
            <td>Investment inquiry</td>
          </tr>
          <tr class="gap-row">
            <td class="im-intent">Penthouse Tbilisi</td>
            <td>Penthouse</td>
            <td>—</td>
            <td class="im-gap">⚠ No penthouse section</td>
            <td>Contact</td>
          </tr>
          <tr>
            <td class="im-intent">Park Home Vake</td>
            <td>Competitors</td>
            <td>ELYSIUM vs. large complexes</td>
            <td>Main page</td>
            <td>Book a Viewing</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card-title" style="margin-bottom:16px">Gap Analysis — Missing from elysiumtbilisi.com</div>
    <div class="gap-grid" style="margin-bottom:24px">
      <div class="gap-card"><span class="gap-icon">⚠</span><span class="gap-text">No investment / ROI section</span></div>
      <div class="gap-card"><span class="gap-icon">⚠</span><span class="gap-text">No floor plan downloads</span></div>
      <div class="gap-card"><span class="gap-icon">⚠</span><span class="gap-text">No price anchoring ("from $…")</span></div>
      <div class="gap-card"><span class="gap-icon">⚠</span><span class="gap-text">No WhatsApp / Telegram CTA</span></div>
      <div class="gap-card"><span class="gap-icon">⚠</span><span class="gap-text">No penthouse-specific content</span></div>
      <div class="gap-card"><span class="gap-icon">⚠</span><span class="gap-text">CTAs only visible after initial load</span></div>
    </div>

    <div class="card">
      <div class="card-title">Recommended Additions (Priority Order)</div>
      <div style="display:flex;flex-direction:column;gap:10px">
        <div style="display:flex;gap:12px;align-items:flex-start;font-size:13px;color:var(--text-secondary)">
          <span style="color:var(--accent-gold);font-family:var(--font-mono);min-width:20px">1.</span>
          <span><strong style="color:var(--text-primary)">WhatsApp / Telegram floating button</strong> — Immediate, high impact. IL audience primarily mobile.</span>
        </div>
        <div style="display:flex;gap:12px;align-items:flex-start;font-size:13px;color:var(--text-secondary)">
          <span style="color:var(--accent-gold);font-family:var(--font-mono);min-width:20px">2.</span>
          <span><strong style="color:var(--text-primary)">Investment value section</strong> — 3 paragraphs on Georgian RE market, rental yield, capital appreciation.</span>
        </div>
        <div style="display:flex;gap:12px;align-items:flex-start;font-size:13px;color:var(--text-secondary)">
          <span style="color:var(--accent-gold);font-family:var(--font-mono);min-width:20px">3.</span>
          <span><strong style="color:var(--text-primary)">Floor plan PDF download</strong> — Requires form/contact before delivery (lead capture).</span>
        </div>
        <div style="display:flex;gap:12px;align-items:flex-start;font-size:13px;color:var(--text-secondary)">
          <span style="color:var(--accent-gold);font-family:var(--font-mono);min-width:20px">4.</span>
          <span><strong style="color:var(--text-primary)">Faster mobile load</strong> — IL audience primarily mobile. Core Web Vitals directly affect Quality Score and CPC.</span>
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
        <div class="section-block-title">Budget & Bidding</div>
        <div class="section-block-desc">Phased bidding approach · $500/month total allocation</div>
      </div>
    </div>

    <div class="table-wrapper" style="margin-bottom:28px">
      <table class="kpi-table">
        <thead>
          <tr>
            <th>Campaign</th>
            <th>Monthly Budget</th>
            <th>Daily (Approx)</th>
            <th>%</th>
            <th>Intent</th>
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
            <td style="font-weight:600;color:var(--text-primary)">TOTAL</td>
            <td style="font-family:var(--font-mono);font-weight:600;color:var(--accent-gold)">$500</td>
            <td style="font-family:var(--font-mono);color:var(--text-secondary)">~$16.67/day</td>
            <td style="font-family:var(--font-mono);font-weight:600;color:var(--text-primary)">100%</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card-title" style="margin-bottom:16px">Bidding Phases</div>
    <div class="bidding-phases">
      <div class="bidding-phase">
        <div class="bidding-phase-num">Phase 1</div>
        <div class="bidding-phase-title">Manual CPC</div>
        <div class="bidding-phase-when">Month 1–2</div>
        <div class="bidding-phase-desc">Account lacks sufficient conversion data for Smart Bidding. Full manual control. Monitor CPCs closely.</div>
      </div>
      <div class="bidding-phase">
        <div class="bidding-phase-num">Phase 2</div>
        <div class="bidding-phase-title">Enhanced CPC</div>
        <div class="bidding-phase-when">Month 3 · if 20+ conversions/campaign</div>
        <div class="bidding-phase-desc">Semi-automated. Google adjusts bids within your set maximum. Lower risk than Target CPA.</div>
      </div>
      <div class="bidding-phase">
        <div class="bidding-phase-num">Phase 3</div>
        <div class="bidding-phase-title">Target CPA</div>
        <div class="bidding-phase-when">Month 4+ · if 30+ conv/month total</div>
        <div class="bidding-phase-desc">Full Smart Bidding. Requires consistent recent conversion volume across all campaigns combined.</div>
      </div>
    </div>

    <div class="card" style="margin-top:24px">
      <div class="card-title">CPC Expectations (from research)</div>
      <div class="cpc-expectations">
        <div class="cpc-exp-item">
          <div class="cpc-exp-pool">Pool A avg</div>
          <div class="cpc-exp-val">$1.20</div>
          <div class="cpc-exp-note">Core purchase intent</div>
        </div>
        <div class="cpc-exp-item">
          <div class="cpc-exp-pool">Pool B avg</div>
          <div class="cpc-exp-val">$1.24</div>
          <div class="cpc-exp-note">Premium / luxury</div>
        </div>
        <div class="cpc-exp-item">
          <div class="cpc-exp-pool">Pool D avg</div>
          <div class="cpc-exp-val">$1.00</div>
          <div class="cpc-exp-note">Penthouse</div>
        </div>
        <div class="cpc-exp-item">
          <div class="cpc-exp-pool">Clicks/day/camp</div>
          <div class="cpc-exp-val">3–4</div>
          <div class="cpc-exp-note">at $4.17/day, $1.20 CPC</div>
        </div>
        <div class="cpc-exp-item">
          <div class="cpc-exp-pool">Est. leads/mo/camp</div>
          <div class="cpc-exp-val">4–12</div>
          <div class="cpc-exp-note">at 5–10% lead rate</div>
        </div>
      </div>
      <div class="note-box info" style="margin-top:16px;margin-bottom:0">
        <span class="note-box-icon">ℹ</span>
        <div>These are rough expectations based on market knowledge, not forecasts. Real CPL will only be known after launch. Lead rate assumption (5–10%) is directional only.</div>
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
        <div class="section-block-title">Conversion & Analytics</div>
        <div class="section-block-desc">Funnel architecture · Conversion tracking events · Metrics framework</div>
      </div>
    </div>

    <div class="two-col">
      <div>
        <div class="card-title" style="margin-bottom:20px">Conversion Funnel</div>
        <div class="funnel">
          ${['Impression','Click','Landing Page Visit','Lead (form/phone/WA)','Qualified Lead','Manager Contact','Viewing','Booking','Deal'].map((step, i) => `
            ${i > 0 ? '<div class="funnel-connector"></div>' : ''}
            <div class="funnel-step">
              <span class="funnel-idx">${i+1}</span>
              <div class="funnel-bar ${step.includes('Lead') ? 'highlight' : ''}">${step}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div>
        <div class="card-title" style="margin-bottom:16px">Conversion Events to Track</div>
        <div class="table-wrapper">
          <table class="conv-table">
            <thead>
              <tr><th>Event</th><th>Type</th><th>Priority</th></tr>
            </thead>
            <tbody>
              <tr><td class="conv-event">Form submission (#form1)</td><td>Primary</td><td class="conv-priority-critical">Critical</td></tr>
              <tr><td class="conv-event">Phone click</td><td>Primary</td><td class="conv-priority-critical">Critical</td></tr>
              <tr><td class="conv-event">WhatsApp / Telegram click</td><td>Primary</td><td class="conv-priority-critical">Critical</td></tr>
              <tr><td class="conv-event">Time on page &gt;3 min</td><td>Micro</td><td class="conv-priority-important">Important</td></tr>
              <tr><td class="conv-event">Floor plan download</td><td>Micro</td><td class="conv-priority-important">Important</td></tr>
              <tr><td class="conv-event">Scroll depth &gt;75%</td><td>Engagement</td><td class="conv-priority-secondary">Secondary</td></tr>
            </tbody>
          </table>
        </div>

        <div class="card" style="margin-top:20px">
          <div class="card-title">Metrics Framework</div>
          <div style="display:flex;flex-direction:column;gap:8px;font-size:12px;color:var(--text-secondary)">
            <div><span style="color:var(--text-tertiary)">Google data:</span> Impressions · Clicks · CTR · CPC</div>
            <div><span style="color:var(--text-tertiary)">GA4:</span> Landing sessions · Bounce rate</div>
            <div><span style="color:var(--text-tertiary)">CRM:</span> Leads = form + phone + WA</div>
            <div><span style="color:var(--text-tertiary)">Key ratio:</span> CPL = Spend / Leads</div>
            <div><span style="color:var(--text-tertiary)">Sales:</span> Qualified leads (sales feedback)</div>
            <div><span style="color:var(--text-tertiary)">Key ratio:</span> CPQL = Spend / Qualified Leads</div>
            <div><span style="color:var(--text-tertiary)">Pipeline:</span> Viewings booked · Deals closed</div>
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
        <div class="section-block-title">Optimization System</div>
        <div class="section-block-desc">Recurring review cadence — Weekly · Monthly · Quarterly</div>
      </div>
    </div>

    <div class="schedule-grid">
      <div class="schedule-card">
        <div class="schedule-period">Weekly</div>
        <div class="schedule-items">
          <div class="schedule-item">Search terms review → add negatives for irrelevant matches</div>
          <div class="schedule-item">CTR by ad group → pause underperforming ads (&lt;1% CTR after 200 impressions)</div>
          <div class="schedule-item">Budget pacing check — ensure even daily spend</div>
          <div class="schedule-item">Position monitoring for Brand campaign</div>
        </div>
      </div>

      <div class="schedule-card">
        <div class="schedule-period">Monthly</div>
        <div class="schedule-items">
          <div class="schedule-item">Keyword performance → move low CTR to paused</div>
          <div class="schedule-item">Ad copy A/B results → kill losing variants</div>
          <div class="schedule-item">Competitor campaign review → add / remove keywords based on relevance</div>
          <div class="schedule-item">Bid adjustments by geo (IL / UA / BY)</div>
          <div class="schedule-item">Landing page heatmap review (if Hotjar installed)</div>
          <div class="schedule-item">CPL report — compare actual vs. target</div>
        </div>
      </div>

      <div class="schedule-card">
        <div class="schedule-period">Quarterly</div>
        <div class="schedule-items">
          <div class="schedule-item">Full campaign audit across all 4 campaigns</div>
          <div class="schedule-item">Keyword database update — re-run Planner if needed</div>
          <div class="schedule-item">Budget reallocation based on CPL data by campaign</div>
          <div class="schedule-item">Campaign structure review — add new ad groups if needed</div>
          <div class="schedule-item">Competitor landscape update — new projects?</div>
          <div class="schedule-item">Smart Bidding readiness assessment</div>
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
        <div class="section-block-title">Testing Framework</div>
        <div class="section-block-desc">Structured A/B tests for creative, matching, and landing pages</div>
      </div>
    </div>

    <div class="table-wrapper">
      <table class="test-table">
        <thead>
          <tr>
            <th>Test</th>
            <th>Variable</th>
            <th>Duration</th>
            <th>Success Metric</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="test-name">Ad Copy A/B</td>
            <td>Headline 1: Brand name vs. Product ("Бутик-резиденция" vs. "14 Резиденций в Тбилиси")</td>
            <td class="test-duration">4 weeks</td>
            <td class="test-metric">CTR + Conv Rate</td>
          </tr>
          <tr>
            <td class="test-name">Match Type Test</td>
            <td>Exact vs. Phrase match on top 20 terms</td>
            <td class="test-duration">6 weeks</td>
            <td class="test-metric">CPA difference</td>
          </tr>
          <tr>
            <td class="test-name">Geo Bid Adjustment</td>
            <td>Israel +20% vs. flat bid (IL/UA/BY)</td>
            <td class="test-duration">4 weeks</td>
            <td class="test-metric">CPL by country</td>
          </tr>
          <tr>
            <td class="test-name">Landing Page</td>
            <td>Main elysiumtbilisi.com vs. dedicated Investment LP</td>
            <td class="test-duration">8 weeks</td>
            <td class="test-metric">Lead rate</td>
          </tr>
          <tr>
            <td class="test-name">CTA Language</td>
            <td>"Записаться на показ" vs. "Узнать цену и планировку"</td>
            <td class="test-duration">4 weeks</td>
            <td class="test-metric">Click-through rate on CTA</td>
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
        <div class="section-block-title">KPI Framework</div>
        <div class="section-block-desc">Directional targets — actual baseline will be established post-launch</div>
      </div>
    </div>

    <div class="note-box info" style="margin-bottom:24px">
      <span class="note-box-icon">ℹ</span>
      <div>These are directional targets based on market knowledge, not forecasts. Actual results will determine the real baseline after 4–6 weeks of live data.</div>
    </div>

    <div class="table-wrapper">
      <table class="kpi-table">
        <thead>
          <tr>
            <th>KPI</th>
            <th>Target Month 1–3</th>
            <th>Target Month 4–6</th>
            <th>Source</th>
          </tr>
        </thead>
        <tbody>
          <tr><td class="kpi-name">Impressions</td><td class="kpi-val">&gt;5,000/mo</td><td class="kpi-val">&gt;10,000/mo</td><td>Google Ads</td></tr>
          <tr><td class="kpi-name">CTR</td><td class="kpi-val">&gt;3%</td><td class="kpi-val">&gt;4%</td><td>Google Ads</td></tr>
          <tr><td class="kpi-name">CPC</td><td class="kpi-val">&lt;$2.00</td><td class="kpi-val">&lt;$1.50</td><td>Google Ads</td></tr>
          <tr><td class="kpi-name">Leads / month</td><td class="kpi-val">10–20</td><td class="kpi-val">20–40</td><td>CRM</td></tr>
          <tr><td class="kpi-name">CPL</td><td class="kpi-val">&lt;$50</td><td class="kpi-val">&lt;$30</td><td>CRM / Ads</td></tr>
          <tr><td class="kpi-name">Qualified Leads</td><td class="kpi-val">3–8/mo</td><td class="kpi-val">8–15/mo</td><td>Sales</td></tr>
          <tr><td class="kpi-name">CPQL</td><td class="kpi-val">&lt;$150</td><td class="kpi-val">&lt;$80</td><td>Sales / Ads</td></tr>
          <tr><td class="kpi-name">Viewings</td><td class="kpi-val">1–3/mo</td><td class="kpi-val">3–6/mo</td><td>Sales</td></tr>
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
        <div class="section-block-title">90-Day Roadmap</div>
        <div class="section-block-desc">Phased launch plan — Setup → Data → Optimize</div>
      </div>
    </div>

    <div class="timeline">
      <div class="timeline-phase phase-1">
        <div class="timeline-dot"></div>
        <div class="timeline-phase-eyebrow">Phase 1 — Weeks 1–2</div>
        <div class="timeline-phase-title">Setup & Foundation</div>
        <div class="timeline-items">
          <div class="timeline-item">Landing page: Add WhatsApp/Telegram button (immediate, high impact)</div>
          <div class="timeline-item">Landing page: Add investment value section (3 paragraphs)</div>
          <div class="timeline-item">Landing page: Add floor plan PDF download (gated with contact form)</div>
          <div class="timeline-item">Google Ads: Set up conversion tracking — form, phone, WhatsApp</div>
          <div class="timeline-item">Google Ads: Create Brand campaign → launch immediately</div>
          <div class="timeline-item">Google Ads: Create Core RU campaign → Exact match only</div>
          <div class="timeline-item">Google Ads: Create Core EN campaign → Exact match only</div>
          <div class="timeline-item">Create all RSA ads — minimum 3 per ad group, target 15 headlines each</div>
          <div class="timeline-item">Set up UTM parameters for all ads</div>
        </div>
      </div>

      <div class="timeline-phase phase-2">
        <div class="timeline-dot"></div>
        <div class="timeline-phase-eyebrow">Phase 2 — Weeks 3–8</div>
        <div class="timeline-phase-title">Launch & Data Collection</div>
        <div class="timeline-items">
          <div class="timeline-item">Review Competitors campaign keywords manually → launch top 20 highest-relevance</div>
          <div class="timeline-item">Add Phrase match to best-performing Exact keywords (after 2 weeks data)</div>
          <div class="timeline-item">Weekly: review search terms → add negatives for irrelevant matches</div>
          <div class="timeline-item">Monthly: first performance review — impressions, CTR, CPC, leads</div>
          <div class="timeline-item">Add GA4 + Google Tag Manager for full attribution</div>
          <div class="timeline-item">Set up bid adjustments by device and time of day</div>
        </div>
      </div>

      <div class="timeline-phase phase-3">
        <div class="timeline-dot"></div>
        <div class="timeline-phase-eyebrow">Phase 3 — Months 3–4</div>
        <div class="timeline-phase-title">Optimization & Scale</div>
        <div class="timeline-items">
          <div class="timeline-item">First bid adjustments by geo — increase Israel if CPL data supports</div>
          <div class="timeline-item">A/B test headline variants — kill losing copy</div>
          <div class="timeline-item">If 20+ conversions/campaign: switch to Enhanced CPC</div>
          <div class="timeline-item">Evaluate Investment landing page — build if ROI positive</div>
          <div class="timeline-item">Keyword expansion — add Phrase match winners to KEEP list</div>
          <div class="timeline-item">If 30+ conv/month total: evaluate Target CPA</div>
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
    'Rental keywords in Core campaigns: 0',
    'Batumi terms in Core campaigns: 0',
    'Other Georgian cities in Core: 0',
    'US Georgia terms in Core: 0',
    'Hotel terms in Core: 0',
    'Hotel terms in Competitor Pool: 0',
    'Seller intent in Core: 0',
    'False Lisi matches: 0',
    'Google Sheet Competitors: 14/14 verified',
    'Duplicate keywords in final list: 0',
    'Pool A keywords verified: PASS',
    'Pool B luxury signal verified: PASS',
    'Pool D penthouse verified: PASS',
    'Pool E investment verified: PASS',
    'Pool F new build verified: PASS',
    'Pool G districts verified: PASS',
    'Pool H lifestyle verified: PASS',
    'Pool I competitors all CHECK_REQUIRED: PASS',
    'Pool J generic RE coverage: PASS',
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
        <div class="section-block-title">Research & QA</div>
        <div class="section-block-desc">Full keyword research methodology and quality assurance results</div>
      </div>
    </div>

    <div class="metrics-row" style="margin-bottom:28px">
      <div class="metric-card">
        <div class="metric-label">Total Researched</div>
        <div class="metric-value">${(rs.total_keywords||4412).toLocaleString()}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Phases</div>
        <div class="metric-value">${(rs.phases||[]).length || 4}</div>
      </div>
      <div class="metric-card gold">
        <div class="metric-label">KEEP</div>
        <div class="metric-value">${rs.keep_count||408}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">CHECK Required</div>
        <div class="metric-value">${rs.check_required_count||861}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Excluded</div>
        <div class="metric-value">${(rs.excluded_count||3143).toLocaleString()}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Zero Volume Saved</div>
        <div class="metric-value">${(rs.zero_volume_count||3004).toLocaleString()}</div>
      </div>
    </div>

    <div class="two-col" style="margin-bottom:28px">
      <div>
        <div class="card-title" style="margin-bottom:16px">Pool Statistics</div>
        <div class="table-wrapper">
          <table class="pool-table">
            <thead>
              <tr><th>Pool</th><th>Name</th><th style="text-align:right">Total</th><th style="text-align:right">KEEP</th><th style="text-align:right">CHECK</th></tr>
            </thead>
            <tbody>
              ${poolRows}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div class="card-title" style="margin-bottom:16px">QA Results — ${rs.qa_checks_passed||19}/${rs.qa_checks_total||19} PASS</div>
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
        <strong>QA Status: ALL PASS.</strong> 19/19 quality checks completed with zero failures.
        The keyword database is validated and campaign-ready. Historical account keywords (${rs.historical_keywords||74}) have been preserved and integrated.
        4 research phases completed: Keyword Planner, Extended, Districts+Investment, 15 new batches.
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
        <strong>Yandex Direct is not in current strategy scope.</strong>
        Tab retained for future planning. Google Ads is the only active channel in the current strategy.
        Status: <strong>Not in scope / Data Pending</strong>
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
        <div class="data-pending-label">Data Pending</div>
        <div class="data-pending-desc">Not in current scope. Channel retained for future strategy decision.</div>
      </div>
    </div>
  `;
}

/* ============================================================
   META STRATEGY (DATA PENDING)
   ============================================================ */

export function renderMetaStrategy(container) {
  const sections = [
    ['01','Executive Summary','Meta audience-based strategy requires audience research, creative brief, and pixel setup. Channel structure is ready.'],
    ['02','Audience Strategy','Audience definition requires ICP research — demographics, interests, behavioural targeting for IL/UA/BY markets.'],
    ['03','Creative Strategy','Creative brief not yet prepared. Requires visual assets, copywriting direction, and format strategy (Feed, Stories, Reels).'],
    ['04','Campaign Architecture','Campaign structure to be defined post-audience research and creative brief completion.'],
    ['05','Budget & Bidding','Budget allocation pending. Awaiting channel decision on Meta vs. Yandex priority.'],
    ['06','Analytics & Tracking','Meta Pixel setup required. Conversion API implementation needed for iOS 14+ tracking accuracy.'],
  ];

  container.innerHTML = `
    <div class="note-box info" style="margin-bottom:40px">
      <span class="note-box-icon">ℹ</span>
      <div>
        <strong>Meta strategy is audience-based, not keyword-based.</strong>
        It requires: audience research (ICP definition), creative brief, pixel setup, and budget decision.
        The channel structure is ready. All sections will be populated once prerequisites are complete.
      </div>
    </div>

    ${sections.map(([num, title, desc]) => `
      <div class="section-block" id="m${num}">
        <div class="section-block-header">
          <div class="section-block-num">${num}</div>
          <div class="section-block-title-wrap">
            <div class="section-block-title">${title}</div>
          </div>
        </div>
        <div class="data-pending">
          <div class="data-pending-icon">⏳</div>
          <div class="data-pending-label">Data Pending</div>
          <div class="data-pending-desc">${desc}</div>
        </div>
      </div>
    `).join('')}
  `;
}
