/* ============================================================
   ELYSIUM TBILISI — Marketing Intelligence Hub
   analytics.js — Analytics Section Renderer
   ============================================================ */

/* ============================================================
   MAIN ANALYTICS RENDERER
   ============================================================ */

export function renderAnalytics(container, activeChannel) {
  const channels = ['META', 'GOOGLE', 'YANDEX', 'TOTAL'];
  const labels = { META: 'Meta', GOOGLE: 'Google Ads', YANDEX: 'Yandex Direct', TOTAL: 'Total' };

  container.innerHTML = `
    <div style="margin-bottom:40px">
      <div class="eyebrow">Analytics</div>
      <div class="page-title">Performance Dashboard</div>
      <div class="page-subtitle">Connect channels to populate data · All metrics appear here once tracking is live</div>
    </div>

    <div id="analytics-content">
      ${activeChannel === 'META'    ? renderMetaAnalytics()    : ''}
      ${activeChannel === 'GOOGLE' ? renderGoogleAnalytics()  : ''}
      ${activeChannel === 'YANDEX' ? renderYandexAnalytics()  : ''}
      ${activeChannel === 'TOTAL'  ? renderTotalView()         : ''}
    </div>
  `;
}

/* ============================================================
   CHANNEL ANALYTICS SHELLS
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

function renderGoogleAnalytics() {
  return channelAnalyticsShell('Google Ads', 'GOOGLE', [
    { label: 'Impressions', note: 'search' },
    { label: 'Clicks',      note: 'to landing page' },
    { label: 'CTR',         note: 'click-through rate' },
    { label: 'Avg CPC',     note: 'cost per click' },
    { label: 'Spend',       note: 'USD total' },
    { label: 'Leads',       note: 'form + phone + WA' },
    { label: 'CPL',         note: 'cost per lead' },
    { label: 'CPQL',        note: 'cost per qual. lead' },
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
    GOOGLE: 'Connect Google Ads → link GA4 → enable auto-tagging → import conversions from GA4',
    YANDEX: 'Connect Yandex Direct → link Yandex Metrica → enable conversion tracking',
  };

  return `
    <div class="analytics-header">
      <div>
        <div class="eyebrow" style="margin-bottom:6px">${channelName}</div>
        <div style="font-size:14px;color:var(--text-secondary)">No data connected yet</div>
      </div>
      <div class="date-range-picker">
        📅 Date range: Last 30 days (inactive)
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
        This view shows consolidated data across all active channels.
        Numbers will populate once at least one channel is connected and tracking conversions.
        Blended metrics eliminate double-counting of cross-channel touchpoints.
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
      <div class="channel-breakdown-card">
        <div class="channel-breakdown-name">Meta</div>
        <div class="channel-breakdown-value">—</div>
        <div class="channel-breakdown-sub">spend · leads · CPL</div>
      </div>
      <div class="channel-breakdown-card">
        <div class="channel-breakdown-name">Google Ads</div>
        <div class="channel-breakdown-value">—</div>
        <div class="channel-breakdown-sub">spend · leads · CPL</div>
      </div>
      <div class="channel-breakdown-card">
        <div class="channel-breakdown-name">Yandex Direct</div>
        <div class="channel-breakdown-value">—</div>
        <div class="channel-breakdown-sub">spend · leads · CPL</div>
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
