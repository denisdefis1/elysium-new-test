/* ============================================================
   ELYSIUM TBILISI — Marketing Intelligence Hub
   app.js — Main Controller & Router
   ============================================================ */

import { loadAllGoogleData } from './data.js?v=2';
import { renderGoogleStrategy, renderYandexStrategy, renderMetaStrategy } from './strategy.js?v=2';
import { renderAnalytics } from './analytics.js?v=2';

/* ============================================================
   STATE
   ============================================================ */

const state = {
  area:            'strategy',   // 'strategy' | 'analytics'
  strategyChannel: 'google',     // 'google' | 'yandex' | 'meta'
  analyticsChannel:'GOOGLE',     // 'META' | 'GOOGLE' | 'YANDEX' | 'TOTAL'
  googleData:      null,
  loading:         false,
};

/* ============================================================
   DOM REFERENCES
   ============================================================ */

let headerCenter, headerRight, sidebar, content;

/* ============================================================
   INIT
   ============================================================ */

document.addEventListener('DOMContentLoaded', init);

async function init() {
  headerCenter = document.getElementById('header-center');
  headerRight  = document.getElementById('header-right');
  sidebar      = document.getElementById('sidebar');
  content      = document.getElementById('content');

  // Mobile sidebar overlay
  const overlay = document.getElementById('sidebar-overlay');
  if (overlay) {
    overlay.addEventListener('click', closeSidebar);
  }

  // Mobile toggle
  const toggle = document.getElementById('sidebar-toggle');
  if (toggle) {
    toggle.addEventListener('click', toggleSidebar);
  }

  // Load Google data immediately (used by strategy)
  loadGoogleData();

  // Render initial state
  renderArea();
}

/* ============================================================
   DATA LOADING
   ============================================================ */

async function loadGoogleData() {
  if (state.googleData || state.loading) return;
  state.loading = true;
  try {
    state.googleData = await loadAllGoogleData();
    // If currently on google strategy, re-render with data
    if (state.area === 'strategy' && state.strategyChannel === 'google') {
      renderStrategyContent();
    }
  } catch (err) {
    console.error('[app.js] Data load failed:', err);
  } finally {
    state.loading = false;
  }
}

/* ============================================================
   RENDER — MAIN AREA
   ============================================================ */

function renderArea() {
  updateHeaderNav();
  if (state.area === 'strategy') {
    renderStrategyArea();
  } else {
    renderAnalyticsArea();
  }
}

/* ============================================================
   STRATEGY AREA
   ============================================================ */

function renderStrategyArea() {
  // Header center: channel switcher
  headerCenter.innerHTML = `
    <button class="channel-tab ${state.strategyChannel === 'google' ? 'active' : ''}" data-ch="google">Google Ads</button>
    <button class="channel-tab ${state.strategyChannel === 'yandex' ? 'active' : ''}" data-ch="yandex">Yandex Direct</button>
    <button class="channel-tab ${state.strategyChannel === 'meta'   ? 'active' : ''}" data-ch="meta">Meta</button>
  `;
  headerCenter.querySelectorAll('[data-ch]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.strategyChannel = btn.dataset.ch;
      renderStrategyArea();
    });
  });

  // Show/hide sidebar (only for Google)
  if (state.strategyChannel === 'google') {
    showSidebar();
    content.classList.remove('no-sidebar');
    buildGoogleSidebar();
  } else {
    hideSidebar();
    content.classList.add('no-sidebar');
  }

  renderStrategyContent();
}

function renderStrategyContent() {
  content.innerHTML = '';
  const ch = state.strategyChannel;

  if (ch === 'google') {
    if (state.googleData) {
      renderGoogleStrategy(content, state.googleData);
      initIntersectionObserver();
    } else {
      content.innerHTML = loadingState('Loading Google Ads data...');
      // Will re-render when data arrives
    }
  } else if (ch === 'yandex') {
    renderYandexStrategy(content);
  } else if (ch === 'meta') {
    renderMetaStrategy(content);
  }
}

/* ============================================================
   ANALYTICS AREA
   ============================================================ */

