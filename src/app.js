/* ============================================
   AGENCY CRM DASHBOARD — Main Application
   ============================================ */
import Chart from 'chart.js/auto';

// -- DATA --

const DATA = {
  multipliers: {
    today: 0.05,
    yesterday: 0.04,
    '7days': 0.25,
    '30days': 1,
    '90days': 3.1,
    thismonth: 0.95,
    custom: 0.8,
  },

  base: {
    totalLeads: 390,
    newLeads: 84,
    inProgress: 117,
    converted: 93,
    lost: 42,
    revenue: 128500,
    conversionRate: 23.8,
  },

  platforms: {
    instagram: { followers: 24800, engagement: 4.7, clicks: 3200, visits: 8900, leads: 180, messages: 642, reach: 52000, impressions: 118000 },
    facebook: { followers: 18600, engagement: 2.9, clicks: 1850, visits: 5600, leads: 120, messages: 394, reach: 38000, impressions: 72000 },
    linkedin: { followers: 9200, engagement: 5.8, clicks: 980, visits: 3100, leads: 90, messages: 218, reach: 21000, impressions: 44000 },
  },

  leads: [
    { id: 1, name: 'Sarah Johnson', email: 'sarah.j@example.com', company: 'TechVentures', platform: 'instagram', status: 'won', service: 'Web Design', value: 4200, date: '2024-01-15', avatar: '#5b6ef5' },
    { id: 2, name: 'Michael Chen', email: 'm.chen@startup.io', company: 'StartupIO', platform: 'linkedin', status: 'progress', service: 'SEO Services', value: 2800, date: '2024-01-14', avatar: '#22c55e' },
    { id: 3, name: 'Emma Davis', email: 'emma.d@brandco.com', company: 'BrandCo', platform: 'facebook', status: 'proposal', service: 'Social Media Marketing', value: 5500, date: '2024-01-13', avatar: '#f59e0b' },
    { id: 4, name: 'James Wilson', email: 'j.wilson@corpinc.com', company: 'CorpInc', platform: 'linkedin', status: 'new', service: 'Business Consulting', value: 8000, date: '2024-01-12', avatar: '#a855f7' },
    { id: 5, name: 'Priya Patel', email: 'priya@digitalmain.com', company: 'DigitalMain', platform: 'instagram', status: 'contacted', service: 'Corporate Training', value: 3600, date: '2024-01-11', avatar: '#06b6d4' },
    { id: 6, name: 'David Kim', email: 'd.kim@nextweb.co', company: 'NextWeb', platform: 'facebook', status: 'won', service: 'Web Design', value: 6200, date: '2024-01-10', avatar: '#ef4444' },
    { id: 7, name: 'Olivia Brown', email: 'o.brown@growthco.io', company: 'GrowthCo', platform: 'instagram', status: 'lost', service: 'SEO Services', value: 1800, date: '2024-01-09', avatar: '#f59e0b' },
    { id: 8, name: 'Ryan Taylor', email: 'r.taylor@bigbrand.com', company: 'BigBrand', platform: 'linkedin', status: 'progress', service: 'Business Consulting', value: 9500, date: '2024-01-08', avatar: '#5b6ef5' },
    { id: 9, name: 'Aisha Okonkwo', email: 'a.okonkwo@mediahub.ng', company: 'MediaHub', platform: 'facebook', status: 'contacted', service: 'Social Media Marketing', value: 2200, date: '2024-01-07', avatar: '#22c55e' },
    { id: 10, name: 'Lucas Martinez', email: 'l.martinez@innova.mx', company: 'Innova', platform: 'instagram', status: 'proposal', service: 'Corporate Training', value: 4800, date: '2024-01-06', avatar: '#a855f7' },
  ],

  services: [
    { name: 'Web Design', leads: 94, clicks: 1240, convRate: 34, revenue: 38400 },
    { name: 'Social Media Marketing', leads: 87, clicks: 1080, convRate: 29, revenue: 29800 },
    { name: 'Business Consulting', leads: 72, clicks: 890, convRate: 41, revenue: 52300 },
    { name: 'SEO Services', leads: 68, clicks: 960, convRate: 22, revenue: 18200 },
    { name: 'Corporate Training', leads: 54, clicks: 720, convRate: 18, revenue: 16400 },
  ],

  notifications: [
    { id: 1, icon: '🎉', type: 'green', title: 'New Lead Converted!', desc: 'Sarah Johnson from TechVentures signed a Web Design contract.', time: '2 minutes ago', unread: true },
    { id: 2, icon: '📩', type: 'blue', title: 'New Lead from Instagram', desc: 'Lucas Martinez has sent a message about Corporate Training.', time: '18 minutes ago', unread: true },
    { id: 3, icon: '📊', type: 'blue', title: 'Weekly Analytics Report Ready', desc: 'Your social media performance report for last week is available.', time: '1 hour ago', unread: true },
    { id: 4, icon: '⚠️', type: 'amber', title: 'Lead Follow-up Due', desc: 'Emma Davis from BrandCo has been in "Proposal Sent" stage for 7 days.', time: '3 hours ago', unread: true },
    { id: 5, icon: '🚀', type: 'green', title: 'Campaign Milestone Reached', desc: 'Your LinkedIn campaign has exceeded 10K impressions this month.', time: '5 hours ago', unread: true },
    { id: 6, icon: '📱', type: 'blue', title: 'Instagram Connected', desc: 'Your Instagram Business account has been successfully linked.', time: '1 day ago', unread: false },
    { id: 7, icon: '📈', type: 'green', title: 'Conversion Rate Up 12%', desc: 'Your lead conversion rate improved compared to last month.', time: '2 days ago', unread: false },
    { id: 8, icon: '🔴', type: 'red', title: 'Lead Lost', desc: 'Olivia Brown from GrowthCo declined your SEO proposal.', time: '3 days ago', unread: false },
  ],
};

let activeRange = '30days';
let activePage = 'dashboard';
let charts = {};

// -- HELPERS --

function fmt(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toLocaleString();
}

function fmtCurrency(n) {
  return '$' + n.toLocaleString();
}

function applyMultiplier(val) {
  const m = DATA.multipliers[activeRange] || 1;
  return Math.round(val * m);
}

function getBaseStats() {
  const b = DATA.base;
  return {
    totalLeads: applyMultiplier(b.totalLeads),
    newLeads: applyMultiplier(b.newLeads),
    inProgress: applyMultiplier(b.inProgress),
    converted: applyMultiplier(b.converted),
    lost: applyMultiplier(b.lost),
    revenue: applyMultiplier(b.revenue),
    conversionRate: (b.conversionRate * (DATA.multipliers[activeRange] > 1 ? 1.05 : 0.97)).toFixed(1),
  };
}

function getPlatformStats(platform) {
  const p = DATA.platforms[platform];
  const m = DATA.multipliers[activeRange];
  return {
    followers: Math.round(p.followers * (1 + (m - 1) * 0.05)),
    engagement: (p.engagement * (m > 1 ? 1.02 : 0.98)).toFixed(1),
    clicks: Math.round(p.clicks * m),
    visits: Math.round(p.visits * m),
    leads: Math.round(p.leads * m),
    messages: Math.round(p.messages * m),
    reach: Math.round(p.reach * m),
    impressions: Math.round(p.impressions * m),
  };
}

function destroyChart(key) {
  if (charts[key]) {
    charts[key].destroy();
    delete charts[key];
  }
}

function destroyAllCharts() {
  Object.keys(charts).forEach(k => charts[k] && charts[k].destroy());
  charts = {};
}

function getChartColors() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  return {
    grid: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    text: isDark ? '#8b92a8' : '#9298a8',
  };
}

function hexToRgba(hex, a) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

// Gradient pairs for progress bars: [from, to]
const BAR_GRADIENTS = {
  '#5b6ef5': ['#5b6ef5', '#818cf8'],
  '#22c55e': ['#16a34a', '#4ade80'],
  '#f59e0b': ['#f59e0b', '#fcd34d'],
  '#a855f7': ['#9333ea', '#c084fc'],
  '#06b6d4': ['#0891b2', '#22d3ee'],
  '#e91e63': ['#db2777', '#f472b6'],
  '#1877f2': ['#1877f2', '#60a5fa'],
  '#0a66c2': ['#0a66c2', '#38bdf8'],
  '#9298a8': ['#6b7280', '#9ca3af'],
};

function barGrad(color) {
  const pair = BAR_GRADIENTS[color];
  return pair
    ? `linear-gradient(90deg, ${pair[0]}, ${pair[1]})`
    : `linear-gradient(90deg, ${color}, ${color})`;
}

function barGlowColor(color) {
  const pair = BAR_GRADIENTS[color];
  return pair ? pair[1] : color;
}

function makeGradient(canvasEl, hex, h = 260) {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const ctx2d = canvasEl.getContext('2d');
  const grad = ctx2d.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, hexToRgba(hex, isDark ? 0.48 : 0.32));
  grad.addColorStop(0.55, hexToRgba(hex, isDark ? 0.16 : 0.08));
  grad.addColorStop(1, hexToRgba(hex, 0));
  return grad;
}

function getTooltipStyle() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  return {
    backgroundColor: isDark ? 'rgba(12,14,26,0.97)' : 'rgba(20,23,42,0.94)',
    titleColor: '#ffffff',
    bodyColor: 'rgba(255,255,255,0.78)',
    borderColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    padding: { x: 14, y: 11 },
    cornerRadius: 12,
    displayColors: true,
    boxWidth: 8,
    boxHeight: 8,
    boxPadding: 3,
    usePointStyle: true,
    titleFont: { size: 12, weight: '600' },
    bodyFont: { size: 12 },
  };
}

function getPointStyle(color) {
  return {
    pointBackgroundColor: '#fff',
    pointBorderColor: color,
    pointBorderWidth: 2,
    pointRadius: 4,
    pointHoverRadius: 7,
    pointHoverBackgroundColor: color,
    pointHoverBorderColor: '#fff',
    pointHoverBorderWidth: 2,
  };
}

function setupChartDefaults() {
  Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
  Chart.defaults.animation.duration = 750;
  Chart.defaults.animation.easing = 'easeInOutQuart';
}

// -- ROUTER --

function navigate(page) {
  destroyAllCharts();
  activePage = page;

  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.page === page);
  });

  const titles = {
    dashboard: ['Dashboard', 'Overview'],
    leads: ['Leads Management', 'Pipeline & CRM'],
    analytics: ['Social Media Analytics', 'Platform Insights'],
    services: ['Top Services', 'Performance Analytics'],
    reports: ['Reports', 'Downloads & Exports'],
    notifications: ['Notifications', 'Alerts & Updates'],
    settings: ['Settings', 'Account Management'],
  };

  const [title, sub] = titles[page] || ['Dashboard', 'Overview'];
  document.getElementById('pageTitle').textContent = title;
  document.getElementById('pageBreadcrumb').textContent = sub;

  const content = document.getElementById('pageContent');
  content.innerHTML = '';

  const pages = {
    dashboard: renderDashboard,
    leads: renderLeads,
    analytics: renderAnalytics,
    services: renderServices,
    reports: renderReports,
    notifications: renderNotifications,
    settings: renderSettings,
  };

  const fn = pages[page];
  if (fn) fn(content);

  closeSidebar();
}

// -- INIT NAVIGATION --

function initNav() {
  document.querySelectorAll('.nav-item').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      navigate(el.dataset.page);
    });
  });
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '') || 'dashboard';
    if (hash !== activePage) navigate(hash);
  });
}

// -- SIDEBAR --

function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebarOverlay').classList.add('open');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('open');
}

function initSidebar() {
  document.getElementById('menuToggle').addEventListener('click', openSidebar);
  document.getElementById('sidebarClose').addEventListener('click', closeSidebar);
  document.getElementById('sidebarOverlay').addEventListener('click', closeSidebar);
}

// -- THEME --

function initTheme() {
  const saved = localStorage.getItem('crm-theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);

  document.getElementById('themeToggle').addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('crm-theme', next);
    // Re-render current page for updated chart colors
    setTimeout(() => navigate(activePage), 50);
  });
}

// -- DATE FILTER --

function initDateFilter() {
  const btn = document.getElementById('dateFilterBtn');
  const dropdown = document.getElementById('dateFilterDropdown');
  const label = document.getElementById('dateFilterLabel');
  const customWrap = document.getElementById('customDateWrap');

  const labels = {
    today: 'Today', yesterday: 'Yesterday', '7days': 'Last 7 Days',
    '30days': 'Last 30 Days', '90days': 'Last 90 Days',
    thismonth: 'This Month', custom: 'Custom Range',
  };

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove('open');
    }
  });

  document.querySelectorAll('.filter-opt').forEach(opt => {
    opt.addEventListener('click', () => {
      const range = opt.dataset.range;
      document.querySelectorAll('.filter-opt').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');

      if (range === 'custom') {
        customWrap.style.display = 'flex';
        customWrap.style.flexDirection = 'column';
        return;
      }

      activeRange = range;
      label.textContent = labels[range];
      customWrap.style.display = 'none';
      dropdown.classList.remove('open');

      // Animate filter change
      document.getElementById('pageContent').style.opacity = '0.6';
      document.getElementById('pageContent').style.transform = 'translateY(4px)';
      document.getElementById('pageContent').style.transition = 'all 0.2s ease';
      setTimeout(() => {
        navigate(activePage);
        document.getElementById('pageContent').style.opacity = '1';
        document.getElementById('pageContent').style.transform = 'translateY(0)';
      }, 150);
    });
  });

  document.getElementById('applyDateRange').addEventListener('click', () => {
    const from = document.getElementById('dateFrom').value;
    const to = document.getElementById('dateTo').value;
    if (from && to) {
      activeRange = 'custom';
      label.textContent = `${from} – ${to}`;
      dropdown.classList.remove('open');
      customWrap.style.display = 'none';
      navigate(activePage);
    }
  });
}

