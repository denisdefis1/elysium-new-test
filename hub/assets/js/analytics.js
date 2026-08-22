/* ============================================================
   ELYSIUM — analytics.js
   ============================================================ */

/* ---- module state (persists between period switches) ---- */
const _g = { period: 30, sortCol: 'cost_usd', sortDir: 'desc' };

/* ============================================================
   PUBLIC ENTRY POINT
   ============================================================ */
export function renderAnalytics(container, activeChannel) {
  container.innerHTML =
    '<div style="margin-bottom:40px">' +
      '<div class="eyebrow">Analytics</div>' +
      '<div class="page-title">Performance Dashboard</div>' +
      '<div class="page-subtitle">Данные из рекламного кабинета · Обновляется ежедневно</div>' +
    '</div>' +
    '<div id="analytics-ch">' +
      (activeChannel === 'GOOGLE' ? '<div id="g-dash"></div>'   : '') +
      (activeChannel === 'META'   ? _metaShell()                : '') +
      (activeChannel === 'YANDEX' ? _yandexShell()              : '') +
      (activeChannel === 'TOTAL'  ? _totalView()                : '') +
    '</div>';

  if (activeChannel === 'GOOGLE') {
    requestAnimationFrame(function() { _paintGoogle(document.getElementById('g-dash')); });
  }
}

/* ============================================================
   GOOGLE ADS DASHBOARD
   ============================================================ */
function _paintGoogle(el) {
  if (!el) return;

  var raw    = (window.__ELYSIUM_DATA__ || {}).ads_metrics || {};
  var acct   = raw.account   || {};
  var daily  = raw.daily     || [];
  var fetchedAt = raw.fetched_at || '—';

  var agg = _aggregate(daily, _g.period);
  var chartDays = _chartData(daily, _g.period);

  el.innerHTML = _googleHTML(acct, fetchedAt, agg, chartDays);
  _bindGoogle(el, daily, acct, fetchedAt);
}

/* ---- aggregate daily[] into period totals + per-campaign rows ---- */
function _aggregate(daily, days) {
  var cutoff = _cutoff(days);
  var campMap = {};

  daily.forEach(function(day) {
    if (day.date < cutoff) return;
    (day.campaigns || []).forEach(function(c) {
      if (!campMap[c.id]) {
        campMap[c.id] = {
          id: c.id, name: c.name, status: c.status,
          impressions: 0, clicks: 0, cost_usd: 0, conversions: 0
        };
      }
      var r = campMap[c.id];
      r.impressions  += c.impressions  || 0;
      r.clicks       += c.clicks       || 0;
      r.cost_usd     += c.cost_usd     || 0;
      r.conversions  += c.conversions  || 0;
    });
  });

  var rows = Object.values(campMap).map(function(r) {
    return {
      id:          r.id,
      name:        r.name,
      status:      r.status,
      impressions: r.impressions,
      clicks:      r.clicks,
      cost_usd:    _r2(r.cost_usd),
      conversions: _r2(r.conversions),
      ctr_pct:     r.impressions > 0 ? _r2(r.clicks / r.impressions * 100) : 0,
      avg_cpc_usd: r.clicks > 0      ? _r2(r.cost_usd / r.clicks)          : 0,
      cpl_usd:     r.conversions > 0 ? _r2(r.cost_usd / r.conversions)     : null,
    };
  });

  /* sort */
  var sc = _g.sortCol, sd = _g.sortDir;
  rows.sort(function(a, b) {
    var av = a[sc] != null ? a[sc] : -1;
    var bv = b[sc] != null ? b[sc] : -1;
    if (typeof av === 'string') return sd === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    return sd === 'desc' ? bv - av : av - bv;
  });

  /* totals */
  var tot = { impressions:0, clicks:0, cost_usd:0, conversions:0 };
  rows.forEach(function(r) {
    tot.impressions += r.impressions;
    tot.clicks      += r.clicks;
    tot.cost_usd    += r.cost_usd;
    tot.conversions += r.conversions;
  });
  tot.cost_usd    = _r2(tot.cost_usd);
  tot.ctr_pct     = tot.impressions > 0 ? _r2(tot.clicks / tot.impressions * 100) : 0;
  tot.avg_cpc_usd = tot.clicks > 0      ? _r2(tot.cost_usd / tot.clicks)          : 0;
  tot.cpl_usd     = tot.conversions > 0 ? _r2(tot.cost_usd / tot.conversions)     : null;

  return { rows: rows, totals: tot };
}

