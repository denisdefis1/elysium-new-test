/* ============================================================
   ELYSIUM TBILISI — Marketing Intelligence Hub
   ui.js — Reusable UI Components (tables, filters, pagination)
   ============================================================ */

/* ---- Pool badge helper ---- */
export function poolBadge(pool) {
  return `<span class="badge badge-pool-${pool}">${pool}</span>`;
}

/* ---- Status badge ---- */
export function statusBadge(status) {
  if (!status) return '';
  if (status === 'KEEP')           return `<span class="badge badge-keep">KEEP</span>`;
  if (status === 'CHECK_REQUIRED') return `<span class="badge badge-check">CHECK</span>`;
  if (status.startsWith('EXCL'))   return `<span class="badge badge-excluded">EXCL</span>`;
  return `<span class="badge">${status}</span>`;
}

/* ---- Lang badge ---- */
export function langBadge(lang) {
  return `<span class="badge badge-lang badge-lang-${lang}">${lang}</span>`;
}

/* ---- Volume cell class ---- */
export function volClass(vol) {
  if (vol >= 1000) return 'vol-high';
  if (vol >= 100)  return 'vol-med';
  if (vol >= 10)   return 'vol-low';
  return 'vol-zero';
}

/* ---- CI class ---- */
export function ciClass(ci) {
  if (ci >= 60) return 'ci-high';
  if (ci >= 30) return 'ci-med';
  return 'ci-low';
}

/* ---- Format volume ---- */
export function fmtVol(vol) {
  if (!vol || vol === 0) return '—';
  if (vol >= 1000) return (vol / 1000).toFixed(1) + 'K';
  return vol.toString();
}

/* ---- Format CPC ---- */
export function fmtCpc(cpc) {
  if (!cpc || cpc === 0) return '—';
  return '$' + cpc.toFixed(2);
}

/* ============================================================
   SORTABLE TABLE
   ============================================================ */