// -- ANIMATED COUNTER --

function animateCounter(el, target, prefix = '', suffix = '') {
  const duration = 1200;
  const start = performance.now();
  const startVal = 0;

  function update(time) {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(startVal + (target - startVal) * eased);
    el.textContent = prefix + current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function animateProgressBars() {
  setTimeout(() => {
    document.querySelectorAll('[data-width]').forEach(el => {
      el.style.width = el.dataset.width;
      const glow = el.dataset.glow;
      if (glow && glow.startsWith('#') && el.classList.contains('progress-fill')) {
        const glowHex = barGlowColor(glow);
        el.style.boxShadow = `0 0 10px 2px ${hexToRgba(glowHex, 0.55)}`;
      }
    });
  }, 100);
}

// ============================================
// PAGE: DASHBOARD
// ============================================

function renderDashboard(container) {
  const s = getBaseStats();
  const ig = getPlatformStats('instagram');
  const fb = getPlatformStats('facebook');
  const li = getPlatformStats('linkedin');

  container.innerHTML = `
    <!-- Stats Row -->
    <div class="grid-4 mb-24">
      ${statCard('👥', 'blue', 'Total Leads', s.totalLeads, '+12.5%', 'up', 'vs last period')}
      ${statCard('✨', 'green', 'Converted Clients', s.converted, '+8.3%', 'up', `Revenue: ${fmtCurrency(s.revenue)}`)}
      ${statCard('⏳', 'amber', 'In Progress', s.inProgress, '+4.2%', 'up', `${Math.round(s.inProgress * 0.42)} need follow-up`)}
      ${statCard('📉', 'red', 'Lost Leads', s.lost, '-2.1%', 'down', `Rate: ${((s.lost / s.totalLeads) * 100).toFixed(1)}%`)}
    </div>

    <!-- KPI Goals -->
    ${renderKpiGoals(s)}

    <!-- Charts Row -->
    <div class="grid-2-1 mb-24">
      <!-- Lead Trend Chart -->
      <div class="chart-card">
        <div class="chart-header">
          <div>
            <div class="chart-title">Lead Growth Trend</div>
            <div class="chart-sub">New leads over time across all platforms</div>
          </div>
          <div class="chart-tabs">
            <button class="chart-tab active" data-chart="leads-trend" data-type="weekly">Weekly</button>
            <button class="chart-tab" data-chart="leads-trend" data-type="monthly">Monthly</button>
          </div>
        </div>
        <div class="chart-container" style="height:220px">
          <canvas id="leadTrendChart"></canvas>
        </div>
        <div class="chart-legend">
          <div class="legend-item"><div class="legend-dot" style="background:#5b6ef5"></div>Instagram</div>
          <div class="legend-item"><div class="legend-dot" style="background:#1877f2"></div>Facebook</div>
          <div class="legend-item"><div class="legend-dot" style="background:#0a66c2"></div>LinkedIn</div>
        </div>
      </div>

      <!-- Conversion Funnel -->
      <div class="chart-card">
        <div class="chart-header">
          <div>
            <div class="chart-title">Lead Funnel</div>
            <div class="chart-sub">Pipeline conversion stages</div>
          </div>
        </div>
        <div class="funnel-wrap" id="funnelWrap"></div>
      </div>
    </div>

    <!-- Platform Cards Row -->
    <div class="section-header mb-20">
      <div>
        <div class="section-title">Platform Performance</div>
        <div class="section-sub">Social media channels at a glance</div>
      </div>
      <a href="#analytics" class="btn btn-secondary" id="viewAllAnalytics" style="font-size:12px;padding:7px 14px">View All →</a>
    </div>
    <div class="grid-3 mb-24">
      ${platformMiniCard('Instagram', '📸', 'instagram', ig)}
      ${platformMiniCard('Facebook', '📘', 'facebook', fb)}
      ${platformMiniCard('LinkedIn', '💼', 'linkedin', li)}
    </div>

    <!-- Bottom Row -->
    <div class="grid-2">
      <!-- Recent Activity -->
      <div class="card">
        <div class="section-header">
          <div class="section-title">Recent Activity</div>
          <span class="text-muted" style="font-size:12px">Live Feed</span>
        </div>
        <div class="activity-list">
          ${activityItems()}
        </div>
      </div>

      <!-- Top Services -->
      <div class="card">
        <div class="section-header">
          <div class="section-title">Top Services</div>
          <a href="#services" id="viewServicesLink" class="btn btn-secondary" style="font-size:12px;padding:7px 14px">Details →</a>
        </div>
        <div>
          ${DATA.services.map((s, i) => `
            <div class="service-row">
              <div class="service-rank ${i === 0 ? 'top-1' : i === 1 ? 'top-2' : i === 2 ? 'top-3' : ''}">${i + 1}</div>
              <div class="service-name">${s.name}</div>
              <div class="service-bar-wrap">
                <div class="progress-track" style="height:5px">
                  <div class="progress-fill service-bar" data-width="${s.leads / 94 * 100}%" data-glow="${['#5b6ef5','#22c55e','#f59e0b','#a855f7','#06b6d4'][i]}" style="background:${barGrad(['#5b6ef5','#22c55e','#f59e0b','#a855f7','#06b6d4'][i])};width:0%"></div>
                </div>
              </div>
              <div class="service-leads">${applyMultiplier(s.leads)}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  // Animate counters
  container.querySelectorAll('.stat-value[data-value]').forEach(el => {
    animateCounter(el, parseInt(el.dataset.value), el.dataset.prefix || '', el.dataset.suffix || '');
  });

  animateProgressBars();

  // Funnel
  renderFunnel(document.getElementById('funnelWrap'), s);

  // Lead trend chart
  setTimeout(() => initLeadTrendChart(s), 100);

  // Nav links within page
  document.getElementById('viewAllAnalytics')?.addEventListener('click', (e) => {
    e.preventDefault();
    navigate('analytics');
  });
  document.getElementById('viewServicesLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    navigate('services');
  });

  // Chart tabs
  container.querySelectorAll('.chart-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      container.querySelectorAll('.chart-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      destroyChart('leadTrend');
      initLeadTrendChart(s, tab.dataset.type);
    });
  });

  // KPI rings
  const kpiColors = ['#5b6ef5', '#22c55e', '#f59e0b'];
  document.querySelectorAll('.kpi-ring-card').forEach((card, i) => {
    const el  = document.getElementById(`kpiRing${i}`);
    const pct = parseInt(card.querySelector('.kpi-ring-pct')?.textContent || '0');
    if (el) drawKpiRing(el, pct, kpiColors[i]);
  });

  container.classList.add('page-enter');
}

function statCard(icon, colorClass, label, value, change, dir, sub) {
  return `
    <div class="stat-card accent-${colorClass === 'blue' ? 'blue' : colorClass}">
      <div class="stat-header">
        <div class="stat-icon ${colorClass}">${icon}</div>
        <div class="stat-change ${dir}">${dir === 'up' ? '↑' : '↓'} ${change}</div>
      </div>
      <div class="stat-value" data-value="${typeof value === 'number' ? value : 0}">${fmt(value)}</div>
      <div class="stat-label">${label}</div>
      <div class="stat-sub">${sub}</div>
    </div>
  `;
}

function platformMiniCard(name, icon, cls, stats) {
  return `
    <div class="platform-card">
      <div class="platform-header">
        <div class="platform-icon ${cls}">${icon}</div>
        <div>
          <div class="platform-name">${name}</div>
          <div class="platform-handle">@agency${cls}</div>
        </div>
        <div class="stat-change up" style="margin-left:auto">↑ ${(Math.random() * 8 + 2).toFixed(1)}%</div>
      </div>
      <div class="platform-stat-row">
        <div class="platform-stat">
          <div class="platform-stat-val">${fmt(stats.followers)}</div>
          <div class="platform-stat-lbl">Followers</div>
        </div>
        <div class="platform-stat">
          <div class="platform-stat-val">${stats.engagement}%</div>
          <div class="platform-stat-lbl">Engagement</div>
        </div>
        <div class="platform-stat">
          <div class="platform-stat-val">${fmt(stats.leads)}</div>
          <div class="platform-stat-lbl">Leads</div>
        </div>
      </div>
    </div>
  `;
}

function activityItems() {
  const items = [
    { dot: 'green', text: '<strong>Sarah Johnson</strong> converted to a client — Web Design', time: '2 min ago' },
    { dot: 'blue', text: '<strong>New lead</strong> from Instagram — Lucas Martinez', time: '18 min ago' },
    { dot: 'amber', text: '<strong>Emma Davis</strong> moved to Proposal stage', time: '1 hour ago' },
    { dot: 'purple', text: '<strong>LinkedIn campaign</strong> hit 10K impressions', time: '3 hours ago' },
    { dot: 'red', text: '<strong>Olivia Brown</strong> lead marked as Lost', time: '5 hours ago' },
    { dot: 'blue', text: '<strong>Weekly report</strong> generated and ready', time: '1 day ago' },
  ];
  return items.map(i => `
    <div class="activity-item">
      <div class="activity-dot-wrap">
        <div class="activity-dot ${i.dot}"></div>
      </div>
      <div class="activity-content">
        <div class="activity-text">${i.text}</div>
        <div class="activity-time">${i.time}</div>
      </div>
    </div>
  `).join('');
}

function renderFunnel(container, s) {
  const stages = [
    { label: 'New Queries', count: s.totalLeads, color: '#5b6ef5' },
    { label: 'Contacted', count: Math.round(s.totalLeads * 0.72), color: '#06b6d4' },
    { label: 'In Progress', count: s.inProgress, color: '#f59e0b' },
    { label: 'Proposal Sent', count: Math.round(s.totalLeads * 0.28), color: '#a855f7' },
    { label: 'Converted', count: s.converted, color: '#22c55e' },
  ];
  const max = stages[0].count;
  container.innerHTML = stages.map(st => `
    <div class="funnel-stage">
      <div class="funnel-bar-label">${st.label}</div>
      <div class="funnel-bar-wrap">
        <div class="funnel-bar-bg">
          <div class="funnel-bar-fill" style="background:${barGrad(st.color)};width:0%" data-width="${(st.count / max * 100).toFixed(1)}%">
            ${fmt(st.count)}
          </div>
        </div>
      </div>
      <div class="funnel-pct">${(st.count / max * 100).toFixed(0)}%</div>
    </div>
  `).join('');
  animateProgressBars();
}

function initLeadTrendChart(s, type = 'weekly') {
  const cc = getChartColors();
  const ctx = document.getElementById('leadTrendChart');
  if (!ctx) return;

  const labels = type === 'weekly'
    ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const m = DATA.multipliers[activeRange];
  const gen = (base) => labels.map(() => Math.round(base * m * (0.6 + Math.random() * 0.8)));

  const c1 = '#5b6ef5', c2 = '#1877f2', c3 = '#0a66c2';
  const g1 = makeGradient(ctx, c1, 230);
  const g2 = makeGradient(ctx, c2, 230);
  const g3 = makeGradient(ctx, c3, 230);

  destroyChart('leadTrend');
  charts['leadTrend'] = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        { label: 'Instagram', data: gen(8), borderColor: c1, backgroundColor: g1, borderWidth: 2.5, tension: 0.45, fill: true, ...getPointStyle(c1) },
        { label: 'Facebook', data: gen(5), borderColor: c2, backgroundColor: g2, borderWidth: 2.5, tension: 0.45, fill: true, ...getPointStyle(c2) },
        { label: 'LinkedIn', data: gen(4), borderColor: c3, backgroundColor: g3, borderWidth: 2.5, tension: 0.45, fill: true, ...getPointStyle(c3) },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: getTooltipStyle(),
      },
      scales: {
        x: { grid: { color: cc.grid, drawBorder: false }, border: { display: false }, ticks: { color: cc.text, font: { size: 11 } } },
        y: { grid: { color: cc.grid, drawBorder: false }, border: { display: false }, ticks: { color: cc.text, font: { size: 11 } } },
      },
    },
  });
}

// ============================================
// PAGE: LEADS MANAGEMENT
// ============================================