function _chartData(daily, days) {
  var cutoff = _cutoff(days);
  return daily
    .filter(function(d) { return d.date >= cutoff; })
    .sort(function(a, b) { return a.date.localeCompare(b.date); })
    .map(function(d) {
      var cost = (d.campaigns || []).reduce(function(s,c){ return s + (c.cost_usd||0); }, 0);
      var imp  = (d.campaigns || []).reduce(function(s,c){ return s + (c.impressions||0); }, 0);
      return { date: d.date, cost: _r2(cost), impressions: imp };
    });
}

/* ============================================================
   HTML BUILDER
   ============================================================ */
function _googleHTML(acct, fetchedAt, agg, chartDays) {
  var rows    = agg.rows;
  var totals  = agg.totals;
  var hasCamp = rows.length > 0;

  return (
    _accountBar(acct, fetchedAt) +
    _periodBar() +
    _kpiGrid(totals) +
    _spendChart(chartDays) +
    _campTable(rows, totals, hasCamp) +
    _pipelineCard(acct)
  );
}

/* ---- account status bar ---- */
function _accountBar(acct, fetchedAt) {
  return (
    '<div style="display:flex;align-items:center;gap:14px;padding:13px 18px;' +
    'background:rgba(116,185,116,0.07);border:1px solid rgba(116,185,116,0.22);' +
    'border-radius:10px;margin-bottom:22px">' +
      '<div style="width:9px;height:9px;border-radius:50%;background:#74B974;' +
      'flex-shrink:0;box-shadow:0 0 8px rgba(116,185,116,0.65)"></div>' +
      '<div style="flex:1;font-size:12px">' +
        '<span style="color:var(--text-primary);font-weight:600">Google Ads · Подключён</span>' +
        '<span style="color:var(--text-secondary);margin-left:12px">' +
          'ID ' + (acct.id||'—') + ' · ' + (acct.name||'—') +
          ' · ' + (acct.currency||'USD') + ' · ' + (acct.timezone||'—') +
        '</span>' +
      '</div>' +
      '<div style="font-size:11px;color:var(--text-tertiary)">Обновлено: ' + fetchedAt + '</div>' +
    '</div>'
  );
}

/* ---- period tab bar ---- */
function _periodBar() {
  var periods = [
    {days:7,   label:'7 дней'},
    {days:14,  label:'14 дней'},
    {days:30,  label:'30 дней'},
    {days:90,  label:'90 дней'},
    {days:180, label:'6 мес'},
  ];
  var tabs = periods.map(function(p) {
    var active = _g.period === p.days;
    return (
      '<button data-days="' + p.days + '" style="' +
        'padding:5px 13px;border-radius:6px;border:1px solid ' +
        (active ? 'var(--accent-gold)' : 'var(--border-subtle)') + ';' +
        'background:' + (active ? 'rgba(196,168,100,0.12)' : 'transparent') + ';' +
        'color:' + (active ? 'var(--accent-gold)' : 'var(--text-secondary)') + ';' +
        'font-size:12px;cursor:pointer;transition:all 0.15s" class="ptab">' +
        p.label +
      '</button>'
    );
  }).join('');
  return (
    '<div style="display:flex;align-items:center;gap:6px;margin-bottom:22px;flex-wrap:wrap">' +
      '<span style="font-size:11px;color:var(--text-tertiary);letter-spacing:0.06em;' +
      'text-transform:uppercase;margin-right:6px">Период</span>' +
      tabs +
    '</div>'
  );
}

