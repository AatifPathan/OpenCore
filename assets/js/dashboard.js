/* ============================================================
   OpenCore — Dashboard Page (API-driven)
   All data flows through the API layer.
   ============================================================ */
'use strict';

document.addEventListener('DOMContentLoaded', async () => {
  await Promise.allSettled([
    loadKPIs(),
    loadRecentContributions(),
    loadRecentApplications(),
    loadTopContributors(),
    loadNotifications(),
    loadDeadlines(),
    loadRepoActivity(),
    loadCharts(),
  ]);
});

async function loadKPIs() {
  const grid = document.getElementById('kpiGrid');
  if (!grid) return;
  grid.innerHTML = SkeletonLoader.repeat(SkeletonLoader.kpiCard, 4);
  try {
    const [{ records: repos }, { records: contributors }] = await Promise.all([
      RepositoryApi.getRepositories(),
      ContributorApi.getContributors(),
    ]);
    const openIssues = repos.reduce((s, r) => s + (r.openIssues || 0), 0);
    const badges     = contributors.reduce((s, c) => s + (c.badges || 0), 0);
    const kpis = [
      { label: 'Total Repositories',  value: repos.length,        trend: '+8 this month',   up: true,  color: 'blue',
        icon: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>' },
      { label: 'Active Contributors', value: contributors.length, trend: '+162 this month', up: true,  color: 'green',
        icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>' },
      { label: 'Open Issues',         value: openIssues,          trend: '-34 this month',  up: false, color: 'orange',
        icon: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>' },
      { label: 'Badges Awarded',      value: badges,              trend: '+97 this month',  up: true,  color: 'purple',
        icon: '<circle cx="12" cy="8" r="6"/><path d="M15.5 13.5 17 22l-5-3-5 3 1.5-8.5"/>' },
    ];
    grid.innerHTML = kpis.map(k => `
      <div class="kpi-card ${k.color}">
        <div class="kpi-icon ${k.color}">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${k.icon}</svg>
        </div>
        <div class="kpi-value">${formatNumber(k.value)}</div>
        <div class="kpi-label">${k.label}</div>
        <div class="kpi-trend ${k.up ? 'up' : 'down'}">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            ${k.up ? '<polyline points="18 15 12 9 6 15"/>' : '<polyline points="6 9 12 15 18 9"/>'}
          </svg>${k.trend}
        </div>
      </div>`).join('');
  } catch (err) {
    ErrorState.render(grid, { title: 'Failed to load KPIs', message: err.message, onRetry: loadKPIs });
  }
}

async function loadRecentContributions() {
  const wrap = document.getElementById('recentContributions');
  if (!wrap) return;
  wrap.innerHTML = '<div class="skeleton skeleton-text" style="margin-bottom:10px;width:100%"></div>'.repeat(5);
  try {
    const { records } = await ContributionApi.getContributions();
    const COLOR = { 'Pull Request': 'green', 'Review': 'blue', 'Issue Closed': 'purple' };
    const ACTION = { 'Pull Request': 'merged a pull request in', 'Review': 'reviewed a pull request in', 'Issue Closed': 'closed an issue in' };
    wrap.innerHTML = records.slice(0, 6).map(c => `
      <div class="activity-item">
        <div class="activity-dot ${COLOR[c.type] || 'blue'}"></div>
        <div class="activity-body">
          <div class="activity-text"><strong>${escapeHTML(c.user)}</strong> ${ACTION[c.type] || 'contributed to'} <strong>${escapeHTML(c.repo)}</strong></div>
          <div class="activity-meta text-xs text-muted mt-4">${escapeHTML(c.desc)}</div>
        </div>
        <div class="activity-time">${formatDate(c.date)}</div>
      </div>`).join('');
  } catch (err) {
    wrap.innerHTML = `<p class="text-sm text-muted">Failed to load contributions.</p>`;
  }
}

async function loadRecentApplications() {
  const tbody = document.getElementById('recentApplicationsBody');
  if (!tbody) return;
  tbody.innerHTML = SkeletonLoader.repeat(() => SkeletonLoader.tableRow(5), 4);
  try {
    const { records } = await ApplicationApi.getApplications();
    const STATUS = {
      pending:  '<span class="badge badge-warning">Pending</span>',
      approved: '<span class="badge badge-success">Approved</span>',
      rejected: '<span class="badge badge-danger">Rejected</span>',
    };
    tbody.innerHTML = records.slice(0, 5).map(a => `
      <tr>
        <td><div class="flex items-center gap-8">${avatarHTML(a.applicant, 'sm')}<span class="font-medium">${escapeHTML(a.applicant)}</span></div></td>
        <td class="text-secondary truncate" style="max-width:200px">${escapeHTML(a.issue)}</td>
        <td><span class="tag">${escapeHTML(a.repo)}</span></td>
        <td>${STATUS[a.status] || ''}</td>
        <td class="text-muted text-sm">${formatDate(a.appliedAt)}</td>
      </tr>`).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-muted text-sm" style="padding:16px 20px">Failed to load applications.</td></tr>`;
  }
}

async function loadTopContributors() {
  const wrap = document.getElementById('topContributors');
  if (!wrap) return;
  wrap.innerHTML = '<div class="skeleton skeleton-text" style="margin-bottom:12px;width:100%"></div>'.repeat(6);
  try {
    const { records } = await ContributorApi.getTopContributors(6);
    wrap.innerHTML = records.map((c, i) => `
      <div class="contributor-rank-item" onclick="window.location.href='contributor-profile.html?id=${escapeHTML(c.id)}'" style="cursor:pointer">
        <div class="rank-number ${i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : ''}">${i + 1}</div>
        ${avatarHTML(c.name, 'sm')}
        <div class="contributor-rank-info">
          <div class="contributor-rank-name">${escapeHTML(c.name)}</div>
          <div class="contributor-rank-meta">${escapeHTML(c.rank)} · ${c.contributions} contributions</div>
        </div>
        <div class="contributor-rank-score">${formatCompact(c.reputation)}</div>
      </div>`).join('');
  } catch (err) {
    wrap.innerHTML = `<p class="text-sm text-muted">Failed to load contributors.</p>`;
  }
}

function loadNotifications() {
  const wrap = document.getElementById('notifList');
  if (!wrap) return;
  const ICONS = {
    success: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    info:    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
    warning: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  };
  const CLR = { success: 'green', info: 'blue', warning: 'orange' };
  wrap.innerHTML = OpenCoreData.notifications.map(n => `
    <div class="notif-item ${!n.read ? 'unread' : ''}">
      <div class="notif-icon ${CLR[n.type]}">${ICONS[n.type] || ICONS.info}</div>
      <div class="notif-body">
        <div class="notif-text">${n.text}</div>
        <div class="notif-time">${timeAgo(n.time)}</div>
      </div>
    </div>`).join('');
}

function loadDeadlines() {
  const wrap = document.getElementById('deadlineList');
  if (!wrap) return;
  wrap.innerHTML = OpenCoreData.deadlines.map(d => {
    const { day, month } = splitDate(d.date);
    const left = daysUntil(d.date);
    const urgency = left <= 2 ? 'urgent' : left <= 6 ? 'soon' : 'ok';
    return `
      <div class="deadline-item">
        <div class="deadline-date"><div class="deadline-day">${day}</div><div class="deadline-month">${month}</div></div>
        <div class="deadline-info">
          <div class="deadline-title">${escapeHTML(d.title)}</div>
          <div class="deadline-sub">${escapeHTML(d.sub)}</div>
        </div>
        <div class="deadline-days-left ${urgency}">${left}d</div>
      </div>`;
  }).join('');
}

async function loadRepoActivity() {
  const wrap = document.getElementById('repoActivityList');
  if (!wrap) return;
  wrap.innerHTML = '<div class="skeleton skeleton-text" style="margin-bottom:16px;width:100%"></div>'.repeat(5);
  try {
    const { records } = await RepositoryApi.getRepositories();
    const active = [...records].sort((a, b) => b.openIssues - a.openIssues).slice(0, 5);
    const max = active[0]?.openIssues || 1;
    wrap.innerHTML = active.map(r => `
      <div class="repo-activity-item">
        <div class="repo-name">
          <a href="repository-details.html?id=${escapeHTML(r.id)}" style="text-decoration:none;color:inherit;font-weight:500">${escapeHTML(r.name)}</a>
          <span>${r.openIssues} issues</span>
        </div>
        <div class="progress"><div class="progress-bar" style="width:${Math.round((r.openIssues / max) * 100)}%"></div></div>
      </div>`).join('');
  } catch (err) {
    wrap.innerHTML = `<p class="text-sm text-muted">Failed to load repository activity.</p>`;
  }
}

function loadCharts() {
  const ctx1 = document.getElementById('contributionsChart');
  const ctx2 = document.getElementById('difficultyChart');
  if (ctx1) {
    new Chart(ctx1, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{ label: 'Contributions', data: [820, 932, 1010, 1180, 1340, 1520],
          borderColor: '#0057D9', backgroundColor: 'rgba(0,87,217,0.08)',
          tension: 0.4, fill: true, pointBackgroundColor: '#0057D9',
          pointBorderColor: '#fff', pointBorderWidth: 2, pointRadius: 4 }],
      },
      options: { responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { grid: { color: '#F0F3F8' }, ticks: { font: { family: 'Inter', size: 11 }, color: '#94A3B8' } },
          x: { grid: { display: false },   ticks: { font: { family: 'Inter', size: 11 }, color: '#94A3B8' } },
        }},
    });
  }
  if (ctx2) {
    new Chart(ctx2, {
      type: 'doughnut',
      data: { labels: ['Beginner', 'Intermediate', 'Advanced'],
        datasets: [{ data: [38, 35, 27], backgroundColor: ['#16A34A', '#D97706', '#DC2626'], borderWidth: 0 }] },
      options: { responsive: true, maintainAspectRatio: false, cutout: '70%',
        plugins: { legend: { position: 'bottom',
          labels: { font: { family: 'Inter', size: 11 }, color: '#475569', padding: 14, boxWidth: 10, usePointStyle: true } } } },
    });
  }
}