function renderLeads(container) {
  const s = getBaseStats();
  container.innerHTML = `
    <!-- Stats -->
    <div class="grid-4 mb-24">
      ${statCard('📋', 'blue', 'Total Leads', s.totalLeads, '+12.5%', 'up', 'All platforms')}
      ${statCard('🆕', 'cyan', 'New This Period', s.newLeads, '+18.2%', 'up', 'Awaiting contact')}
      ${statCard('✅', 'green', 'Converted', s.converted, '+8.3%', 'up', `Rate: ${s.conversionRate}%`)}
      ${statCard('❌', 'red', 'Lost', s.lost, '-2.1%', 'down', `Rate: ${((s.lost / s.totalLeads) * 100).toFixed(1)}%`)}
    </div>

    <!-- Platform Breakdown -->
    <div class="grid-3 mb-24">
      <div class="card">
        <div class="stat-header">
          <div class="stat-icon" style="background:#fce4ec;font-size:20px">📸</div>
          <div class="stat-change up">↑ 14.2%</div>
        </div>
        <div class="stat-value">${applyMultiplier(180)}</div>
        <div class="stat-label">Instagram Leads</div>
        <div class="progress-track mt-8"><div class="progress-fill" data-width="46%" data-glow="#e91e63" style="background:${barGrad('#e91e63')};width:0%"></div></div>
      </div>
      <div class="card">
        <div class="stat-header">
          <div class="stat-icon" style="background:#e3f2fd;font-size:20px">📘</div>
          <div class="stat-change up">↑ 6.8%</div>
        </div>
        <div class="stat-value">${applyMultiplier(120)}</div>
        <div class="stat-label">Facebook Leads</div>
        <div class="progress-track mt-8"><div class="progress-fill" data-width="31%" data-glow="#1877f2" style="background:${barGrad('#1877f2')};width:0%"></div></div>
      </div>
      <div class="card">
        <div class="stat-header">
          <div class="stat-icon" style="background:#e3f0fb;font-size:20px">💼</div>
          <div class="stat-change up">↑ 22.4%</div>
        </div>
        <div class="stat-value">${applyMultiplier(90)}</div>
        <div class="stat-label">LinkedIn Leads</div>
        <div class="progress-track mt-8"><div class="progress-fill" data-width="23%" data-glow="#0a66c2" style="background:${barGrad('#0a66c2')};width:0%"></div></div>
      </div>
    </div>

    <!-- Leads Table -->
    <div class="card">
      <div class="section-header mb-20">
        <div class="section-title">All Leads</div>
        <div class="flex gap-8" style="flex-wrap:wrap">
          <div class="search-bar">
            <span class="search-icon">🔍</span>
            <input type="text" placeholder="Search leads..." id="leadsSearch">
          </div>
          <select class="filter-select" id="platformFilter">
            <option value="all">All Platforms</option>
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
            <option value="linkedin">LinkedIn</option>
          </select>
          <select class="filter-select" id="statusFilter">
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="progress">In Progress</option>
            <option value="proposal">Proposal Sent</option>
            <option value="won">Converted</option>
            <option value="lost">Lost</option>
          </select>
        </div>
      </div>
      <div class="leads-table-wrap">
        <table class="leads-table" id="leadsTable">
          <thead>
            <tr>
              <th>Lead</th>
              <th>Platform</th>
              <th>Service Interest</th>
              <th>Status</th>
              <th>Value</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody id="leadsTableBody"></tbody>
        </table>
      </div>
    </div>
  `;

  animateProgressBars();
  renderLeadsTable(DATA.leads);

  // Search + Filter
  document.getElementById('leadsSearch').addEventListener('input', filterLeads);
  document.getElementById('platformFilter').addEventListener('change', filterLeads);
  document.getElementById('statusFilter').addEventListener('change', filterLeads);

  container.classList.add('page-enter');
}

function renderLeadsTable(leads) {
  const tbody = document.getElementById('leadsTableBody');
  if (!tbody) return;

  const statusMap = {
    new: 'New', contacted: 'Contacted', progress: 'In Progress',
    proposal: 'Proposal Sent', won: 'Converted', lost: 'Lost',
  };
  const badgeMap = {
    new: 'badge-new', contacted: 'badge-contacted', progress: 'badge-progress',
    proposal: 'badge-proposal', won: 'badge-won', lost: 'badge-lost',
  };
  const pbMap = {
    instagram: 'pb-instagram', facebook: 'pb-facebook', linkedin: 'pb-linkedin',
  };
  const pbIcon = {
    instagram: '📸', facebook: '📘', linkedin: '💼',
  };

  tbody.innerHTML = leads.map(l => `
    <tr data-lead-id="${l.id}">
      <td>
        <div class="lead-name-cell">
          <div class="lead-avatar" style="background:${l.avatar}">${l.name.split(' ').map(n => n[0]).join('')}</div>
          <div>
            <div class="lead-name">${l.name}</div>
            <div class="lead-email">${l.email}</div>
          </div>
        </div>
      </td>
      <td><span class="platform-badge ${pbMap[l.platform]}">${pbIcon[l.platform]} ${l.platform.charAt(0).toUpperCase() + l.platform.slice(1)}</span></td>
      <td>${l.service}</td>
      <td><span class="status-badge ${badgeMap[l.status]}">${statusMap[l.status]}</span></td>
      <td class="font-700">${fmtCurrency(l.value)}</td>
      <td class="text-muted">${l.date}</td>
      <td><button class="table-action-btn" data-lead-id="${l.id}">View →</button></td>
    </tr>
  `).join('');

  tbody.querySelectorAll('tr[data-lead-id]').forEach(tr => {
    tr.addEventListener('click', () => {
      const id = parseInt(tr.dataset.leadId);
      const lead = DATA.leads.find(l => l.id === id);
      if (lead) openLeadDrawer(lead);
    });
  });
}

function filterLeads() {
  const search = document.getElementById('leadsSearch')?.value.toLowerCase() || '';
  const platform = document.getElementById('platformFilter')?.value || 'all';
  const status = document.getElementById('statusFilter')?.value || 'all';

  const filtered = DATA.leads.filter(l => {
    const matchSearch = !search || l.name.toLowerCase().includes(search) || l.email.toLowerCase().includes(search) || l.company.toLowerCase().includes(search);
    const matchPlatform = platform === 'all' || l.platform === platform;
    const matchStatus = status === 'all' || l.status === status;
    return matchSearch && matchPlatform && matchStatus;
  });

  renderLeadsTable(filtered);
}

// ============================================
// PAGE: SOCIAL MEDIA ANALYTICS
// ============================================

let activePlatform = 'instagram';

function renderAnalytics(container) {
  container.innerHTML = `
    <div class="platform-nav" id="platformNav">
      <button class="platform-nav-btn instagram active" data-platform="instagram">📸 Instagram</button>
      <button class="platform-nav-btn facebook" data-platform="facebook">📘 Facebook</button>
      <button class="platform-nav-btn linkedin" data-platform="linkedin">💼 LinkedIn</button>
    </div>
    <div id="platformContent"></div>
  `;

  renderPlatformContent(activePlatform);

  container.querySelectorAll('.platform-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.platform-nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activePlatform = btn.dataset.platform;
      destroyChart('platformChart');
      destroyChart('adsChart');
      renderPlatformContent(activePlatform);
    });
  });

  container.classList.add('page-enter');
}

function renderPlatformContent(platform) {
  const stats = getPlatformStats(platform);
  const container = document.getElementById('platformContent');
  const colors = {
    instagram: { primary: '#e91e63', secondary: '#f06292', light: '#fce4ec' },
    facebook: { primary: '#1877f2', secondary: '#42a5f5', light: '#e3f2fd' },
    linkedin: { primary: '#0a66c2', secondary: '#29b6f6', light: '#e3f0fb' },
  }[platform];
  const icons = { instagram: '📸', facebook: '📘', linkedin: '💼' };
  const names = { instagram: 'Instagram', facebook: 'Facebook', linkedin: 'LinkedIn' };

  container.innerHTML = `
    <!-- KPI Cards -->
    <div class="grid-4 mb-24">
      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-icon" style="background:${colors.light}">${icons[platform]}</div>
          <div class="stat-change up">↑ 5.2%</div>
        </div>
        <div class="stat-value">${fmt(stats.followers)}</div>
        <div class="stat-label">Followers</div>
        <div class="stat-sub">Total audience</div>
      </div>
      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-icon green">🔥</div>
          <div class="stat-change up">↑ 1.4%</div>
        </div>
        <div class="stat-value">${stats.engagement}%</div>
        <div class="stat-label">Engagement Rate</div>
        <div class="stat-sub">Avg per post</div>
      </div>
      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-icon purple">👁</div>
          <div class="stat-change up">↑ 18.7%</div>
        </div>
        <div class="stat-value">${fmt(stats.reach)}</div>
        <div class="stat-label">Total Reach</div>
        <div class="stat-sub">${fmt(stats.impressions)} impressions</div>
      </div>
      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-icon amber">🎯</div>
          <div class="stat-change up">↑ 9.1%</div>
        </div>
        <div class="stat-value">${fmt(stats.leads)}</div>
        <div class="stat-label">Leads Generated</div>
        <div class="stat-sub">${fmt(stats.messages)} messages</div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid-2 mb-24">
      <div class="chart-card">
        <div class="chart-header">
          <div>
            <div class="chart-title">${names[platform]} Growth</div>
            <div class="chart-sub">Followers & engagement over time</div>
          </div>
        </div>
        <div class="chart-container" style="height:220px">
          <canvas id="platformChart"></canvas>
        </div>
      </div>
      <div class="chart-card">
        <div class="chart-header">
          <div>
            <div class="chart-title">Ad Performance</div>
            <div class="chart-sub">Clicks, reach, and spend</div>
          </div>
        </div>
        <div class="chart-container" style="height:220px">
          <canvas id="adsChart"></canvas>
        </div>
      </div>
    </div>

    <!-- Detailed Metrics -->
    <div class="grid-2">
      <div class="card">
        <div class="section-title mb-20">Audience & Reach</div>
        ${progressItem('Profile Visits', fmt(stats.visits), 78, colors.primary)}
        ${progressItem('Clicks to Website', fmt(stats.clicks), 62, colors.secondary)}
        ${progressItem('Stories Reach', fmt(Math.round(stats.reach * 0.6)), 55, '#a855f7')}
        ${progressItem('Messages Received', fmt(stats.messages), 38, '#f59e0b')}
      </div>
      <div class="card">
        <div class="section-title mb-20">Content Performance</div>
        ${progressItem('Organic Reach', fmt(Math.round(stats.reach * 0.55)), 70, '#22c55e')}
        ${progressItem('Paid Reach', fmt(Math.round(stats.reach * 0.45)), 58, colors.primary)}
        ${progressItem('Video Views', fmt(Math.round(stats.impressions * 0.3)), 45, '#06b6d4')}
        ${progressItem('Saved Posts', fmt(Math.round(stats.clicks * 0.22)), 30, '#e91e63')}
      </div>
    </div>
  `;

  setTimeout(() => {
    initPlatformChart(platform, stats, colors.primary);
    initAdsChart(platform, stats, colors.primary, colors.secondary);
  }, 50);
  animateProgressBars();
}

function progressItem(label, value, pct, color) {
  return `
    <div class="progress-item">
      <div class="progress-header">
        <span class="progress-label">${label}</span>
        <span class="progress-value">${value}</span>
      </div>
      <div class="progress-track">
        <div class="progress-fill" data-width="${pct}%" data-glow="${color}" style="background:${barGrad(color)};width:0%"></div>
      </div>
    </div>
  `;
}

function initPlatformChart(platform, stats, color) {
  const ctx = document.getElementById('platformChart');
  if (!ctx) return;
  const cc = getChartColors();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  const base = stats.followers;
  const data = months.map((_, i) => Math.round(base * (0.65 + i * 0.06)));
  const lineColor = '#22c55e';
  const lineGrad = makeGradient(ctx, lineColor, 220);

  destroyChart('platformChart');
  charts['platformChart'] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: months,
      datasets: [
        {
          label: 'Followers',
          data,
          backgroundColor: hexToRgba(color, 0.75),
          borderColor: color,
          borderWidth: 0,
          borderRadius: 8,
          borderSkipped: false,
          yAxisID: 'y',
        },
        {
          label: 'Engagement %',
          data: months.map(() => (parseFloat(stats.engagement) * (0.8 + Math.random() * 0.4)).toFixed(2)),
          type: 'line',
          borderColor: lineColor,
          backgroundColor: lineGrad,
          borderWidth: 2.5,
          tension: 0.45,
          fill: true,
          yAxisID: 'y1',
          ...getPointStyle(lineColor),
        },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { labels: { color: cc.text, font: { size: 11 }, boxWidth: 10, boxHeight: 10, usePointStyle: true } },
        tooltip: getTooltipStyle(),
      },
      scales: {
        x: { grid: { color: cc.grid }, border: { display: false }, ticks: { color: cc.text, font: { size: 11 } } },
        y: { grid: { color: cc.grid }, border: { display: false }, ticks: { color: cc.text, font: { size: 11 } } },
        y1: { position: 'right', grid: { display: false }, border: { display: false }, ticks: { color: lineColor, font: { size: 11 } } },
      },
    },
  });
}

function initAdsChart(platform, stats, color1, color2) {
  const ctx = document.getElementById('adsChart');
  if (!ctx) return;
  const cc = getChartColors();
  const weeks = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'];
  const g1 = makeGradient(ctx, color1, 220);
  const g2 = makeGradient(ctx, color2, 220);

  destroyChart('adsChart');
  charts['adsChart'] = new Chart(ctx, {
    type: 'line',
    data: {
      labels: weeks,
      datasets: [
        { label: 'Clicks', data: weeks.map(() => Math.round(stats.clicks / 6 * (0.7 + Math.random() * 0.6))), borderColor: color1, backgroundColor: g1, borderWidth: 2.5, tension: 0.45, fill: true, ...getPointStyle(color1) },
        { label: 'Reach', data: weeks.map(() => Math.round(stats.reach / 6 * (0.7 + Math.random() * 0.6))), borderColor: color2, backgroundColor: g2, borderWidth: 2.5, tension: 0.45, fill: true, ...getPointStyle(color2) },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { labels: { color: cc.text, font: { size: 11 }, boxWidth: 10, usePointStyle: true } },
        tooltip: getTooltipStyle(),
      },
      scales: {
        x: { grid: { color: cc.grid }, border: { display: false }, ticks: { color: cc.text, font: { size: 11 } } },
        y: { grid: { color: cc.grid }, border: { display: false }, ticks: { color: cc.text, font: { size: 11 } } },
      },
    },
  });
}

// ============================================
// PAGE: TOP SERVICES
// ============================================