/* ---- 5 KPI cards ---- */
function _kpiGrid(t) {
  var cards = [
    {label:'Показы',   value:_fn(t.impressions),     sub:'search impressions'},
    {label:'Клики',    value:_fn(t.clicks),           sub:'переходы на сайт'},
    {label:'CTR',      value:_fp(t.ctr_pct),          sub:'click-through rate'},
    {label:'Avg CPC',  value:_fd(t.avg_cpc_usd,'$'),  sub:'стоимость клика'},
    {label:'Расход',   value:_fd(t.cost_usd,'$'),     sub:'USD за период'},
  ];
  var html = '<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:26px">';
  cards.forEach(function(c) {
    html += (
      '<div style="background:var(--bg-elevated);border:1px solid var(--border-subtle);' +
      'border-radius:10px;padding:16px 18px">' +
        '<div style="font-size:10px;letter-spacing:0.08em;text-transform:uppercase;' +
        'color:var(--text-tertiary);margin-bottom:8px">' + c.label + '</div>' +
        '<div style="font-size:22px;font-weight:600;color:var(--text-primary);' +
        'font-family:var(--font-mono);line-height:1">' + c.value + '</div>' +
        '<div style="font-size:11px;color:var(--text-tertiary);margin-top:6px">' + c.sub + '</div>' +
      '</div>'
    );
  });
  html += '</div>';
  return html;
}

/* ---- spend bar chart ---- */
function _spendChart(chartDays) {
  var maxCost = Math.max.apply(null, chartDays.map(function(d){ return d.cost; }).concat([0.01]));
  var bars = chartDays.map(function(d) {
    var h = d.cost > 0 ? Math.max(Math.round(d.cost / maxCost * 100), 3) : 0;
    var label = d.date.slice(5); /* MM-DD */
    return (
      '<div title="' + d.date + ': $' + d.cost.toFixed(2) + '" style="' +
        'flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;' +
        'min-width:0;cursor:default">' +
        '<div style="width:100%;height:' + h + '%;' +
          (d.cost > 0
            ? 'background:linear-gradient(180deg,rgba(196,168,100,0.8),rgba(196,168,100,0.3))'
            : 'background:rgba(255,255,255,0.04)') +
          ';border-radius:2px 2px 0 0;transition:opacity 0.1s" ' +
          'onmouseover="this.style.opacity=\'0.7\'" ' +
          'onmouseout="this.style.opacity=\'1\'"></div>' +
      '</div>'
    );
  }).join('');

  var isEmpty = chartDays.every(function(d){ return d.cost === 0; });

  return (
    '<div style="background:var(--bg-elevated);border:1px solid var(--border-subtle);' +
    'border-radius:10px;padding:20px 20px 14px;margin-bottom:22px">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">' +
        '<div style="font-size:11px;letter-spacing:0.08em;text-transform:uppercase;' +
        'color:var(--text-tertiary);font-weight:600">Расход / День (USD)</div>' +
        (isEmpty ? '<div style="font-size:11px;color:var(--text-tertiary)">Нет данных — кампании не запущены</div>' : '') +
      '</div>' +
      '<div style="display:flex;align-items:flex-end;gap:2px;height:80px">' +
        (bars || '<div style="color:var(--text-tertiary);font-size:12px;margin:auto">Нет данных</div>') +
      '</div>' +
    '</div>'
  );
}

/* ---- campaign table ---- */
var COLS = [
  {key:'name',        label:'Кампания',  align:'left',  usd:false, pct:false},
  {key:'status',      label:'Статус',    align:'center',usd:false, pct:false, badge:true},
  {key:'impressions', label:'Показы',    align:'right', usd:false, pct:false},
  {key:'clicks',      label:'Клики',     align:'right', usd:false, pct:false},
  {key:'ctr_pct',     label:'CTR',       align:'right', usd:false, pct:true},
  {key:'avg_cpc_usd', label:'Avg CPC',   align:'right', usd:true,  pct:false},
  {key:'cost_usd',    label:'Расход $',  align:'right', usd:true,  pct:false, gold:true},
];