/* ── GitHub Sync Status widget ──────────────────────────── */
async function loadSyncStatus() {
  const wrap = document.getElementById('syncStatusDashboard');
  if (!wrap) return;
  wrap.innerHTML = '<div class="skeleton skeleton-text" style="margin:10px 8px;width:80%"></div>'.repeat(4);
  try {
    const { records } = await RepositoryApi.getRepositories();
    const sample = records.slice(0, 6);
    const STATUS_LABEL = { never: 'Never synced', success: 'Synced', error: 'Error', syncing: 'Syncing…' };
    wrap.innerHTML = sample.map(r => `
      <div style="display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid var(--color-border)">
        <span class="sync-status-dot ${r.syncStatus || 'never'}" style="flex-shrink:0"></span>
        <div style="flex:1;min-width:0">
          <div class="font-medium text-sm truncate">${escapeHTML(r.name)}</div>
          <div class="text-xs text-muted">${STATUS_LABEL[r.syncStatus] || 'Never synced'}${r.lastSynced ? ' · ' + timeAgo(r.lastSynced) : ''}</div>
        </div>
        ${GitHubSyncService.renderHealthBadge(r.healthScore)}
        <a href="repository-details.html?id=${escapeHTML(r.id)}" class="btn btn-sm btn-ghost">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </a>
      </div>`).join('');
  } catch (err) {
    wrap.innerHTML = `<p class="text-sm text-muted" style="padding:16px">Failed to load sync status.</p>`;
  }
}

// Hook into DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => loadSyncStatus());