function renderServices(container) {
  const s = getBaseStats();
  container.innerHTML = `
    <!-- Stats -->
    <div class="grid-4 mb-24">
      <div class="stat-card">
        <div class="stat-header"><div class="stat-icon blue">🏆</div><div class="stat-change up">↑ 34%</div></div>
        <div class="stat-value">Web Design</div>
        <div class="stat-label">Most Converted Service</div>
        <div class="stat-sub">${applyMultiplier(94)} leads this period</div>
      </div>
      <div class="stat-card">
        <div class="stat-header"><div class="stat-icon amber">📣</div><div class="stat-change up">↑ 29%</div></div>
        <div class="stat-value">Social Media</div>
        <div class="stat-label">Most Requested</div>
        <div class="stat-sub">${applyMultiplier(87)} inquiries</div>
      </div>
      <div class="stat-card">
        <div class="stat-header"><div class="stat-icon green">💰</div><div class="stat-change up">↑ 41%</div></div>
        <div class="stat-value">41%</div>
        <div class="stat-label">Top Conversion Rate</div>
        <div class="stat-sub">Business Consulting</div>
      </div>
      <div class="stat-card">
        <div class="stat-header"><div class="stat-icon purple">📊</div><div class="stat-change up">↑ 12%</div></div>
        <div class="stat-value">${fmtCurrency(applyMultiplier(155100))}</div>
        <div class="stat-label">Total Service Revenue</div>
        <div class="stat-sub">All services combined</div>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid-2 mb-24">
      <div class="chart-card">
        <div class="chart-header">
          <div>
            <div class="chart-title">Leads by Service</div>
            <div class="chart-sub">Distribution across all offerings</div>
          </div>
        </div>
        <div class="chart-container" style="height:260px">
          <canvas id="servicesPieChart"></canvas>
        </div>
      </div>
      <div class="chart-card">
        <div class="chart-header">
          <div>
            <div class="chart-title">Revenue by Service</div>
            <div class="chart-sub">Earnings comparison this period</div>
          </div>
        </div>
        <div class="chart-container" style="height:260px">
          <canvas id="servicesBarChart"></canvas>
        </div>
      </div>
    </div>

    <!-- Detailed Table -->
    <div class="card">
      <div class="section-title mb-20">Service Performance Details</div>
      ${DATA.services.map((svc, i) => `
        <div class="service-row" style="padding:14px 0">
          <div class="service-rank ${i === 0 ? 'top-1' : i === 1 ? 'top-2' : i === 2 ? 'top-3' : ''}" style="font-size:14px;font-weight:800">${i + 1}</div>
          <div style="flex:2">
            <div style="font-size:14px;font-weight:600">${svc.name}</div>
            <div style="font-size:11.5px;color:var(--text-3);margin-top:2px">${applyMultiplier(svc.clicks)} clicks · ${svc.convRate}% conv rate</div>
          </div>
          <div class="service-bar-wrap">
            <div class="progress-track" style="height:8px">
              <div class="progress-fill" data-width="${svc.leads / 94 * 100}%" data-glow="${['#5b6ef5','#22c55e','#f59e0b','#a855f7','#06b6d4'][i]}" style="background:${barGrad(['#5b6ef5','#22c55e','#f59e0b','#a855f7','#06b6d4'][i])};width:0%"></div>
            </div>
            <div style="font-size:11px;color:var(--text-3);margin-top:4px">${applyMultiplier(svc.leads)} leads</div>
          </div>
          <div style="width:100px;text-align:right">
            <div style="font-size:14px;font-weight:700">${fmtCurrency(applyMultiplier(svc.revenue))}</div>
            <div style="font-size:11px;color:var(--text-3)">revenue</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  animateProgressBars();
  setTimeout(() => {
    initServicesPieChart();
    initServicesBarChart();
  }, 50);

  container.classList.add('page-enter');
}

