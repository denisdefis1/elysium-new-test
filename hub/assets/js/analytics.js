/* ============================================================
   ELYSIUM TBILISI — Marketing Intelligence Hub
   analytics.js — Analytics Section Renderer
   ============================================================ */

/* ============================================================
   MAIN ANALYTICS RENDERER
   ============================================================ */

export function renderAnalytics(container, activeChannel) {
  container.innerHTML = `
    <div style="margin-bottom:40px">
      <div class="eyebrow">Analytics</div>
      <div class="page-title">Performance Dashboard</div>
      <div class="page-subtitle">Live data from ad accounts · Refreshed daily via GitHub Actions</div>
    </div>

    <div id="analytics-content">
      ${activeChannel === 'META'    ? renderMetaAnalytics()    : ''}
      ${activeChannel === 'GOOGLE'  ? renderGoogleAnalytics()  : ''}
      ${activeChannel === 'YANDEX' ? renderYandexAnalytics()  : ''}
      ${activeChannel === 'TOTAL'  ? renderTotalView()         : ''}
    </div>
  `;
}

/* ============================================================
   GOOGLE ADS ANALYTICS — LIVE DATA
   ============================================================ */

function renderGoogleAnalytics() {
  const raw = window.__ELYSIUM_DATA__?.ads_metrics;
  if (!raw) return renderGoogleFallback('Data bundle not loaded.');

  const acct = raw.account || {};
  const totals = raw.totals || {};
  const campaigns = raw.campaigns || [];
  const period = raw.period || {};
  const fetchedAt = raw.fetched_at || '—';
  const hasCampaigns = campaigns.length > 0 && !campaigns[0]?.fetch_error;

  const fmt = v => (v == null || v === 0) ? '—' : v.toLocaleString();
  const fmtUsd = v => (v == null || v === 0) ? '—' : '$' + v.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2});
  const fmtPct = v => (v == null || v === 0) ? '—' : v.toFixed(2) + '%';

  // Account status block
  const statusBlock = `
    <div style="display:flex;align-items:center;gap:16px;padding:16px 20px;background:rgba(116,185,116,0.07);border:1px solid rgba(116,185,116,0.25);border-radius:10px;margin-bottom:28px">
      <div style="width:10px;height:10px;border-radius:50%;background:#74B974;flex-shrink:0;box-shadow:0 0 6px rgba(116,185,116,0.6)"></div>
      <div style="flex:1">
        <div style="font-size:13px;font-weight:600;color:var(--text-primary)">Google Ads — Connected</div>
        <div style="font-size:12px;color:var(--text-secondary);margin-top:2px">
          Account: <span style="font-family:var(--font-mono);color:var(--text-primary)">${acct.id || '—'}</span>
          &nbsp;·&nbsp; ${acct.name || '—'}
          &nbsp;·&nbsp; ${acct.currency || 'USD'}
          &nbsp;·&nbsp; ${acct.timezone || '—'}
        </div>
      </div>
      <div style="font-size:11px;color:var(--text-tertiary);text-align:right;flex-shrink:0">
        Updated: ${fetchedAt}<br>
        <span style="color:var(--text-tertiary)">Daily refresh via CI</span>
      </div>
    </div>
  `;

  // Period + campaign count
  const periodBlock = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">
      <div style="font-size:13px;color:var(--text-secondary)">
        Period: <span style="color:var(--text-primary);font-family:var(--font-mono)">${period.date_from || '—'}</span>
        &nbsp;→&nbsp;
        <span style="color:var(--text-primary);font-family:var(--font-mono)">${period.date_to || '—'}</span>
        &nbsp;(6 months)
      </div>
      <div style="font-size:12px;padding:4px 10px;border-radius:5px;${hasCampaigns ? 'background:rgba(116,185,116,0.1);color:#74B974' : 'background:rgba(255,160,0,0.1);color:#FFA000'}">
        ${hasCampaigns ? campaigns.length + ' campaign' + (campaigns.length>1?'s':'') + ' active' : 'No campaigns launched yet'}
      </div>
    </div>
  `;

  // KPI metrics
  const metricsBlock = `
    <div class="analytics-metrics" style="margin-bottom:32px">
      ${[
        {label:'Impressions', value:fmt(totals.impressions), note:'search impressions'},
        {label:'Clicks',      value:fmt(totals.clicks),      note:'to landing page'},
        {label:'CTR',         value:fmtPct(totals.ctr_pct),  note:'click-through rate'},
        {label:'Avg CPC',     value:fmtUsd(null),            note:'cost per click'},
        {label:'Spend',       value:fmtUsd(totals.cost_usd), note:'USD total'},
        {label:'Leads',       value:'—',                     note:'form + phone + WA'},
        {label:'CPL',         value:fmtUsd(totals.cpl_usd),  note:'cost per lead'},
        {label:'CPQL',        value:'—',                     note:'cost per qual. lead'},
      ].map(m => `
        <div class="analytics-metric">
          <div class="analytics-metric-label">${m.label}</div>
          <div class="analytics-metric-value">${m.value}</div>
          <div class="analytics-metric-note">${m.note}</div>
        </div>
      `).join('')}
    </div>
  `;

  // Campaign breakdown table (if any)
  const campaignTable = hasCampaigns ? `
    <div class="card" style="margin-bottom:28px">
      <div style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-tertiary);margin-bottom:14px">Campaign Breakdown</div>
      <table style="width:100%;border-collapse:collapse;font-size:12px">
        <thead>
          <tr style="border-bottom:1px solid var(--border-subtle)">
            ${['Campaign','Status','Impressions','Clicks','CTR','Avg CPC','Spend','Conv.','CPL'].map(h=>`<th style="text-align:left;padding:6px 10px;color:var(--text-tertiary);font-weight:500">${h}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${campaigns.map(c => `
            <tr style="border-bottom:1px solid var(--border-subtle)">
              <td style="padding:7px 10px;color:var(--text-primary)">${c.name}</td>
              <td style="padding:7px 10px"><span style="font-size:11px;padding:2px 7px;border-radius:4px;background:${c.status==='ENABLED'?'rgba(116,185,116,0.15)':'rgba(255,160,0,0.12)'};color:${c.status==='ENABLED'?'#74B974':'#FFA000'}">${c.status}</span></td>
              <td style="padding:7px 10px;font-family:var(--font-mono)">${fmt(c.impressions)}</td>
              <td style="padding:7px 10px;font-family:var(--font-mono)">${fmt(c.clicks)}</td>
              <td style="padding:7px 10px;font-family:var(--font-mono)">${fmtPct(c.ctr_pct)}</td>
              <td style="padding:7px 10px;font-family:var(--font-mono)">${fmtUsd(c.avg_cpc_usd)}</td>
              <td style="padding:7px 10px;font-family:var(--font-mono);color:var(--accent-gold)">${fmtUsd(c.cost_usd)}</td>
              <td style="padding:7px 10px;font-family:var(--font-mono)">${c.conversions || '—'}</td>
              <td style="padding:7px 10px;font-family:var(--font-mono)">${fmtUsd(c.cpl_usd)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  ` : `
    <div class="note-box warning" style="margin-bottom:28px">
      <span class="note-box-icon">⚠</span>
      <div>
        <strong>Campaigns not launched yet.</strong>
        The Google Ads account is connected and verified. Metrics will appear here automatically once campaigns are activated.
        All 4 campaigns (К1–К4) are fully configured in the Strategy section and ready to launch.
      </div>
    </div>
  `;

  // Chart placeholders
  const chartsBlock = `
    <div class="chart-placeholder" style="margin-bottom:16px">
      <div style="font-size:32px;opacity:0.15">📊</div>
      <div class="chart-placeholder-text">${hasCampaigns ? 'Impressions & Clicks — Loading chart' : 'Impressions & Clicks — No data yet'}</div>
    </div>
    <div class="two-col">
      <div class="chart-placeholder">
        <div style="font-size:28px;opacity:0.15">📈</div>
        <div class="chart-placeholder-text">${hasCampaigns ? 'CPL Over Time — Loading chart' : 'CPL Over Time — No data yet'}</div>
      </div>
      <div class="chart-placeholder">
        <div style="font-size:28px;opacity:0.15">🎯</div>
        <div class="chart-placeholder-text">${hasCampaigns ? 'Conversion Funnel — Loading chart' : 'Conversion Funnel — No data yet'}</div>
      </div>
    </div>
  `;

  // Pipeline info
  const pipelineBlock = `
    <div class="card" style="margin-top:24px;border-color:rgba(74,106,140,0.2)">
      <div class="card-title" style="color:var(--data-blue);margin-bottom:10px">Data Pipeline</div>
      <div style="font-size:12px;color:var(--text-secondary);line-height:1.8">
        <div>📡 <strong>Source:</strong> Google Ads API (account ${acct.id || '3341934882'})</div>
        <div>🔄 <strong>Refresh:</strong> Daily at 10:00 Tbilisi time via GitHub Actions</div>
        <div>📁 <strong>Storage:</strong> <span style="font-family:var(--font-mono)">hub/data/google/ads_metrics.json</span> → data-bundle.js</div>
        <div>⚙️ <strong>Script:</strong> <span style="font-family:var(--font-mono)">scripts/fetch_ads_metrics.py</span></div>
      </div>
    </div>
  `;

  return `
    <div class="analytics-header" style="margin-bottom:0">
      <div>
        <div class="eyebrow" style="margin-bottom:6px">Google Ads</div>
        <div style="font-size:14px;color:var(--text-secondary)">6-month performance · Last 180 days</div>
      </div>
    </div>
    ${statusBlock}
    ${periodBlock}
    ${metricsBlock}
    ${campaignTable}
    ${chartsBlock}
    ${pipelineBlock}
  `;
}

function renderGoogleFallback(msg) {
  return `
    <div class="note-box warning">
      <span class="note-box-icon">⚠</span>
      <div><strong>Google Ads data unavailable.</strong> ${msg}</div>
    </div>
  `;
}

/* ============================================================
   META ANALYTICS SHELL
   ============================================================ */

function renderMetaAnalytics() {
  return channelAnalyticsShell('Meta', 'META', [
    { label: 'Impressions', note: 'Meta Ads Manager' },
    { label: 'Reach',       note: 'unique accounts' },
    { label: 'Clicks',      note: 'link clicks' },
    { label: 'CTR',         note: '% link click rate' },
    { label: 'Spend',       note: 'USD' },
    { label: 'Leads',       note: 'form + DM + WA' },
    { label: 'CPL',         note: 'cost per lead' },
    { label: 'CPQL',        note: 'cost per qualified lead' },
  ]);
}

function renderYandexAnalytics() {
  return channelAnalyticsShell('Yandex Direct', 'YANDEX', [
    { label: 'Impressions', note: 'Yandex Direct' },
    { label: 'Clicks',      note: 'to landing page' },
    { label: 'CTR',         note: 'click-through rate' },
    { label: 'Avg CPC',     note: 'cost per click' },
    { label: 'Spend',       note: 'USD / RUB' },
    { label: 'Leads',       note: 'form + phone + WA' },
    { label: 'CPL',         note: 'cost per lead' },
    { label: 'CPQL',        note: 'cost per qual. lead' },
  ]);
}

function channelAnalyticsShell(channelName, channelKey, metrics) {
  const connectInstructions = {
    META:   'Connect Meta Ads Manager → create Business Manager → link ad account → generate access token',
    YANDEX: 'Connect Yandex Direct → link Yandex Metrica → enable conversion tracking',
  };

  return `
    <div class="analytics-header">
      <div>
        <div class="eyebrow" style="margin-bottom:6px">${channelName}</div>
        <div style="font-size:14px;color:var(--text-secondary)">No data connected yet</div>
      </div>
    </div>

    <div class="note-box warning" style="margin-bottom:28px">
      <span class="note-box-icon">⚠</span>
      <div>
        <strong>Not connected.</strong> ${connectInstructions[channelKey] || 'Connect channel to see data.'}
      </div>
    </div>

    <div class="analytics-metrics">
      ${metrics.map(m => `
        <div class="analytics-metric">
          <div class="analytics-metric-label">${m.label}</div>
          <div class="analytics-metric-value">—</div>
          <div class="analytics-metric-note">${m.note}</div>
        </div>
      `).join('')}
    </div>

    <div class="chart-placeholder" style="margin-bottom:16px">
      <div style="font-size:32px;opacity:0.15">📊</div>
      <div class="chart-placeholder-text">Impressions & Clicks — No data</div>
    </div>

    <div class="two-col">
      <div class="chart-placeholder">
        <div style="font-size:28px;opacity:0.15">📈</div>
        <div class="chart-placeholder-text">CPL Over Time — No data</div>
      </div>
      <div class="chart-placeholder">
        <div style="font-size:28px;opacity:0.15">🎯</div>
        <div class="chart-placeholder-text">Conversion Funnel — No data</div>
      </div>
    </div>
  `;
}

/* ============================================================
   TOTAL MANAGEMENT VIEW
   ============================================================ */

function renderTotalView() {
  return `
    <div class="total-title-block">
      <div class="total-eyebrow">Management View · All Channels Combined</div>
      <div class="total-headline">Total Performance</div>
    </div>

    <div class="note-box info" style="margin-bottom:36px">
      <span class="note-box-icon">ℹ</span>
      <div>
        Google Ads account connected. Campaigns not launched yet — metrics will populate automatically once live.
        Meta and Yandex channels require separate connection.
      </div>
    </div>

    <div class="total-metrics">
      <div class="total-metric">
        <div class="total-metric-label">Total Spend</div>
        <div class="total-metric-value">—</div>
        <div class="total-metric-sub">USD · all channels</div>
      </div>
      <div class="total-metric">
        <div class="total-metric-label">Total Leads</div>
        <div class="total-metric-value">—</div>
        <div class="total-metric-sub">form + phone + messenger</div>
      </div>
      <div class="total-metric">
        <div class="total-metric-label">Blended CPL</div>
        <div class="total-metric-value">—</div>
        <div class="total-metric-sub">cost per lead · all channels</div>
      </div>
      <div class="total-metric">
        <div class="total-metric-label">Qualified Leads</div>
        <div class="total-metric-value">—</div>
        <div class="total-metric-sub">approved by sales team</div>
      </div>
      <div class="total-metric">
        <div class="total-metric-label">Blended CPQL</div>
        <div class="total-metric-value">—</div>
        <div class="total-metric-sub">cost per qualified lead</div>
      </div>
      <div class="total-metric">
        <div class="total-metric-label">Viewings Booked</div>
        <div class="total-metric-value">—</div>
        <div class="total-metric-sub">from all channels</div>
      </div>
    </div>

    <div class="card-title" style="margin-bottom:16px">Channel Breakdown</div>
    <div class="channel-breakdown-grid">
      <div class="channel-breakdown-card" style="border-color:rgba(116,185,116,0.25)">
        <div class="channel-breakdown-name">Google Ads</div>
        <div class="channel-breakdown-value" style="font-size:12px;color:#74B974">✅ Connected</div>
        <div class="channel-breakdown-sub">Campaigns pending launch</div>
      </div>
      <div class="channel-breakdown-card">
        <div class="channel-breakdown-name">Meta</div>
        <div class="channel-breakdown-value">—</div>
        <div class="channel-breakdown-sub">Not connected</div>
      </div>
      <div class="channel-breakdown-card">
        <div class="channel-breakdown-name">Yandex Direct</div>
        <div class="channel-breakdown-value">—</div>
        <div class="channel-breakdown-sub">Not connected</div>
      </div>
      <div class="channel-breakdown-card">
        <div class="channel-breakdown-name">Organic / Direct</div>
        <div class="channel-breakdown-value">—</div>
        <div class="channel-breakdown-sub">non-paid attribution</div>
      </div>
    </div>

    <div class="chart-placeholder" style="height:200px">
      <div style="font-size:32px;opacity:0.15">🥧</div>
      <div class="chart-placeholder-text">Channel Mix — No data</div>
    </div>
  `;
}