function _campTable(rows, totals, hasCamp) {
  var thead = '<tr style="border-bottom:1px solid var(--border-medium)">' +
    COLS.map(function(c) {
      var isActive = _g.sortCol === c.key;
      var arrow = isActive ? (_g.sortDir === 'desc' ? ' ↓' : ' ↑') : '';
      return (
        '<th class="sh" data-col="' + c.key + '" style="' +
          'text-align:' + c.align + ';padding:9px 12px;' +
          'font-size:11px;letter-spacing:0.05em;text-transform:uppercase;font-weight:500;' +
          'cursor:pointer;white-space:nowrap;user-select:none;' +
          'color:' + (isActive ? 'var(--text-primary)' : 'var(--text-tertiary)') + '">' +
          c.label + arrow +
        '</th>'
      );
    }).join('') +
  '</tr>';

  var STATUS_COLOR = { ENABLED:'#74B974', PAUSED:'#FFA000', REMOVED:'#888', UNKNOWN:'#666' };

  var tbody = '';
  if (!hasCamp) {
    tbody = (
      '<tr><td colspan="' + COLS.length + '" style="' +
        'padding:48px 20px;text-align:center;color:var(--text-tertiary);font-size:13px">' +
        'Кампании ещё не запущены — данные появятся здесь автоматически после старта' +
      '</td></tr>'
    );
  } else {
    /* data rows */
    rows.forEach(function(r) {
      var sc = STATUS_COLOR[r.status] || '#666';
      var cells = COLS.map(function(c) {
        var v;
        if (c.key === 'name') {
          v = '<span style="color:var(--text-primary);font-weight:500">' + r.name + '</span>';
          return '<td style="padding:9px 12px;text-align:left">' + v + '</td>';
        }
        if (c.badge) {
          v = '<span style="font-size:10px;padding:2px 7px;border-radius:4px;' +
              'background:' + sc + '18;color:' + sc + '">' + (r.status||'—') + '</span>';
          return '<td style="padding:9px 12px;text-align:center">' + v + '</td>';
        }
        if (c.pct) v = _fp(r[c.key]);
        else if (c.usd) v = _fd(r[c.key], '$');
        else v = _fn(r[c.key]);
        return (
          '<td style="padding:9px 12px;text-align:right;font-family:var(--font-mono);font-size:12px;' +
            'color:' + (c.gold ? 'var(--accent-gold)' : 'var(--text-primary)') + '">' +
            v +
          '</td>'
        );
      }).join('');
      tbody += (
        '<tr style="border-bottom:1px solid var(--border-subtle);transition:background 0.12s" ' +
          'onmouseover="this.style.background=\'rgba(255,255,255,0.025)\'" ' +
          'onmouseout="this.style.background=\'\'">' +
          cells +
        '</tr>'
      );
    });

    /* totals row */
    var tcells = COLS.map(function(c) {
      var v;
      if (c.key === 'name') return '<td style="padding:9px 12px;font-weight:700;color:var(--text-primary)">ИТОГО</td>';
      if (c.badge) return '<td></td>';
      if (c.pct) v = _fp(totals[c.key]);
      else if (c.usd) v = _fd(totals[c.key], '$');
      else v = _fn(totals[c.key]);
      return (
        '<td style="padding:9px 12px;text-align:right;font-family:var(--font-mono);font-size:12px;font-weight:700;' +
          'color:' + (c.gold ? 'var(--accent-gold)' : 'var(--text-primary)') + '">' +
          v +
        '</td>'
      );
    }).join('');
    tbody += '<tr style="border-top:1px solid var(--border-medium);background:rgba(255,255,255,0.02)">' + tcells + '</tr>';
  }

  return (
    '<div style="background:var(--bg-elevated);border:1px solid var(--border-subtle);' +
    'border-radius:10px;overflow:hidden;margin-bottom:22px">' +
      '<div style="padding:14px 18px 12px;border-bottom:1px solid var(--border-subtle);' +
      'display:flex;align-items:center;justify-content:space-between">' +
        '<div style="font-size:11px;letter-spacing:0.08em;text-transform:uppercase;' +
        'color:var(--text-tertiary);font-weight:600">Кампании</div>' +
        '<div style="font-size:11px;color:var(--text-tertiary)">' +
          (hasCamp ? rows.length + ' кампани' + (rows.length===1?'я':'и') : 'нет активных') +
        '</div>' +
      '</div>' +
      '<div style="overflow-x:auto">' +
        '<table style="width:100%;border-collapse:collapse;font-size:13px;min-width:760px">' +
          '<thead>' + thead + '</thead>' +
          '<tbody>' + tbody + '</tbody>' +
        '</table>' +
      '</div>' +
    '</div>'
  );
}