function initServicesPieChart() {
  const ctx = document.getElementById('servicesPieChart');
  if (!ctx) return;
  const cc = getChartColors();
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const borderCol = isDark ? '#151829' : '#ffffff';

  destroyChart('servicesPie');
  charts['servicesPie'] = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: DATA.services.map(s => s.name),
      datasets: [{
        data: DATA.services.map(s => applyMultiplier(s.leads)),
        backgroundColor: ['#5b6ef5', '#22c55e', '#f59e0b', '#a855f7', '#06b6d4'],
        hoverBackgroundColor: ['#4454e0', '#16a34a', '#d97706', '#9333ea', '#0891b2'],
        borderWidth: 3,
        borderColor: borderCol,
        hoverOffset: 14,
        spacing: 2,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: { color: cc.text, font: { size: 12 }, padding: 16, usePointStyle: true, pointStyleWidth: 10 },
        },
        tooltip: {
          ...getTooltipStyle(),
          callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.raw} leads` },
        },
      },
      cutout: '68%',
      animation: { animateRotate: true, animateScale: true },
    },
  });
}

function initServicesBarChart() {
  const ctx = document.getElementById('servicesBarChart');
  if (!ctx) return;
  const cc = getChartColors();
  const colors = ['#5b6ef5', '#22c55e', '#f59e0b', '#a855f7', '#06b6d4'];

  destroyChart('servicesBar');
  charts['servicesBar'] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: DATA.services.map(s => s.name),
      datasets: [{
        label: 'Revenue',
        data: DATA.services.map(s => applyMultiplier(s.revenue)),
        backgroundColor: colors.map(c => hexToRgba(c, 0.82)),
        hoverBackgroundColor: colors,
        borderRadius: 10,
        borderSkipped: false,
        borderWidth: 0,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: {
        legend: { display: false },
        tooltip: {
          ...getTooltipStyle(),
          callbacks: { label: ctx => ` $${ctx.raw.toLocaleString()}` },
        },
      },
      scales: {
        x: { grid: { color: cc.grid }, border: { display: false }, ticks: { color: cc.text, font: { size: 11 }, callback: v => '$' + (v / 1000).toFixed(0) + 'K' } },
        y: { grid: { display: false }, border: { display: false }, ticks: { color: cc.text, font: { size: 12, weight: '500' } } },
      },
    },
  });
}

// ============================================
// PAGE: REPORTS
// ============================================

function renderReports(container) {
  container.innerHTML = `
    <div class="grid-2 mb-24">
      <!-- Report Downloads -->
      <div class="card">
        <div class="section-header mb-20">
          <div class="section-title">Available Reports</div>
          <button class="btn btn-primary" style="font-size:12px;padding:7px 14px">+ Generate New</button>
        </div>
        ${reportCard('📊', 'Monthly Lead Report — January 2024', 'Jan 31, 2024', '2.4 MB')}
        ${reportCard('📱', 'Social Media Analytics — Q4 2023', 'Dec 31, 2023', '3.1 MB')}
        ${reportCard('💼', 'Service Performance — Q4 2023', 'Dec 31, 2023', '1.8 MB')}
        ${reportCard('📈', 'Lead Conversion Report — 2023', 'Dec 31, 2023', '5.2 MB')}
        ${reportCard('🎯', 'Instagram Campaign Report — Nov', 'Nov 30, 2023', '1.4 MB')}
        ${reportCard('💰', 'Revenue & Pipeline — 2023', 'Dec 31, 2023', '4.6 MB')}
      </div>

      <!-- Summary Panel -->
      <div style="display:flex;flex-direction:column;gap:20px">
        <div class="chart-card">
          <div class="chart-title mb-20">Report Summary</div>
          <div class="chart-container" style="height:220px">
            <canvas id="reportChart"></canvas>
          </div>
        </div>
        <div class="card">
          <div class="section-title" style="margin-bottom:16px">Quick Metrics</div>
          ${progressItem('Lead Generation Efficiency', '78%', 78, '#5b6ef5')}
          ${progressItem('Conversion Success Rate', `${getBaseStats().conversionRate}%`, parseFloat(getBaseStats().conversionRate), '#22c55e')}
          ${progressItem('Campaign ROI', '312%', 85, '#f59e0b')}
          ${progressItem('Client Retention Rate', '91%', 91, '#a855f7')}
        </div>
      </div>
    </div>
  `;

  animateProgressBars();
  setTimeout(() => initReportChart(), 50);
  container.classList.add('page-enter');
}

function reportCard(icon, name, date, size) {
  return `
    <div class="report-card">
      <div class="report-icon">${icon}</div>
      <div class="report-info">
        <div class="report-name">${name}</div>
        <div class="report-date">Generated: ${date} · ${size}</div>
      </div>
      <button class="download-btn">⬇ Download</button>
    </div>
  `;
}

function initReportChart() {
  const ctx = document.getElementById('reportChart');
  if (!ctx) return;
  const cc = getChartColors();
  const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
  const m = DATA.multipliers[activeRange];
  const c1 = '#5b6ef5', c2 = '#22c55e';
  const g1 = makeGradient(ctx, c1, 210);
  const g2 = makeGradient(ctx, c2, 210);

  destroyChart('reportChart');
  charts['reportChart'] = new Chart(ctx, {
    type: 'line',
    data: {
      labels: months,
      datasets: [
        { label: 'Leads', data: [42, 58, 71, 64, 82, Math.round(84 * m)], borderColor: c1, backgroundColor: g1, borderWidth: 2.5, tension: 0.45, fill: true, ...getPointStyle(c1) },
        { label: 'Converted', data: [12, 18, 22, 16, 28, Math.round(28 * m)], borderColor: c2, backgroundColor: g2, borderWidth: 2.5, tension: 0.45, fill: true, ...getPointStyle(c2) },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { labels: { color: cc.text, font: { size: 11 }, usePointStyle: true, boxWidth: 10 } },
        tooltip: getTooltipStyle(),
      },
      scales: {
        x: { grid: { color: cc.grid }, border: { display: false }, ticks: { color: cc.text, font: { size: 11 } } },
        y: { grid: { color: cc.grid }, border: { display: false }, ticks: { color: cc.text, font: { size: 11 } } },
      },
    },
  });
}

// ============================================
// PAGE: NOTIFICATIONS
// ============================================

function renderNotifications(container) {
  container.innerHTML = `
    <div class="grid-2-1">
      <div class="card">
        <div class="section-header mb-20">
          <div class="section-title">All Notifications</div>
          <button class="btn btn-secondary" id="markAllRead" style="font-size:12px;padding:7px 14px">Mark all read</button>
        </div>

        <div class="tab-bar">
          <button class="tab-btn active" data-tab="all">All</button>
          <button class="tab-btn" data-tab="unread">Unread (5)</button>
          <button class="tab-btn" data-tab="leads">Leads</button>
          <button class="tab-btn" data-tab="analytics">Analytics</button>
        </div>

        <div class="notif-list" id="notifList">
          ${DATA.notifications.map(n => notifItem(n)).join('')}
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:20px">
        <div class="card">
          <div class="section-title" style="margin-bottom:16px">Notification Summary</div>
          <div class="grid-2" style="gap:12px;margin-bottom:16px">
            <div style="text-align:center;padding:16px;background:var(--accent-light);border-radius:var(--r)">
              <div style="font-size:24px;font-weight:800;color:var(--accent)">5</div>
              <div style="font-size:12px;color:var(--text-3)">Unread</div>
            </div>
            <div style="text-align:center;padding:16px;background:var(--green-light);border-radius:var(--r)">
              <div style="font-size:24px;font-weight:800;color:var(--green)">8</div>
              <div style="font-size:12px;color:var(--text-3)">Total Today</div>
            </div>
          </div>
          ${progressItem('Lead Alerts', '3 new', 60, '#5b6ef5')}
          ${progressItem('Analytics Updates', '2 new', 40, '#22c55e')}
          ${progressItem('System Messages', '0 new', 10, '#9298a8')}
        </div>

        <div class="card">
          <div class="section-title" style="margin-bottom:16px">Notification Channels</div>
          <div class="toggle-row">
            <div class="toggle-info">
              <div class="toggle-label">Browser Push</div>
              <div class="toggle-desc">Real-time alerts in browser</div>
            </div>
            <label class="toggle-switch"><input type="checkbox" checked><div class="toggle-track"></div><div class="toggle-thumb"></div></label>
          </div>
          <div class="toggle-row">
            <div class="toggle-info">
              <div class="toggle-label">Email Digest</div>
              <div class="toggle-desc">Daily summary emails</div>
            </div>
            <label class="toggle-switch"><input type="checkbox" checked><div class="toggle-track"></div><div class="toggle-thumb"></div></label>
          </div>
          <div class="toggle-row">
            <div class="toggle-info">
              <div class="toggle-label">SMS Alerts</div>
              <div class="toggle-desc">Critical leads only</div>
            </div>
            <label class="toggle-switch"><input type="checkbox"><div class="toggle-track"></div><div class="toggle-thumb"></div></label>
          </div>
        </div>
      </div>
    </div>
  `;

  animateProgressBars();

  document.getElementById('markAllRead')?.addEventListener('click', () => {
    document.querySelectorAll('.notif-item.unread').forEach(el => el.classList.remove('unread'));
    document.querySelectorAll('.unread-dot').forEach(el => el.remove());
    document.querySelector('.nav-badge.new')?.remove();
  });

  container.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.dataset.tab;
      const list = document.getElementById('notifList');
      let filtered = DATA.notifications;
      if (tab === 'unread') filtered = DATA.notifications.filter(n => n.unread);
      else if (tab === 'leads') filtered = DATA.notifications.filter(n => n.title.toLowerCase().includes('lead'));
      else if (tab === 'analytics') filtered = DATA.notifications.filter(n => n.title.toLowerCase().includes('report') || n.title.toLowerCase().includes('analytics') || n.title.toLowerCase().includes('campaign'));
      if (list) list.innerHTML = filtered.map(n => notifItem(n)).join('') || '<div style="padding:24px;text-align:center;color:var(--text-3)">No notifications in this category</div>';
    });
  });

  container.classList.add('page-enter');
}

function notifItem(n) {
  return `
    <div class="notif-item ${n.unread ? 'unread' : ''}">
      <div class="notif-icon-wrap ${n.type}">${n.icon}</div>
      <div class="notif-body">
        <div class="notif-title">${n.title}</div>
        <div class="notif-desc">${n.desc}</div>
        <div class="notif-time">${n.time}</div>
      </div>
      ${n.unread ? '<div class="unread-dot"></div>' : ''}
    </div>
  `;
}

// ============================================
// PAGE: SETTINGS
// ============================================

let integrations = {
  instagram: 'connected',
  facebook: 'connected',
  linkedin: 'disconnected',
  google: 'disconnected',
};

function renderSettings(container) {
  container.innerHTML = `
    <div class="settings-tabs">
      <button class="settings-tab active" data-panel="profile">Profile</button>
      <button class="settings-tab" data-panel="integrations">Integrations</button>
      <button class="settings-tab" data-panel="notifications">Notifications</button>
      <button class="settings-tab" data-panel="security">Security</button>
    </div>

    <!-- Profile Panel -->
    <div class="settings-panel active" id="panel-profile">
      <div class="grid-2">
        <div class="card">
          <div class="section-title" style="margin-bottom:20px">Admin Profile</div>
          <!-- Live preview -->
          <div class="admin-profile-preview">
            <div class="admin-avatar-lg" id="previewAvatar">JD</div>
            <div>
              <div class="admin-preview-name"  id="previewName">John Doe</div>
              <div class="admin-preview-email" id="previewEmail">john@digitalagency.pro</div>
              <div class="admin-preview-role"  id="previewRole">● Admin</div>
            </div>
          </div>
          <div class="inline-alert" id="profileAlert"></div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <input type="text" id="adminNameInput" class="form-input" placeholder="Your full name">
            </div>
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input type="email" id="adminEmailInput" class="form-input" placeholder="your@email.com">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Company Name</label>
              <input type="text" id="adminCompanyInput" class="form-input" placeholder="Company name">
            </div>
            <div class="form-group">
              <label class="form-label">Role / Title</label>
              <input type="text" id="adminRoleInput" class="form-input" placeholder="e.g. Admin, Manager">
            </div>
          </div>
          <div class="form-row full">
            <div class="form-group">
              <label class="form-label">Bio</label>
              <textarea id="adminBioInput" class="form-input" rows="3" placeholder="Short bio about yourself or your agency..."></textarea>
            </div>
          </div>
          <div class="flex gap-8 mt-16">
            <button class="btn btn-primary" id="saveProfileBtn">💾 Save Profile</button>
            <button class="btn btn-secondary" id="discardProfileBtn">Discard</button>
          </div>
        </div>

        <div class="card">
          <div class="section-title" style="margin-bottom:20px">Company Logo</div>
          <div class="upload-area" id="settingsLogoUpload">
            <div class="upload-icon">🖼</div>
            <div class="upload-text">Click to upload logo</div>
            <div class="upload-hint">PNG, JPG, SVG up to 5MB</div>
          </div>
          <div class="divider"></div>
          <div class="section-title" style="margin-bottom:16px">Time Zone & Region</div>
          <div class="form-group" style="margin-bottom:12px">
            <label class="form-label">Time Zone</label>
            <select class="form-input">
              <option selected>UTC-5 (Eastern Time)</option>
              <option>UTC-8 (Pacific Time)</option>
              <option>UTC+0 (GMT)</option>
              <option>UTC+1 (CET)</option>
              <option>UTC+5:30 (IST)</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Currency</label>
            <select class="form-input">
              <option selected>USD ($)</option>
              <option>EUR (€)</option>
              <option>GBP (£)</option>
              <option>CAD (C$)</option>
            </select>
          </div>
          <button class="btn btn-primary mt-16" onclick="showSavedToast(this)">💾 Save Preferences</button>
        </div>
      </div>
    </div>

    <!-- Integrations Panel -->
    <div class="settings-panel" id="panel-integrations">
      <div class="grid-2">
        <div class="card">
          <div class="section-title" style="margin-bottom:20px">Social Media Connections</div>
          ${integrationCard('📸', 'Instagram Business', '#fce4ec', 'instagram', 'Connect your Instagram Business account to track leads and analytics.')}
          ${integrationCard('📘', 'Facebook Pages', '#e3f2fd', 'facebook', 'Connect your Facebook Page to monitor campaigns and messages.')}
          ${integrationCard('💼', 'LinkedIn Company', '#e3f0fb', 'linkedin', 'Link your LinkedIn Company Page to track B2B engagement.')}
        </div>
        <div class="card">
          <div class="section-title" style="margin-bottom:20px">Analytics & Tools</div>
          ${integrationCard('📊', 'Google Analytics', '#e8f5e9', 'google', 'Import website traffic data and track conversion goals.')}
          ${integrationCard('📧', 'Mailchimp', '#fff8e1', 'mailchimp', 'Sync leads automatically to your email marketing lists.')}
          ${integrationCard('💬', 'Slack Workspace', '#f3e8ff', 'slack', 'Receive real-time lead notifications in your Slack channels.')}
        </div>
      </div>
    </div>

    <!-- Notifications Panel -->
    <div class="settings-panel" id="panel-notifications">
      <div class="grid-2">
        <div class="card">
          <div class="section-title" style="margin-bottom:20px">Email Notifications</div>
          ${toggleRow('Email Reports', 'Receive weekly analytics reports via email', true)}
          ${toggleRow('Lead Notifications', 'Get notified when new leads come in', true)}
          ${toggleRow('Conversion Alerts', 'Alert when a lead converts to a client', true)}
          ${toggleRow('Weekly Analytics Report', 'Full weekly social media performance report', false)}
        </div>
        <div class="card">
          <div class="section-title" style="margin-bottom:20px">Platform Alerts</div>
          ${toggleRow('Social Media Alerts', 'New messages and comments from social platforms', true)}
          ${toggleRow('Campaign Milestones', 'Alert when campaigns hit performance goals', true)}
          ${toggleRow('Lead Score Updates', 'Notify when a lead score changes significantly', false)}
          ${toggleRow('Competitor Activity', 'Monitor competitor social media performance', false)}
        </div>
      </div>
    </div>

    <!-- Security Panel -->
    <div class="settings-panel" id="panel-security">
      <div class="grid-2">
        <!-- Password Management Card -->
        <div class="card">
          <div class="section-title mb-20" id="pwCardTitle">Set Password</div>
          <div class="inline-alert" id="pwAlert"></div>

          <!-- Current password (shown only when a password is already set) -->
          <div class="form-group mb-14" id="curPwGroup">
            <label class="form-label">Current Password</label>
            <div class="input-eye-wrap">
              <input type="password" class="form-input" id="curPwInput" placeholder="Enter current password">
              <button class="eye-btn" type="button" data-for="curPwInput">👁</button>
            </div>
          </div>

          <div class="form-group mb-14">
            <label class="form-label">New Password</label>
            <div class="input-eye-wrap">
              <input type="password" class="form-input" id="newPwInput" placeholder="At least 8 characters">
              <button class="eye-btn" type="button" data-for="newPwInput">👁</button>
            </div>
            <div class="pw-strength-row" id="pwBars">
              <div class="pw-bar"></div><div class="pw-bar"></div>
              <div class="pw-bar"></div><div class="pw-bar"></div>
            </div>
            <div class="pw-strength-text" id="pwStrLabel"></div>
          </div>

          <div class="form-group mb-20">
            <label class="form-label">Confirm Password</label>
            <div class="input-eye-wrap">
              <input type="password" class="form-input" id="conPwInput" placeholder="Repeat new password">
              <button class="eye-btn" type="button" data-for="conPwInput">👁</button>
            </div>
          </div>

          <button class="btn btn-primary" id="savePwBtn">🔒 Update Password</button>
          <span class="forgot-link" id="forgotLink">Forgot Password?</span>

          <!-- Forgot Password Panel -->
          <div class="forgot-panel" id="forgotPanel">
            <div style="font-size:13.5px;font-weight:700;color:var(--text);margin-bottom:14px">🔑 Reset Password</div>

            <!-- Step 1: Email verification -->
            <div id="fpStep1">
              <div style="font-size:12.5px;color:var(--text-3);margin-bottom:12px">Enter the admin email address registered to this account.</div>
              <div class="form-group mb-12">
                <label class="form-label">Admin Email</label>
                <input type="email" class="form-input" id="fpEmailInput" placeholder="your@email.com">
              </div>
              <div class="inline-alert" id="fpAlert"></div>
              <button class="btn btn-primary" id="sendCodeBtn">Send Recovery Code</button>
            </div>

            <!-- Step 2: Code + new password -->
            <div id="fpStep2" style="display:none">
              <div class="recovery-box">
                <div style="font-size:11px;color:var(--text-3);font-weight:500">Your recovery code</div>
                <div class="recovery-code-display" id="fpCodeDisplay">------</div>
                <div class="recovery-note">In production this code would be emailed to your address</div>
              </div>
              <div class="inline-alert" id="fpAlert2"></div>
              <div class="form-group mb-12">
                <label class="form-label">Enter Recovery Code</label>
                <input type="text" class="form-input" id="fpCodeInput" placeholder="6-digit code" maxlength="6" style="letter-spacing:4px;font-weight:700;font-size:16px">
              </div>
              <div class="form-group mb-12">
                <label class="form-label">New Password</label>
                <div class="input-eye-wrap">
                  <input type="password" class="form-input" id="fpNewPwInput" placeholder="At least 8 characters">
                  <button class="eye-btn" type="button" id="fpEyeNew">👁</button>
                </div>
              </div>
              <div class="form-group mb-16">
                <label class="form-label">Confirm Password</label>
                <input type="password" class="form-input" id="fpConPwInput" placeholder="Repeat password">
              </div>
              <div class="flex gap-8">
                <button class="btn btn-primary" id="resetPwBtn">✓ Reset Password</button>
                <button class="btn btn-secondary" id="backBtn">← Back</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 2FA + Sessions -->
        <div class="card">
          <div class="section-title" style="margin-bottom:20px">Two-Factor Authentication</div>
          ${toggleRow('2FA via Authenticator App', 'Use Google Authenticator or similar', false)}
          ${toggleRow('2FA via SMS', 'Receive OTP codes via text message', true)}
          <div class="divider"></div>
          <div class="section-title" style="margin-bottom:14px;margin-top:12px">Active Sessions</div>
          <div style="padding:14px;background:var(--surface2);border-radius:var(--r);margin-bottom:10px;border:1px solid var(--border)">
            <div style="font-size:13px;font-weight:600">🖥 MacBook Pro — Chrome</div>
            <div style="font-size:11.5px;color:var(--green);margin-top:2px">● Current session · Active now</div>
          </div>
          <div style="padding:14px;background:var(--surface2);border-radius:var(--r);border:1px solid var(--border)">
            <div style="font-size:13px;font-weight:600">📱 iPhone — Safari</div>
            <div style="font-size:11.5px;color:var(--text-3);margin-top:2px">Last active: 2 hours ago</div>
          </div>
          <button class="btn btn-danger mt-16" style="width:100%">Revoke All Other Sessions</button>
        </div>
      </div>
    </div>
  `;

  // Tab switching
  container.querySelectorAll('.settings-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      container.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
      container.querySelectorAll('.settings-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('panel-' + tab.dataset.panel)?.classList.add('active');
    });
  });

  // Integration buttons
  container.querySelectorAll('[data-integration]').forEach(btn => {
    btn.addEventListener('click', () => handleIntegration(btn));
  });

  // Admin profile + password management + logo upload
  initSettingsAdmin(container);
  initSettingsSecurity(container);
  initSettingsLogoUpload(container);

  container.classList.add('page-enter');
}

function integrationCard(icon, name, bg, id, desc) {
  const status = integrations[id] || 'disconnected';
  const isConnected = status === 'connected';
  return `
    <div class="integration-card">
      <div class="integration-icon" style="background:${bg}">${icon}</div>
      <div class="integration-info">
        <div class="integration-name">${name}</div>
        <div class="integration-status ${isConnected ? 'connected' : ''}">${isConnected ? '● Connected & Syncing' : '○ Not connected'}</div>
        <div style="font-size:11px;color:var(--text-3);margin-top:2px">${desc}</div>
      </div>
      <button class="connect-btn ${isConnected ? 'disconnect' : 'connect'}" data-integration="${id}">
        ${isConnected ? 'Disconnect' : 'Connect'}
      </button>
    </div>
  `;
}

function handleIntegration(btn) {
  const id = btn.dataset.integration;
  const card = btn.closest('.integration-card');
  const statusEl = card.querySelector('.integration-status');

  if (integrations[id] === 'connected') {
    integrations[id] = 'disconnected';
    btn.textContent = 'Connect';
    btn.className = 'connect-btn connect';
    btn.dataset.integration = id;
    statusEl.className = 'integration-status';
    statusEl.textContent = '○ Not connected';
  } else {
    // Simulate syncing
    btn.textContent = '↻ Syncing...';
    btn.className = 'connect-btn syncing';
    statusEl.textContent = '⏳ Connecting...';
    setTimeout(() => {
      integrations[id] = 'connected';
      btn.textContent = 'Disconnect';
      btn.className = 'connect-btn disconnect';
      btn.dataset.integration = id;
      statusEl.className = 'integration-status connected';
      statusEl.textContent = '● Connected & Syncing';
    }, 2000);
  }
}

function toggleRow(label, desc, checked) {
  return `
    <div class="toggle-row">
      <div class="toggle-info">
        <div class="toggle-label">${label}</div>
        <div class="toggle-desc">${desc}</div>
      </div>
      <label class="toggle-switch">
        <input type="checkbox" ${checked ? 'checked' : ''}>
        <div class="toggle-track"></div>
        <div class="toggle-thumb"></div>
      </label>
    </div>
  `;
}

// -- Toast notification --
window.showSavedToast = function(btn) {
  const orig = btn.textContent;
  btn.textContent = '✓ Saved!';
  btn.style.background = 'var(--green)';
  setTimeout(() => {
    btn.textContent = orig;
    btn.style.background = '';
  }, 2000);
};

// ============================================
// LEAD DRAWER
// ============================================

function openLeadDrawer(lead) {
  closeLeadDrawer();

  const statusMap = {
    new: { label: 'New', cls: 'badge-new' },
    contacted: { label: 'Contacted', cls: 'badge-contacted' },
    progress: { label: 'In Progress', cls: 'badge-progress' },
    proposal: { label: 'Proposal Sent', cls: 'badge-proposal' },
    won: { label: 'Converted', cls: 'badge-won' },
    lost: { label: 'Lost', cls: 'badge-lost' },
  };
  const platformMap = {
    instagram: { label: 'Instagram', cls: 'pb-instagram', icon: '📸' },
    facebook: { label: 'Facebook', cls: 'pb-facebook', icon: '📘' },
    linkedin: { label: 'LinkedIn', cls: 'pb-linkedin', icon: '💼' },
  };

  const st = statusMap[lead.status];
  const pl = platformMap[lead.platform];
  const initials = lead.name.split(' ').map(n => n[0]).join('');

  const convProb = { new: 15, contacted: 30, progress: 55, proposal: 72, won: 100, lost: 0 }[lead.status] || 15;
  const convColor = convProb >= 70 ? 'var(--green)' : convProb >= 40 ? 'var(--amber)' : convProb === 0 ? 'var(--red)' : 'var(--accent)';

  const timeline = [
    { dot: 'var(--accent)', text: `Lead arrived via ${pl.label}`, time: lead.date },
    { dot: 'var(--cyan)', text: 'Initial contact message sent', time: 'Jan 14, 2024' },
    { dot: 'var(--amber)', text: `Status updated: "${st.label}"`, time: 'Jan 15, 2024' },
  ];
  if (lead.status === 'won') timeline.push({ dot: 'var(--green)', text: '🎉 Contract signed — deal closed!', time: 'Jan 16, 2024' });
  if (lead.status === 'lost') timeline.push({ dot: 'var(--red)', text: 'Proposal declined — marked as lost', time: 'Jan 16, 2024' });

  const overlay = document.createElement('div');
  overlay.className = 'drawer-overlay';
  overlay.id = 'drawerOverlay';
  overlay.addEventListener('click', closeLeadDrawer);
  document.body.appendChild(overlay);

  const drawer = document.createElement('div');
  drawer.className = 'lead-drawer';
  drawer.id = 'leadDrawer';
  drawer.innerHTML = `
    <div class="drawer-top">
      <div class="drawer-top-row">
        <div class="drawer-avatar-lg" style="background:${lead.avatar}">${initials}</div>
        <div style="flex:1;min-width:0">
          <div class="drawer-name">${lead.name}</div>
          <div class="drawer-company">${lead.company}</div>
          <div class="drawer-email">${lead.email}</div>
        </div>
        <button class="drawer-close-btn" id="drawerCloseBtn">✕</button>
      </div>
      <div class="drawer-badge-row">
        <span class="status-badge ${st.cls}">${st.label}</span>
        <span class="platform-badge ${pl.cls}">${pl.icon} ${pl.label}</span>
      </div>
    </div>

    <div class="drawer-body">
      <div class="drawer-section">
        <div class="drawer-section-title">Deal Value</div>
        <div class="drawer-value-big">${fmtCurrency(lead.value)}</div>
        <div class="drawer-value-sub">${lead.service}</div>
      </div>

      <div class="drawer-section">
        <div class="drawer-section-title">Contact Details</div>
        <div class="drawer-info-grid">
          <div>
            <div class="drawer-info-label">Full Name</div>
            <div class="drawer-info-value">${lead.name}</div>
          </div>
          <div>
            <div class="drawer-info-label">Company</div>
            <div class="drawer-info-value">${lead.company}</div>
          </div>
          <div>
            <div class="drawer-info-label">Source Platform</div>
            <div class="drawer-info-value">${pl.icon} ${pl.label}</div>
          </div>
          <div>
            <div class="drawer-info-label">Date Added</div>
            <div class="drawer-info-value">${lead.date}</div>
          </div>
        </div>
      </div>

      <div class="drawer-section">
        <div class="drawer-section-title">Conversion Probability</div>
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:8px">
          <div style="font-size:26px;font-weight:800;color:${convColor}">${convProb}%</div>
          <div style="flex:1">
            <div class="progress-track" style="height:9px">
              <div class="progress-fill" data-width="${convProb}%" style="background:${convColor};width:0%;height:9px;border-radius:5px"></div>
            </div>
          </div>
        </div>
        <div style="font-size:11.5px;color:var(--text-3)">Based on current pipeline stage</div>
      </div>

      <div class="drawer-section">
        <div class="drawer-section-title">Activity Timeline</div>
        <div class="drawer-timeline">
          ${timeline.map(t => `
            <div class="drawer-tl-item">
              <div class="drawer-tl-dot" style="color:${t.dot}"></div>
              <div class="drawer-tl-content">
                <div class="drawer-tl-text">${t.text}</div>
                <div class="drawer-tl-time">${t.time}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <div class="drawer-actions">
      <button class="drawer-btn primary">✉ Message</button>
      <button class="drawer-btn secondary">✏ Edit</button>
      ${lead.status !== 'won' && lead.status !== 'lost'
        ? '<button class="drawer-btn secondary drawer-full-col">↑ Advance Stage</button>'
        : ''}
      ${lead.status === 'lost'
        ? '<button class="drawer-btn danger drawer-full-col">🗑 Remove Lead</button>'
        : ''}
    </div>
  `;

  document.body.appendChild(drawer);

  requestAnimationFrame(() => {
    overlay.classList.add('open');
    drawer.classList.add('open');
  });

  document.getElementById('drawerCloseBtn').addEventListener('click', closeLeadDrawer);

  setTimeout(() => {
    drawer.querySelectorAll('.progress-fill[data-width]').forEach(el => {
      el.style.width = el.dataset.width;
    });
  }, 120);
}

// ============================================
// AUTH — Storage helpers
// ============================================
function getUsers()          { return JSON.parse(localStorage.getItem('crm-users') || '[]'); }
function saveUsers(u)        { localStorage.setItem('crm-users', JSON.stringify(u)); }
function getSession()        { try { return JSON.parse(localStorage.getItem('crm-session')); } catch { return null; } }
function saveSession(email)  { localStorage.setItem('crm-session', JSON.stringify({ email })); }
function clearSession()      { localStorage.removeItem('crm-session'); }
function getCurrentUser() {
  const s = getSession();
  if (!s) return null;
  return getUsers().find(u => u.email === s.email) || null;
}
function updateCurrentUser(data) {
  const s = getSession();
  if (!s) return;
  const users = getUsers();
  const idx = users.findIndex(u => u.email === s.email);
  if (idx >= 0) { users[idx] = { ...users[idx], ...data }; saveUsers(users); }
}

// ============================================
// AUTH — initAuth: renders and wires the auth screen
// ============================================
let _authRecoveryCode = '';
let _authForgotEmail  = '';

function initAuth() {
  const screen = document.getElementById('auth-screen');
  screen.style.display = 'flex';
  document.getElementById('app').style.display = 'none';

  screen.innerHTML = `
    <div class="auth-brand">
      <div class="auth-brand-logo">
        <div class="auth-brand-icon">📊</div>
        <div>
          <div class="auth-brand-name">AgencyCRM</div>
          <div class="auth-brand-sub">Pro Dashboard</div>
        </div>
      </div>
      <div class="auth-brand-heading">Grow your agency with <span>data-driven</span> insights</div>
      <div class="auth-brand-tagline">Manage leads, track social analytics, and monitor your agency's performance — all in one place.</div>
      <div class="auth-features">
        <div class="auth-feature-item"><div class="auth-feature-icon">📈</div><div class="auth-feature-text">Real-time social media analytics</div></div>
        <div class="auth-feature-item"><div class="auth-feature-icon">🎯</div><div class="auth-feature-text">Lead pipeline &amp; conversion tracking</div></div>
        <div class="auth-feature-item"><div class="auth-feature-icon">📋</div><div class="auth-feature-text">Automated reports &amp; KPI goals</div></div>
        <div class="auth-feature-item"><div class="auth-feature-icon">🔒</div><div class="auth-feature-text">Secure multi-admin access</div></div>
      </div>
    </div>

    <div class="auth-form-panel">
      <div class="auth-card">
        <div class="auth-card-header">
          <div class="auth-card-title" id="authCardTitle">Welcome back</div>
          <div class="auth-card-sub"   id="authCardSub">Sign in to your dashboard</div>
        </div>
        <div class="auth-tabs" id="authTabs">
          <button class="auth-tab active" data-tab="login">Log In</button>
          <button class="auth-tab"        data-tab="signup">Sign Up</button>
        </div>
        <div class="auth-form-body">

          <!-- LOGIN -->
          <div class="auth-form-view active" id="authViewLogin">
            <div class="auth-inline-alert" id="loginAlert"></div>
            <div class="auth-input-group">
              <label class="auth-input-label">Email Address</label>
              <span class="auth-input-icon">✉</span>
              <input type="email" class="auth-input" id="loginEmail" placeholder="your@email.com" autocomplete="email">
            </div>
            <div class="auth-input-group">
              <label class="auth-input-label">Password</label>
              <span class="auth-input-icon">🔒</span>
              <input type="password" class="auth-input" id="loginPassword" placeholder="Enter your password" autocomplete="current-password">
              <button class="auth-input-eye" type="button" id="loginPwEye">👁</button>
            </div>
            <button class="auth-submit-btn" id="loginBtn">Log In →</button>
            <div style="text-align:center;margin-top:2px">
              <button class="auth-forgot-link" id="showForgotBtn">Forgot password?</button>
            </div>
          </div>

          <!-- SIGN UP -->
          <div class="auth-form-view" id="authViewSignup">
            <div class="auth-inline-alert" id="signupAlert"></div>
            <div class="auth-input-group">
              <label class="auth-input-label">Full Name</label>
              <span class="auth-input-icon">👤</span>
              <input type="text" class="auth-input" id="signupName" placeholder="Your full name" autocomplete="name">
            </div>
            <div class="auth-input-group">
              <label class="auth-input-label">Email Address</label>
              <span class="auth-input-icon">✉</span>
              <input type="email" class="auth-input" id="signupEmail" placeholder="your@email.com" autocomplete="email">
            </div>
            <div class="auth-input-group">
              <label class="auth-input-label">Password</label>
              <span class="auth-input-icon">🔒</span>
              <input type="password" class="auth-input" id="signupPassword" placeholder="At least 8 characters" autocomplete="new-password">
              <button class="auth-input-eye" type="button" id="signupPwEye">👁</button>
              <div class="auth-pw-bars" id="signupPwBars">
                <div class="auth-pw-bar"></div><div class="auth-pw-bar"></div>
                <div class="auth-pw-bar"></div><div class="auth-pw-bar"></div>
              </div>
              <div class="auth-pw-label" id="signupPwLabel"></div>
            </div>
            <div class="auth-input-group">
              <label class="auth-input-label">Confirm Password</label>
              <span class="auth-input-icon">🔒</span>
              <input type="password" class="auth-input" id="signupConfirm" placeholder="Repeat your password" autocomplete="new-password">
            </div>
            <button class="auth-submit-btn" id="signupBtn">Create Account →</button>
          </div>

          <!-- FORGOT PASSWORD -->
          <div class="auth-form-view" id="authViewForgot">
            <!-- Step 1: email -->
            <div class="auth-fp-step active" id="fpAuthStep1">
              <button class="auth-back-btn" id="fpBack1">← Back to Login</button>
              <div class="auth-inline-alert info" style="display:block;margin-bottom:14px">Enter the email linked to your admin account.</div>
              <div class="auth-inline-alert" id="fp1Alert"></div>
              <div class="auth-input-group">
                <label class="auth-input-label">Admin Email</label>
                <span class="auth-input-icon">✉</span>
                <input type="email" class="auth-input" id="fpAuthEmail" placeholder="your@email.com">
              </div>
              <button class="auth-submit-btn" id="fpSendBtn">Send Recovery Code</button>
            </div>
            <!-- Step 2: code -->
            <div class="auth-fp-step" id="fpAuthStep2">
              <button class="auth-back-btn" id="fpBack2">← Back</button>
              <div class="auth-recovery-box">
                <div style="font-size:11.5px;color:rgba(91,110,245,0.7);font-weight:500;margin-bottom:4px">Recovery code (demo — would be emailed)</div>
                <div class="auth-recovery-code" id="fpAuthCode">------</div>
                <div class="auth-recovery-note">Copy this code and enter it below</div>
              </div>
              <div class="auth-inline-alert" id="fp2Alert"></div>
              <div class="auth-input-group">
                <label class="auth-input-label">Enter Recovery Code</label>
                <input type="text" class="auth-input no-icon" id="fpAuthCodeIn" placeholder="000000" maxlength="6" style="letter-spacing:8px;font-weight:800;font-size:18px;text-align:center">
              </div>
              <button class="auth-submit-btn" id="fpVerifyBtn">Verify Code →</button>
            </div>
            <!-- Step 3: new password -->
            <div class="auth-fp-step" id="fpAuthStep3">
              <button class="auth-back-btn" id="fpBack3">← Back</button>
              <div class="auth-inline-alert success" style="display:block;margin-bottom:14px">Identity verified! Set your new password.</div>
              <div class="auth-inline-alert" id="fp3Alert"></div>
              <div class="auth-input-group">
                <label class="auth-input-label">New Password</label>
                <span class="auth-input-icon">🔒</span>
                <input type="password" class="auth-input" id="fpNewPw" placeholder="At least 8 characters">
                <button class="auth-input-eye" type="button" id="fpNewEye">👁</button>
              </div>
              <div class="auth-input-group">
                <label class="auth-input-label">Confirm Password</label>
                <span class="auth-input-icon">🔒</span>
                <input type="password" class="auth-input" id="fpConPw" placeholder="Repeat new password">
              </div>
              <button class="auth-submit-btn" id="fpResetBtn">Reset Password →</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  `;

  // ---- helpers ----
  const $ = (id) => document.getElementById(id);
  const authAlert = (id, type, msg) => {
    const el = $(id);
    if (!el) return;
    el.className = `auth-inline-alert ${type}`;
    el.textContent = msg;
    if (type === 'success') setTimeout(() => { el.className = 'auth-inline-alert'; el.textContent = ''; }, 3500);
  };
  const clearAuthAlert = (id) => {
    const el = $(id);
    if (el) { el.className = 'auth-inline-alert'; el.textContent = ''; }
  };
  const showView = (id) => {
    ['authViewLogin','authViewSignup','authViewForgot'].forEach(v => {
      const el = $(v);
      if (el) el.classList.toggle('active', v === id);
    });
    const titles = {
      authViewLogin:  ['Welcome back',      'Sign in to your dashboard'],
      authViewSignup: ['Create account',    'Join your team on AgencyCRM'],
      authViewForgot: ['Reset password',    'Recover access to your account'],
    };
    const [t, s] = titles[id] || ['', ''];
    if ($('authCardTitle')) $('authCardTitle').textContent = t;
    if ($('authCardSub'))   $('authCardSub').textContent   = s;
    // Show/hide tabs
    const tabs = $('authTabs');
    if (tabs) tabs.style.display = id === 'authViewForgot' ? 'none' : 'flex';
  };
  const showFpStep = (n) => {
    [1,2,3].forEach(i => {
      const el = $(`fpAuthStep${i}`);
      if (el) el.classList.toggle('active', i === n);
    });
  };
  const authPwStrength = (pw) => {
    const { score, label, cls } = getPasswordStrength(pw);
    document.querySelectorAll('#signupPwBars .auth-pw-bar').forEach((bar, i) => {
      bar.className = 'auth-pw-bar';
      if (pw && i < score) bar.classList.add(`filled-${cls}`);
    });
    const lbl = $('signupPwLabel');
    if (lbl) { lbl.textContent = pw ? label : ''; lbl.className = `auth-pw-label${pw ? ' ' + cls : ''}`; }
  };
  const toggleEye = (inputId, btn) => {
    const inp = $(inputId);
    if (!inp) return;
    const show = inp.type === 'password';
    inp.type = show ? 'text' : 'password';
    if (btn) btn.textContent = show ? '🙈' : '👁';
  };

  // ---- Tab switching ----
  screen.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      screen.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      showView(tab.dataset.tab === 'login' ? 'authViewLogin' : 'authViewSignup');
    });
  });

  // ---- Eye toggles ----
  $('loginPwEye')?.addEventListener('click',  () => toggleEye('loginPassword', $('loginPwEye')));
  $('signupPwEye')?.addEventListener('click', () => toggleEye('signupPassword', $('signupPwEye')));
  $('fpNewEye')?.addEventListener('click',    () => toggleEye('fpNewPw', $('fpNewEye')));

  // ---- Strength meter ----
  $('signupPassword')?.addEventListener('input', () => authPwStrength($('signupPassword').value));

  // ---- Forgot password navigation ----
  $('showForgotBtn')?.addEventListener('click', () => { showView('authViewForgot'); showFpStep(1); clearAuthAlert('fp1Alert'); });
  $('fpBack1')?.addEventListener('click', () => showView('authViewLogin'));
  $('fpBack2')?.addEventListener('click', () => showFpStep(1));
  $('fpBack3')?.addEventListener('click', () => showFpStep(2));

  // ---- Enter key on inputs ----
  $('loginPassword')?.addEventListener('keydown', e => { if (e.key === 'Enter') $('loginBtn').click(); });
  $('signupConfirm')?.addEventListener('keydown', e => { if (e.key === 'Enter') $('signupBtn').click(); });

  // ---- LOGIN ----
  $('loginBtn')?.addEventListener('click', () => {
    clearAuthAlert('loginAlert');
    const email = $('loginEmail')?.value.trim().toLowerCase();
    const pw    = $('loginPassword')?.value;
    if (!email) { authAlert('loginAlert', 'error', '✗ Enter your email address'); return; }
    if (!pw)    { authAlert('loginAlert', 'error', '✗ Enter your password'); return; }
    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === email);
    if (!user) { authAlert('loginAlert', 'error', '✗ No account found with that email'); return; }
    if (user.password !== pw) { authAlert('loginAlert', 'error', '✗ Incorrect password'); return; }
    saveSession(user.email);
    authAlert('loginAlert', 'success', '✓ Logged in! Loading dashboard…');
    setTimeout(() => {
      screen.style.display = 'none';
      initDashboard();
    }, 600);
  });

  // ---- SIGN UP ----
  $('signupBtn')?.addEventListener('click', () => {
    clearAuthAlert('signupAlert');
    const name    = $('signupName')?.value.trim();
    const email   = $('signupEmail')?.value.trim().toLowerCase();
    const pw      = $('signupPassword')?.value;
    const confirm = $('signupConfirm')?.value;
    if (!name)              { authAlert('signupAlert', 'error', '✗ Enter your full name'); return; }
    if (!email || !email.includes('@')) { authAlert('signupAlert', 'error', '✗ Enter a valid email address'); return; }
    if (pw.length < 8)     { authAlert('signupAlert', 'error', '✗ Password must be at least 8 characters'); return; }
    if (pw !== confirm)    { authAlert('signupAlert', 'error', '✗ Passwords do not match'); return; }
    const users = getUsers();
    if (users.find(u => u.email.toLowerCase() === email)) { authAlert('signupAlert', 'error', '✗ An account with this email already exists'); return; }
    const newUser = { name, email, password: pw, company: '', role: 'Admin', bio: '' };
    users.push(newUser);
    saveUsers(users);
    saveSession(email);
    authAlert('signupAlert', 'success', `✓ Welcome, ${name}! Setting up your dashboard…`);
    setTimeout(() => {
      screen.style.display = 'none';
      initDashboard();
    }, 800);
  });

  // ---- FORGOT PASSWORD ----
  $('fpSendBtn')?.addEventListener('click', () => {
    clearAuthAlert('fp1Alert');
    const email = $('fpAuthEmail')?.value.trim().toLowerCase();
    if (!email) { authAlert('fp1Alert', 'error', '✗ Enter your email address'); return; }
    const users = getUsers();
    const user  = users.find(u => u.email.toLowerCase() === email);
    if (!user) { authAlert('fp1Alert', 'error', '✗ No account found with that email'); return; }
    _authForgotEmail  = user.email;
    _authRecoveryCode = String(Math.floor(100000 + Math.random() * 900000));
    if ($('fpAuthCode')) $('fpAuthCode').textContent = _authRecoveryCode;
    showFpStep(2);
  });

  $('fpVerifyBtn')?.addEventListener('click', () => {
    clearAuthAlert('fp2Alert');
    const entered = $('fpAuthCodeIn')?.value.trim();
    if (!entered) { authAlert('fp2Alert', 'error', '✗ Enter the recovery code'); return; }
    if (entered !== _authRecoveryCode) { authAlert('fp2Alert', 'error', '✗ Incorrect code, try again'); return; }
    showFpStep(3);
  });

  $('fpResetBtn')?.addEventListener('click', () => {
    clearAuthAlert('fp3Alert');
    const pw  = $('fpNewPw')?.value;
    const con = $('fpConPw')?.value;
    if (pw.length < 8) { authAlert('fp3Alert', 'error', '✗ Password must be at least 8 characters'); return; }
    if (pw !== con)    { authAlert('fp3Alert', 'error', '✗ Passwords do not match'); return; }
    const users = getUsers();
    const idx = users.findIndex(u => u.email === _authForgotEmail);
    if (idx >= 0) { users[idx].password = pw; saveUsers(users); }
    authAlert('fp3Alert', 'success', '✓ Password reset! You can now log in.');
    setTimeout(() => { showView('authViewLogin'); showFpStep(1); _authRecoveryCode = ''; _authForgotEmail = ''; }, 2000);
  });
}