function renderAnalyticsArea() {
  hideSidebar();
  content.classList.add('no-sidebar');

  // Header center: analytics channel tabs
  headerCenter.innerHTML = `
    <button class="channel-tab ${state.analyticsChannel === 'META'    ? 'active' : ''}" data-ach="META">Meta</button>
    <button class="channel-tab ${state.analyticsChannel === 'GOOGLE'  ? 'active' : ''}" data-ach="GOOGLE">Google Ads</button>
    <button class="channel-tab ${state.analyticsChannel === 'YANDEX'  ? 'active' : ''}" data-ach="YANDEX">Yandex Direct</button>
    <button class="channel-tab ${state.analyticsChannel === 'TOTAL'   ? 'active' : ''}" data-ach="TOTAL">Total</button>
  `;
  headerCenter.querySelectorAll('[data-ach]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.analyticsChannel = btn.dataset.ach;
      renderAnalyticsArea();
    });
  });

  renderAnalytics(content, state.analyticsChannel);
}

/* ============================================================
   HEADER NAV
   ============================================================ */

function updateHeaderNav() {
  headerRight.innerHTML = `
    <button class="header-nav-btn ${state.area === 'strategy'  ? 'active' : ''}" data-area="strategy">Strategy</button>
    <button class="header-nav-btn ${state.area === 'analytics' ? 'active' : ''}" data-area="analytics">Analytics</button>
  `;
  headerRight.querySelectorAll('[data-area]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.area = btn.dataset.area;
      renderArea();
    });
  });
}

/* ============================================================
   SIDEBAR
   ============================================================ */

function buildGoogleSidebar() {
  const sections = [
    ['00','Обзор стратегии'],
    ['01','Продукт и позиционирование'],
    ['02','Целевая аудитория'],
    ['03','Поисковая стратегия'],
    ['04','Структура кампаний'],
    ['05','Детали кампаний'],
    ['06','Бюджет и ставки'],
    ['07','Измерение и оптимизация'],
    ['09','Объявления и тексты'],
  ];

  sidebar.innerHTML = `
    <div class="sidebar-label">Google Ads — Разделы</div>
    <nav class="sidebar-nav" id="sidebar-nav">
      ${sections.map(([num, title]) => `
        <a class="sidebar-nav-link" href="#s${num}" data-section="s${num}">
          <span class="sidebar-nav-num">${num}</span>
          <span>${title}</span>
        </a>
      `).join('')}
    </nav>
  `;

  sidebar.querySelectorAll('.sidebar-nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById(link.dataset.section);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Mobile: close sidebar
        if (window.innerWidth <= 1200) closeSidebar();
      }
    });
  });
}

function showSidebar() {
  if (sidebar) {
    sidebar.classList.remove('hidden');
  }
}

function hideSidebar() {
  if (sidebar) {
    sidebar.classList.add('hidden');
    sidebar.classList.remove('open');
  }
  const overlay = document.getElementById('sidebar-overlay');
  if (overlay) overlay.classList.remove('active');
}

function toggleSidebar() {
  if (!sidebar) return;
  const isOpen = sidebar.classList.contains('open');
  if (isOpen) {
    closeSidebar();
  } else {
    sidebar.classList.add('open');
    sidebar.classList.remove('hidden');
    const overlay = document.getElementById('sidebar-overlay');
    if (overlay) overlay.classList.add('active');
  }
}

function closeSidebar() {
  if (!sidebar) return;
  sidebar.classList.remove('open');
  if (state.area === 'analytics' || state.strategyChannel !== 'google') {
    sidebar.classList.add('hidden');
  }
  const overlay = document.getElementById('sidebar-overlay');
  if (overlay) overlay.classList.remove('active');
}

/* ============================================================
   INTERSECTION OBSERVER (sidebar active section)
   ============================================================ */

let observer = null;

function initIntersectionObserver() {
  if (observer) observer.disconnect();

  // Wait for DOM render
  requestAnimationFrame(() => {
    const sections = content.querySelectorAll('.section-block[id]');
    if (!sections.length) return;

    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          updateSidebarActive(id);
        }
      });
    }, {
      root: null,
      rootMargin: `-${64 + 40}px 0px -60% 0px`,
      threshold: 0,
    });

    sections.forEach(s => observer.observe(s));
  });
}

function updateSidebarActive(sectionId) {
  const links = sidebar?.querySelectorAll('.sidebar-nav-link');
  if (!links) return;
  links.forEach(link => {
    link.classList.toggle('active', link.dataset.section === sectionId);
  });
}

/* ============================================================
   LOADING STATE
   ============================================================ */

function loadingState(msg) {
  return `
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:400px;gap:16px">
      <div style="font-size:28px;opacity:0.3">⟳</div>
      <div style="font-size:13px;color:var(--text-tertiary);letter-spacing:0.06em">${msg}</div>
    </div>
  `;
}