/* ---- pipeline info card ---- */
function _pipelineCard(acct) {
  var id = acct.id || '3341934882';
  return (
    '<div style="background:var(--bg-elevated);border:1px solid var(--border-subtle);' +
    'border-radius:10px;padding:16px 18px">' +
      '<div style="font-size:10px;letter-spacing:0.08em;text-transform:uppercase;' +
      'color:var(--text-tertiary);margin-bottom:10px">Источник данных</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:5px 28px;' +
      'font-size:12px;color:var(--text-secondary);line-height:1.8">' +
        '<div>📡 <strong style="color:var(--text-primary)">Google Ads API</strong> · Customer ' + id + '</div>' +
        '<div>🔄 <strong style="color:var(--text-primary)">Обновление</strong> · ежедневно 10:00 Тбилиси</div>' +
        '<div>📁 <strong style="color:var(--text-primary)">Файл</strong> · <span style="font-family:var(--font-mono)">hub/data/google/ads_metrics.json</span></div>' +
        '<div>⚙️ <strong style="color:var(--text-primary)">Скрипт</strong> · <span style="font-family:var(--font-mono)">scripts/fetch_ads_metrics.py</span></div>' +
      '</div>' +
    '</div>'
  );
}

/* ---- event binding ---- */
function _bindGoogle(el, daily, acct, fetchedAt) {
  el.querySelectorAll('.ptab').forEach(function(btn) {
    btn.addEventListener('click', function() {
      _g.period = parseInt(btn.dataset.days, 10);
      _paintGoogle(el);
    });
  });
  el.querySelectorAll('.sh').forEach(function(th) {
    th.addEventListener('click', function() {
      var col = th.dataset.col;
      if (_g.sortCol === col) {
        _g.sortDir = _g.sortDir === 'desc' ? 'asc' : 'desc';
      } else {
        _g.sortCol = col;
        _g.sortDir = 'desc';
      }
      _paintGoogle(el);
    });
  });
}

/* ============================================================
   META / YANDEX / TOTAL SHELLS
   ============================================================ */