// ============================================
// ADMIN PROFILE MANAGEMENT
// ============================================

function getAdminData() {
  const user = getCurrentUser();
  if (user) {
    return {
      name:    user.name    || 'Admin',
      email:   user.email   || '',
      company: user.company || '',
      role:    user.role    || 'Admin',
      bio:     user.bio     || '',
    };
  }
  return { name: 'Admin', email: '', company: '', role: 'Admin', bio: '' };
}

function getInitials(name) {
  return (name || 'JD').trim().split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'JD';
}

function updateSidebarUser() {
  const d = getAdminData();
  const ini = getInitials(d.name);
  const el = (id) => document.getElementById(id);
  if (el('sidebarUserName'))   el('sidebarUserName').textContent  = d.name;
  if (el('sidebarUserRole'))   el('sidebarUserRole').textContent  = d.role;
  if (el('sidebarUserAvatar')) el('sidebarUserAvatar').textContent = ini;
  if (el('topbarAvatar'))      el('topbarAvatar').textContent     = ini;
  if (el('menuUserName'))      el('menuUserName').textContent     = d.name;
  if (el('menuUserEmail'))     el('menuUserEmail').textContent    = d.email || d.name;
}

function initAdminProfile() {
  updateSidebarUser();
}

// Password helpers — stored in the user's record
function getStoredPassword()  { const u = getCurrentUser(); return u ? (u.password || '') : ''; }
function setStoredPassword(p) { updateCurrentUser({ password: p }); }
function isPasswordSet()      { const u = getCurrentUser(); return !!(u && u.password); }