export function buildKeywordTable(container, data) {
  let filtered  = [...data];
  let sortKey   = 'volume';
  let sortDir   = -1; // -1 = desc
  let page      = 1;
  const perPage = 50;

  let poolFilter = 'All';
  let langFilter = 'All';
  let statusFilter = 'KEEP';

  function getFiltered() {
    return data.filter(kw => {
      if (poolFilter !== 'All' && kw.pool !== poolFilter) return false;
      if (langFilter !== 'All' && kw.language !== langFilter) return false;
      if (statusFilter !== 'All' && kw.status !== statusFilter) return false;
      return true;
    });
  }

  function getSorted(arr) {
    return [...arr].sort((a, b) => {
      const av = a[sortKey] ?? 0;
      const bv = b[sortKey] ?? 0;
      if (typeof av === 'string') return sortDir * av.localeCompare(bv);
      return sortDir * (av - bv);
    });
  }

  function render() {
    filtered = getSorted(getFiltered());
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    if (page > totalPages) page = totalPages;
    const pageData = filtered.slice((page - 1) * perPage, page * perPage);

    // Pool counts for filter buttons
    const pools = ['A','B','C','D','E','F','G','H','I','J'];
    const poolCounts = {};
    pools.forEach(p => {
      poolCounts[p] = data.filter(k => k.pool === p && (langFilter === 'All' || k.language === langFilter) && (statusFilter === 'All' || k.status === statusFilter)).length;
    });

    container.innerHTML = `
      <div class="filter-bar">
        <span class="filter-label">Pool</span>
        <div class="filter-group" id="pool-filters">
          <button class="filter-btn ${poolFilter === 'All' ? 'active' : ''}" data-pool="All">All</button>
          ${pools.map(p => `<button class="filter-btn ${poolFilter === p ? 'active' : ''}" data-pool="${p}">${p}</button>`).join('')}
        </div>
        <div class="filter-separator"></div>
        <span class="filter-label">Lang</span>
        <div class="filter-group" id="lang-filters">
          <button class="filter-btn ${langFilter === 'All' ? 'active' : ''}" data-lang="All">All</button>
          <button class="filter-btn ${langFilter === 'RU' ? 'active' : ''}" data-lang="RU">RU</button>
          <button class="filter-btn ${langFilter === 'EN' ? 'active' : ''}" data-lang="EN">EN</button>
        </div>
        <div class="filter-separator"></div>
        <span class="filter-label">Status</span>
        <div class="filter-group" id="status-filters">
          <button class="filter-btn ${statusFilter === 'All' ? 'active' : ''}" data-status="All">All</button>
          <button class="filter-btn ${statusFilter === 'KEEP' ? 'active' : ''}" data-status="KEEP">KEEP</button>
          <button class="filter-btn ${statusFilter === 'CHECK_REQUIRED' ? 'active' : ''}" data-status="CHECK_REQUIRED">CHECK</button>
        </div>
        <span class="filter-count">${total.toLocaleString()} keywords</span>
      </div>

      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              ${th('keyword', 'Keyword', sortKey, sortDir)}
              ${th('language', 'Lang', sortKey, sortDir)}
              ${th('volume', 'Volume', sortKey, sortDir)}
              ${th('competition_index', 'CI', sortKey, sortDir)}
              ${th('cpc', 'CPC', sortKey, sortDir)}
              ${th('pool', 'Pool', sortKey, sortDir)}
              ${th('tier', 'Tier', sortKey, sortDir)}
              ${th('status', 'Status', sortKey, sortDir)}
            </tr>
          </thead>
          <tbody>
            ${pageData.map(kw => `
              <tr>
                <td class="keyword-col">${escHtml(kw.keyword)}</td>
                <td>${langBadge(kw.language)}</td>
                <td class="td-num ${volClass(kw.volume)}">${fmtVol(kw.volume)}</td>
                <td class="td-num ${ciClass(kw.competition_index)}">${kw.competition_index ?? '—'}</td>
                <td class="td-num">${fmtCpc(kw.cpc)}</td>
                <td>${poolBadge(kw.pool)}</td>
                <td class="td-num mono">${kw.tier ?? '—'}</td>
                <td>${statusBadge(kw.status)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="table-stats">
          <div class="table-stat"><span class="table-stat-label">Showing</span><span class="table-stat-val">${(page-1)*perPage+1}–${Math.min(page*perPage, total)} of ${total}</span></div>
          <div class="table-stat"><span class="table-stat-label">Avg CPC</span><span class="table-stat-val">${avgCpc(filtered)}</span></div>
          <div class="table-stat"><span class="table-stat-label">Avg Volume</span><span class="table-stat-val">${avgVol(filtered)}</span></div>
        </div>

        <div class="pagination">
          <span class="pagination-info">Page ${page} of ${totalPages}</span>
          <div class="pagination-controls">
            <button class="page-btn" id="prev-btn" ${page <= 1 ? 'disabled' : ''}>← Prev</button>
            ${pageButtons(page, totalPages)}
            <button class="page-btn" id="next-btn" ${page >= totalPages ? 'disabled' : ''}>Next →</button>
          </div>
        </div>
      </div>
    `;

    // Attach events
    container.querySelectorAll('[data-pool]').forEach(btn => {
      btn.addEventListener('click', () => { poolFilter = btn.dataset.pool; page = 1; render(); });
    });
    container.querySelectorAll('[data-lang]').forEach(btn => {
      btn.addEventListener('click', () => { langFilter = btn.dataset.lang; page = 1; render(); });
    });
    container.querySelectorAll('[data-status]').forEach(btn => {
      btn.addEventListener('click', () => { statusFilter = btn.dataset.status; page = 1; render(); });
    });
    container.querySelectorAll('th[data-sort]').forEach(th => {
      th.addEventListener('click', () => {
        const key = th.dataset.sort;
        if (sortKey === key) sortDir *= -1;
        else { sortKey = key; sortDir = -1; }
        page = 1;
        render();
      });
    });
    const prevBtn = container.querySelector('#prev-btn');
    const nextBtn = container.querySelector('#next-btn');
    if (prevBtn) prevBtn.addEventListener('click', () => { if (page > 1) { page--; render(); } });
    if (nextBtn) nextBtn.addEventListener('click', () => { if (page < totalPages) { page++; render(); } });
    container.querySelectorAll('.page-num-btn').forEach(btn => {
      btn.addEventListener('click', () => { page = parseInt(btn.dataset.page); render(); });
    });
  }

  render();
}

function th(key, label, sortKey, sortDir) {
  const sorted = sortKey === key;
  const icon = sorted ? (sortDir === -1 ? '↓' : '↑') : '↕';
  return `<th data-sort="${key}" class="${sorted ? 'sorted' : ''}">
    ${label}<span class="th-sort-icon">${icon}</span>
  </th>`;
}

function pageButtons(current, total) {
  if (total <= 7) {
    return Array.from({length: total}, (_,i) => `
      <button class="page-btn page-num-btn ${i+1 === current ? 'active' : ''}" data-page="${i+1}">${i+1}</button>
    `).join('');
  }
  // Show first, last, and pages around current
  const pages = new Set([1, 2, current-1, current, current+1, total-1, total].filter(p => p >= 1 && p <= total));
  const sorted = [...pages].sort((a,b) => a-b);
  let html = '';
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i-1] > 1) html += `<span style="color:var(--text-tertiary);padding:0 4px">…</span>`;
    html += `<button class="page-btn page-num-btn ${p === current ? 'active' : ''}" data-page="${p}">${p}</button>`;
  });
  return html;
}

function avgCpc(arr) {
  const valid = arr.filter(k => k.cpc > 0);
  if (!valid.length) return '—';
  const avg = valid.reduce((s,k) => s + k.cpc, 0) / valid.length;
  return '$' + avg.toFixed(2);
}

function avgVol(arr) {
  const valid = arr.filter(k => k.volume > 0);
  if (!valid.length) return '—';
  const avg = valid.reduce((s,k) => s + k.volume, 0) / valid.length;
  return Math.round(avg).toLocaleString();
}

export function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