function _metaShell() {
  return _shell('Meta', 'META', [
    {label:'Impressions',note:'Meta Ads Manager'},
    {label:'Reach',      note:'unique accounts'},
    {label:'Clicks',     note:'link clicks'},
    {label:'CTR',        note:'% link click rate'},
    {label:'Spend',      note:'USD'},
    {label:'Leads',      note:'form + DM + WA'},
    {label:'CPL',        note:'cost per lead'},
    {label:'CPQL',       note:'cost per qualified lead'},
  ]);
}
function _yandexShell() {
  return _shell('Yandex Direct', 'YANDEX', [
    {label:'Impressions',note:'Yandex Direct'},
    {label:'Clicks',     note:'to landing page'},
    {label:'CTR',        note:'click-through rate'},
    {label:'Avg CPC',    note:'cost per click'},
    {label:'Spend',      note:'USD / RUB'},
    {label:'Leads',      note:'form + phone + WA'},
    {label:'CPL',        note:'cost per lead'},
    {label:'CPQL',       note:'cost per qual. lead'},
  ]);
}
function _shell(name, key, metrics) {
  var HOW = {
    META:   'Connect Meta Ads Manager → Business Manager → link ad account → access token',
    YANDEX: 'Connect Yandex Direct → link Yandex Metrica → enable conversion tracking',
  };
  var cards = metrics.map(function(m) {
    return (
      '<div class="analytics-metric">' +
        '<div class="analytics-metric-label">' + m.label + '</div>' +
        '<div class="analytics-metric-value">—</div>' +
        '<div class="analytics-metric-note">' + m.note + '</div>' +
      '</div>'
    );
  }).join('');
  return (
    '<div class="analytics-header">' +
      '<div><div class="eyebrow" style="margin-bottom:6px">' + name + '</div>' +
      '<div style="font-size:14px;color:var(--text-secondary)">Not connected</div></div>' +
    '</div>' +
    '<div class="note-box warning" style="margin-bottom:28px">' +
      '<span class="note-box-icon">⚠</span>' +
      '<div><strong>Not connected.</strong> ' + (HOW[key]||'Connect channel to see data.') + '</div>' +
    '</div>' +
    '<div class="analytics-metrics">' + cards + '</div>' +
    '<div class="chart-placeholder" style="margin-bottom:16px">' +
      '<div style="font-size:32px;opacity:0.15">📊</div>' +
      '<div class="chart-placeholder-text">No data</div>' +
    '</div>'
  );
}

function _totalView() {
  var cols = ['Meta','Google Ads','Yandex Direct','Organic / Direct'];
  var statuses = ['Not connected','✅ Pending launch','Not connected','—'];
  var breakdown = cols.map(function(n,i) {
    return (
      '<div class="channel-breakdown-card">' +
        '<div class="channel-breakdown-name">' + n + '</div>' +
        '<div class="channel-breakdown-value" style="font-size:12px">' + statuses[i] + '</div>' +
        '<div class="channel-breakdown-sub">spend · leads · CPL</div>' +
      '</div>'
    );
  }).join('');
  var totMetrics = ['Total Spend','Total Leads','Blended CPL','Qualified Leads','Blended CPQL','Viewings Booked'];
  var totCards = totMetrics.map(function(l) {
    return (
      '<div class="total-metric"><div class="total-metric-label">' + l + '</div>' +
      '<div class="total-metric-value">—</div>' +
      '<div class="total-metric-sub">—</div></div>'
    );
  }).join('');
  return (
    '<div class="total-title-block">' +
      '<div class="total-eyebrow">Management View · All Channels Combined</div>' +
      '<div class="total-headline">Total Performance</div>' +
    '</div>' +
    '<div class="note-box info" style="margin-bottom:36px">' +
      '<span class="note-box-icon">ℹ</span>' +
      '<div>Google Ads подключён — кампании ещё не запущены. Meta и Yandex требуют отдельного подключения.</div>' +
    '</div>' +
    '<div class="total-metrics">' + totCards + '</div>' +
    '<div class="card-title" style="margin-bottom:16px">Channel Breakdown</div>' +
    '<div class="channel-breakdown-grid">' + breakdown + '</div>'
  );
}

/* ============================================================
   FORMAT HELPERS
   ============================================================ */
function _r2(v)   { return Math.round(v * 100) / 100; }
function _fn(v)   { return (v == null || v === 0) ? '—' : Number(v).toLocaleString('en-US'); }
function _fp(v)   { return (v == null || v === 0) ? '—' : v.toFixed(2) + '%'; }
function _fd(v,p) {
  if (v == null || v === 0) return '—';
  return (p||'') + Number(v).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2});
}

function _cutoff(days) {
  var d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}