let _recoveryCode = '';
function generateRecoveryCode() {
  _recoveryCode = String(Math.floor(100000 + Math.random() * 900000));
  return _recoveryCode;
}

function getPasswordStrength(pw) {
  if (!pw) return { score: 0, label: '', cls: '' };
  let score = 0;
  if (pw.length >= 8)  score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { score: 1, label: 'Weak',   cls: 'weak' };
  if (score === 2) return { score: 2, label: 'Fair',   cls: 'fair' };
  if (score === 3) return { score: 3, label: 'Good',   cls: 'good' };
  return              { score: 4, label: 'Strong', cls: 'strong' };
}

function applyPasswordStrength(pw, barsId, labelId) {
  const { score, label, cls } = getPasswordStrength(pw);
  const barClasses = ['weak','fair','good','strong'];
  document.querySelectorAll(`#${barsId} .pw-bar`).forEach((bar, i) => {
    bar.className = 'pw-bar';
    if (pw && i < score) bar.classList.add(`filled-${cls}`);
  });
  const lbl = document.getElementById(labelId);
  if (lbl) { lbl.textContent = pw ? label : ''; lbl.className = `pw-strength-text ${pw ? cls : ''}`; }
}

function initSettingsAdmin(container) {
  const d    = getAdminData();
  const nameIn    = container.querySelector('#adminNameInput');
  const emailIn   = container.querySelector('#adminEmailInput');
  const companyIn = container.querySelector('#adminCompanyInput');
  const roleIn    = container.querySelector('#adminRoleInput');
  const bioIn     = container.querySelector('#adminBioInput');
  const avatarEl  = container.querySelector('#previewAvatar');
  const nameEl    = container.querySelector('#previewName');
  const emailEl   = container.querySelector('#previewEmail');
  const roleEl    = container.querySelector('#previewRole');
  const alert     = container.querySelector('#profileAlert');

  if (nameIn)    nameIn.value    = d.name;
  if (emailIn)   emailIn.value   = d.email;
  if (companyIn) companyIn.value = d.company;
  if (roleIn)    roleIn.value    = d.role;
  if (bioIn)     bioIn.value     = d.bio;

  function refreshPreview() {
    const n = nameIn?.value || d.name;
    const e = emailIn?.value || d.email;
    const r = roleIn?.value || d.role;
    if (avatarEl) avatarEl.textContent = getInitials(n);
    if (nameEl)   nameEl.textContent   = n;
    if (emailEl)  emailEl.textContent  = e;
    if (roleEl)   roleEl.textContent   = r || 'Admin';
  }
  refreshPreview();

  [nameIn, emailIn, roleIn].forEach(el => el?.addEventListener('input', refreshPreview));

  container.querySelector('#saveProfileBtn')?.addEventListener('click', () => {
    const name = nameIn?.value.trim();
    if (!name) { showAlert(alert, 'error', '✗ Name cannot be empty'); return; }
    updateCurrentUser({
      name,
      email:   emailIn?.value.trim()   || '',
      company: companyIn?.value.trim() || '',
      role:    roleIn?.value.trim()    || 'Admin',
      bio:     bioIn?.value.trim()     || '',
    });
    updateSidebarUser();
    showAlert(alert, 'success', '✓ Profile saved successfully!');
  });

  container.querySelector('#discardProfileBtn')?.addEventListener('click', () => {
    nameIn && (nameIn.value = d.name);
    emailIn && (emailIn.value = d.email);
    companyIn && (companyIn.value = d.company);
    roleIn && (roleIn.value = d.role);
    bioIn && (bioIn.value = d.bio);
    refreshPreview();
  });
}

function initSettingsSecurity(container) {
  const hasPw = isPasswordSet();
  const curGrp  = container.querySelector('#curPwGroup');
  const curIn   = container.querySelector('#curPwInput');
  const newIn   = container.querySelector('#newPwInput');
  const conIn   = container.querySelector('#conPwInput');
  const pwAlert = container.querySelector('#pwAlert');
  const cardTitle = container.querySelector('#pwCardTitle');

  if (curGrp) curGrp.style.display = hasPw ? '' : 'none';
  if (cardTitle) cardTitle.textContent = hasPw ? 'Change Password' : 'Set Password';

  // Strength bars
  newIn?.addEventListener('input', () => applyPasswordStrength(newIn.value, 'pwBars', 'pwStrLabel'));

  // Eye toggles
  container.querySelectorAll('.eye-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const inp = container.querySelector('#' + btn.dataset.for);
      if (!inp) return;
      inp.type = inp.type === 'password' ? 'text' : 'password';
      btn.textContent = inp.type === 'password' ? '👁' : '🙈';
    });
  });

  // Save password
  container.querySelector('#savePwBtn')?.addEventListener('click', () => {
    hideAlert(pwAlert);
    const curPw  = curIn?.value  || '';
    const newPw  = newIn?.value  || '';
    const conPw  = conIn?.value  || '';

    if (hasPw && curPw !== getStoredPassword()) {
      showAlert(pwAlert, 'error', '✗ Current password is incorrect'); return;
    }
    if (newPw.length < 8) {
      showAlert(pwAlert, 'error', '✗ Password must be at least 8 characters'); return;
    }
    if (newPw !== conPw) {
      showAlert(pwAlert, 'error', '✗ Passwords do not match'); return;
    }
    setStoredPassword(newPw);
    if (curIn) curIn.value = '';
    if (newIn) newIn.value = '';
    if (conIn) conIn.value = '';
    applyPasswordStrength('', 'pwBars', 'pwStrLabel');
    if (curGrp) curGrp.style.display = '';
    if (cardTitle) cardTitle.textContent = 'Change Password';
    showAlert(pwAlert, 'success', '✓ Password updated successfully!');
  });

  // Forgot password flow
  const forgotLink  = container.querySelector('#forgotLink');
  const forgotPanel = container.querySelector('#forgotPanel');
  const step1       = container.querySelector('#fpStep1');
  const step2       = container.querySelector('#fpStep2');
  const fpAlert     = container.querySelector('#fpAlert');
  const fpEmailIn   = container.querySelector('#fpEmailInput');
  const fpCodeDisp  = container.querySelector('#fpCodeDisplay');
  const fpCodeIn    = container.querySelector('#fpCodeInput');
  const fpNewIn     = container.querySelector('#fpNewPwInput');
  const fpConIn     = container.querySelector('#fpConPwInput');

  forgotLink?.addEventListener('click', () => {
    forgotPanel?.classList.toggle('open');
    if (step1) step1.style.display = '';
    if (step2) step2.style.display = 'none';
    if (fpAlert) hideAlert(fpAlert);
  });

  container.querySelector('#sendCodeBtn')?.addEventListener('click', () => {
    const entered = fpEmailIn?.value.trim().toLowerCase();
    const saved   = (getAdminData().email || '').toLowerCase();
    if (!entered) { showAlert(fpAlert, 'error', '✗ Enter your admin email'); return; }
    if (entered !== saved) { showAlert(fpAlert, 'error', '✗ Email does not match records'); return; }
    const code = generateRecoveryCode();
    if (fpCodeDisp) fpCodeDisp.textContent = code;
    if (step1) step1.style.display = 'none';
    if (step2) step2.style.display = '';
    hideAlert(fpAlert);
  });

  container.querySelector('#fpEyeNew')?.addEventListener('click', () => {
    const inp = fpNewIn; if (!inp) return;
    inp.type = inp.type === 'password' ? 'text' : 'password';
    container.querySelector('#fpEyeNew').textContent = inp.type === 'password' ? '👁' : '🙈';
  });

  container.querySelector('#backBtn')?.addEventListener('click', () => {
    if (step1) step1.style.display = '';
    if (step2) step2.style.display = 'none';
    if (fpCodeDisp) fpCodeDisp.textContent = '------';
    if (fpCodeIn)   fpCodeIn.value = '';
    if (fpNewIn)    fpNewIn.value  = '';
    if (fpConIn)    fpConIn.value  = '';
  });

  container.querySelector('#resetPwBtn')?.addEventListener('click', () => {
    hideAlert(fpAlert);
    const code   = fpCodeIn?.value.trim();
    const newPw  = fpNewIn?.value  || '';
    const conPw  = fpConIn?.value  || '';
    if (code !== _recoveryCode) { showAlert(fpAlert, 'error', '✗ Invalid recovery code'); return; }
    if (newPw.length < 8)        { showAlert(fpAlert, 'error', '✗ Password must be at least 8 characters'); return; }
    if (newPw !== conPw)         { showAlert(fpAlert, 'error', '✗ Passwords do not match'); return; }
    setStoredPassword(newPw);
    _recoveryCode = '';
    forgotPanel?.classList.remove('open');
    if (curGrp) curGrp.style.display = '';
    if (cardTitle) cardTitle.textContent = 'Change Password';
    showAlert(pwAlert, 'success', '✓ Password reset successfully! Please login with your new password.');
  });
}

function showAlert(el, type, msg) {
  if (!el) return;
  el.className = `inline-alert ${type} show`;
  el.textContent = msg;
  if (type === 'success') setTimeout(() => hideAlert(el), 3500);
}
function hideAlert(el) {
  if (!el) return;
  el.className = 'inline-alert';
  el.textContent = '';
}

function closeLeadDrawer() {
  const overlay = document.getElementById('drawerOverlay');
  const drawer = document.getElementById('leadDrawer');
  if (overlay) { overlay.classList.remove('open'); setTimeout(() => overlay.remove(), 350); }
  if (drawer) { drawer.classList.remove('open'); setTimeout(() => drawer.remove(), 350); }
}

// ============================================
// INIT
// ============================================

// ============================================
// LOGO UPLOAD
// ============================================
function initLogoUpload() {
  const zone    = document.getElementById('logoUploadZone');
  const input   = document.getElementById('logoUpload');
  const letters = document.getElementById('logoLetters');
  if (!zone || !input || !letters) return;

  function applyLogo(url) {
    zone.style.backgroundImage = `url(${url})`;
    zone.style.backgroundSize  = 'cover';
    zone.style.backgroundPosition = 'center';
    letters.style.display = 'none';
  }

  // Restore saved logo
  const saved = localStorage.getItem('crm-logo');
  if (saved) applyLogo(saved);

  // The zone is a <label> — clicking it naturally opens the file picker
  // because the input is nested inside. We just need to handle the change event.
  input.addEventListener('change', () => {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target.result;
      localStorage.setItem('crm-logo', url);
      applyLogo(url);
    };
    reader.readAsDataURL(file);
  });
}

function initSettingsLogoUpload(container) {
  const area = container.querySelector('#settingsLogoUpload');
  if (!area) return;

  // Create hidden file input
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.style.display = 'none';
  area.appendChild(input);

  area.addEventListener('click', () => input.click());

  input.addEventListener('change', () => {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target.result;
      localStorage.setItem('crm-logo', url);
      // Apply to sidebar logo
      const zone    = document.getElementById('logoUploadZone');
      const letters = document.getElementById('logoLetters');
      if (zone) {
        zone.style.backgroundImage    = `url(${url})`;
        zone.style.backgroundSize     = 'cover';
        zone.style.backgroundPosition = 'center';
      }
      if (letters) letters.style.display = 'none';
      // Update area to show preview
      area.style.backgroundImage    = `url(${url})`;
      area.style.backgroundSize     = 'cover';
      area.style.backgroundPosition = 'center';
      area.querySelector('.upload-icon') && (area.querySelector('.upload-icon').style.display = 'none');
      area.querySelector('.upload-text') && (area.querySelector('.upload-text').textContent = '✓ Logo uploaded');
      area.querySelector('.upload-hint') && (area.querySelector('.upload-hint').textContent = 'Click to change');
    };
    reader.readAsDataURL(file);
  });

  // Restore saved logo preview in settings
  const saved = localStorage.getItem('crm-logo');
  if (saved) {
    area.style.backgroundImage    = `url(${saved})`;
    area.style.backgroundSize     = 'cover';
    area.style.backgroundPosition = 'center';
    const icon = area.querySelector('.upload-icon');
    const text = area.querySelector('.upload-text');
    const hint = area.querySelector('.upload-hint');
    if (icon) icon.style.display = 'none';
    if (text) text.textContent = '✓ Logo uploaded';
    if (hint) hint.textContent = 'Click to change';
  }
}

// ============================================
// KPI GOAL RINGS
// ============================================
function drawKpiRing(canvasEl, pctTarget, color) {
  const size = canvasEl.width;
  const ctx  = canvasEl.getContext('2d');
  const cx = size / 2, cy = size / 2;
  const radius = size / 2 - 8;
  const lw = 7;
  const startAngle = -Math.PI / 2;
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const trackColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const start = performance.now();
  const dur   = 1300;

  function draw(now) {
    const p    = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    const pct  = pctTarget * ease;
    ctx.clearRect(0, 0, size, size);

    // Track
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = trackColor;
    ctx.lineWidth   = lw;
    ctx.lineCap     = 'round';
    ctx.stroke();

    // Arc
    if (pct > 0) {
      const grad = ctx.createLinearGradient(0, 0, size, size);
      const pair = BAR_GRADIENTS[color];
      grad.addColorStop(0, pair ? pair[0] : color);
      grad.addColorStop(1, pair ? pair[1] : color);
      ctx.beginPath();
      ctx.arc(cx, cy, radius, startAngle, startAngle + (pct / 100) * Math.PI * 2);
      ctx.strokeStyle = grad;
      ctx.lineWidth   = lw;
      ctx.lineCap     = 'round';
      ctx.stroke();
    }
    if (p < 1) requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
}

function renderKpiGoals(s) {
  const rev    = s.revenue;
  const revTgt = 153000;
  const lTgt   = 400;
  const cTgt   = 100;
  const goals  = [
    {
      id: 0, color: '#5b6ef5',
      label: 'Revenue Goal',
      actual: fmtCurrency(rev),
      target: fmtCurrency(revTgt),
      pct: Math.min(Math.round(rev / revTgt * 100), 100),
      trend: rev / revTgt >= 0.75 ? 'on-track' : rev / revTgt >= 0.5 ? 'warn' : 'behind',
      trendLabel: rev / revTgt >= 0.75 ? '↑ On track' : '⚠ Needs focus',
    },
    {
      id: 1, color: '#22c55e',
      label: 'Leads Target',
      actual: fmt(s.totalLeads),
      target: `${lTgt} leads`,
      pct: Math.min(Math.round(s.totalLeads / lTgt * 100), 100),
      trend: s.totalLeads / lTgt >= 0.75 ? 'on-track' : 'warn',
      trendLabel: s.totalLeads / lTgt >= 0.75 ? '↑ On track' : '⚠ Needs focus',
    },
    {
      id: 2, color: '#f59e0b',
      label: 'Conversions',
      actual: fmt(s.converted),
      target: `${cTgt} clients`,
      pct: Math.min(Math.round(s.converted / cTgt * 100), 100),
      trend: s.converted / cTgt >= 0.75 ? 'on-track' : s.converted / cTgt >= 0.5 ? 'warn' : 'behind',
      trendLabel: s.converted / cTgt >= 0.75 ? '↑ On track' : '⚠ Needs focus',
    },
  ];

  return `
    <div class="kpi-goals-wrap mb-24">
      <div class="section-header mb-16">
        <div>
          <div class="section-title">Monthly Goals</div>
          <div class="section-sub">Progress towards your May 2026 targets</div>
        </div>
      </div>
      <div class="kpi-grid">
        ${goals.map(g => `
          <div class="kpi-ring-card">
            <div class="kpi-ring-wrap">
              <canvas class="kpi-canvas" id="kpiRing${g.id}" width="80" height="80"></canvas>
              <div class="kpi-ring-pct">${g.pct}%</div>
            </div>
            <div class="kpi-ring-info">
              <div class="kpi-ring-label">${g.label}</div>
              <div class="kpi-ring-actual">${g.actual}</div>
              <div class="kpi-ring-target">of ${g.target}</div>
              <div class="kpi-ring-trend ${g.trend}">${g.trendLabel}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function initDashboard() {
  document.getElementById('app').style.display = 'flex';
  document.getElementById('auth-screen').style.display = 'none';

  setupChartDefaults();
  initTheme();
  initNav();
  initSidebar();
  initLogoUpload();
  initAdminProfile();
  initDateFilter();

  // Notification bell click
  document.getElementById('notifBtn')?.addEventListener('click', () => {
    navigate('notifications');
  });

  // Sidebar logout button
  document.querySelector('.logout-btn')?.addEventListener('click', () => {
    clearSession();
    document.getElementById('app').style.display = 'none';
    initAuth();
  });

  // Topbar avatar dropdown
  const avatarEl  = document.getElementById('topbarAvatar');
  const userMenu  = document.getElementById('topbarUserMenu');
  if (avatarEl && userMenu) {
    avatarEl.addEventListener('click', (e) => {
      e.stopPropagation();
      userMenu.classList.toggle('open');
    });
    document.addEventListener('click', () => userMenu.classList.remove('open'));
    userMenu.addEventListener('click', (e) => e.stopPropagation());

    document.getElementById('menuSettingsBtn')?.addEventListener('click', () => {
      userMenu.classList.remove('open');
      navigate('settings');
    });
    document.getElementById('menuSignOutBtn')?.addEventListener('click', () => {
      clearSession();
      document.getElementById('app').style.display = 'none';
      initAuth();
    });
  }

  // Determine initial page from hash
  const hash = window.location.hash.replace('#', '') || 'dashboard';
  navigate(hash);
}

function init() {
  if (getSession()) {
    initDashboard();
  } else {
    initAuth();
  }
}

// Wait for DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
