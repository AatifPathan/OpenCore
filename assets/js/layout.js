/* ============================================================
   OpenCore — Shared Layout (Sidebar + Topbar) Injection
   Keeps nav markup in one place across all 15 pages.
   ============================================================ */

const NAV_ITEMS = [
  { section: 'Overview', items: [
    { href: 'dashboard.html', label: 'Dashboard', icon: 'grid' },
  ]},
  { section: 'Organize', items: [
    { href: 'organizations.html', label: 'Organizations', icon: 'building' },
    { href: 'projects.html', label: 'Projects', icon: 'folder' },
    { href: 'repositories.html', label: 'Repositories', icon: 'repo' },
    { href: 'issues.html', label: 'Issues', icon: 'issue', badge: '968' },
  ]},
  { section: 'Community', items: [
    { href: 'contributors.html', label: 'Contributors', icon: 'users' },
    { href: 'applications.html', label: 'Applications', icon: 'inbox', badge: '12' },
    { href: 'contributions.html', label: 'Contributions', icon: 'check' },
    { href: 'mentors.html', label: 'Mentors', icon: 'star' },
  ]},
  { section: 'Recognition', items: [
    { href: 'skills.html', label: 'Skills', icon: 'tag' },
    { href: 'badges.html', label: 'Badges', icon: 'award' },
  ]},
  { section: 'Account', items: [
    { href: 'settings.html',      label: 'Settings',     icon: 'settings' },
    { href: 'settings.html#integrations', label: 'Integrations', icon: 'plug' },
  ]},
];

const NAV_ICONS = {
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  building: '<rect x="4" y="2" width="16" height="20" rx="1"/><line x1="9" y1="6" x2="9" y2="6"/><line x1="15" y1="6" x2="15" y2="6"/><line x1="9" y1="10" x2="9" y2="10"/><line x1="15" y1="10" x2="15" y2="10"/><line x1="9" y1="14" x2="9" y2="14"/><line x1="15" y1="14" x2="15" y2="14"/><line x1="9" y1="18" x2="15" y2="18"/>',
  folder: '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>',
  repo: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
  issue: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  inbox: '<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
  check: '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
  star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  tag: '<path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2.41 12.41A2 2 0 0 1 1.83 11V4a2 2 0 0 1 2-2h7a2 2 0 0 1 1.41.59l8.35 8.35a2 2 0 0 1 0 2.83z"/><line x1="7" y1="7" x2="7.01" y2="7"/>',
  award: '<circle cx="12" cy="8" r="6"/><path d="M15.5 13.5 17 22l-5-3-5 3 1.5-8.5"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  plug: '<path d="M18 6V4"/><path d="M6 6V4"/><path d="M18 14a6 6 0 0 1-12 0v-2h12z"/><path d="M6 6h12v4H6z"/>',
};

function renderSidebar(activePage) {
  const navHTML = NAV_ITEMS.map(group => `
    <div class="sidebar-section-label">${group.section}</div>
    ${group.items.map(item => `
      <a href="${item.href}" class="sidebar-item ${item.href === activePage ? 'active' : ''}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${NAV_ICONS[item.icon]}</svg>
        ${item.label}
        ${item.badge ? `<span class="sidebar-badge">${item.badge}</span>` : ''}
      </a>
    `).join('')}
  `).join('');

  return `
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="sidebar-logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg>
        </div>
        <div class="sidebar-brand">Open<span>Core</span></div>
      </div>
      <div class="sidebar-search">
        <input type="text" placeholder="Quick search...">
      </div>
      <nav class="sidebar-nav">${navHTML}</nav>
      <div class="sidebar-footer">
        <div class="sidebar-user" data-dropdown-toggle="sidebarUserMenu">
          <div class="sidebar-user-avatar" style="background:#0057D9">SC</div>
          <div class="sidebar-user-info">
            <div class="sidebar-user-name">Sarah Chen</div>
            <div class="sidebar-user-role">Maintainer</div>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2"><polyline points="9 18 15 12 9 6" transform="rotate(90 12 12)"/></svg>
        </div>
      </div>
    </aside>
    <div class="sidebar-overlay"></div>
  `;
}

function renderTopbar({ breadcrumb = [], showSearch = true } = {}) {
  const crumbHTML = breadcrumb.map((c, i) => {
    const isLast = i === breadcrumb.length - 1;
    return `${i > 0 ? '<span class="sep">/</span>' : ''}${isLast ? `<span class="current">${c}</span>` : `<a href="#">${c}</a>`}`;
  }).join('');

  return `
    <header class="topbar">
      <div class="topbar-menu-btn" role="button" aria-label="Toggle navigation menu">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </div>
      <div class="topbar-breadcrumb">${crumbHTML}</div>
      <div class="topbar-right">
        ${showSearch ? `
        <div class="topbar-search">
          <span class="topbar-search-icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></span>
          <input type="text" placeholder="Search OpenCore...">
        </div>` : ''}
        <div class="dropdown">
          <div class="topbar-icon-btn" data-dropdown-toggle="topbarNotifMenu" aria-label="Notifications">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <span class="notif-dot"></span>
          </div>
          <div class="dropdown-menu hidden" id="topbarNotifMenu" style="width:320px">
            <div class="dropdown-label">Notifications</div>
            <div id="topbarNotifList" style="max-height:320px;overflow-y:auto;padding:0 4px"></div>
            <div class="dropdown-divider"></div>
            <a href="dashboard.html" class="dropdown-item" style="justify-content:center;color:var(--color-primary)">View all notifications</a>
          </div>
        </div>
        <div class="dropdown">
          <div class="topbar-avatar" data-dropdown-toggle="topbarUserMenu">SC</div>
          <div class="dropdown-menu hidden" id="topbarUserMenu">
            <div class="dropdown-label">Sarah Chen</div>
            <a href="contributor-profile.html" class="dropdown-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              My Profile
            </a>
            <a href="settings.html" class="dropdown-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              Settings
            </a>
            <div class="dropdown-divider"></div>
            <a href="index.html" class="dropdown-item danger">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Log Out
            </a>
          </div>
        </div>
      </div>
    </header>
  `;
}

function mountLayout(activePage, topbarOpts) {
  const sidebarMount = document.getElementById('sidebarMount');
  const topbarMount = document.getElementById('topbarMount');
  if (sidebarMount) sidebarMount.innerHTML = renderSidebar(activePage);
  if (topbarMount) topbarMount.innerHTML = renderTopbar(topbarOpts);

  // populate topbar notification dropdown with shared data
  const notifList = document.getElementById('topbarNotifList');
  if (notifList && window.OpenCoreData) {
    const colorMap = { success: 'green', info: 'blue', warning: 'orange' };
    const icons = {
      success: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
      info: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
      warning: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    };
    notifList.innerHTML = OpenCoreData.notifications.slice(0, 4).map(n => `
      <div class="dropdown-item" style="align-items:flex-start;white-space:normal;cursor:default">
        <span style="color:var(--color-${n.type === 'success' ? 'success' : n.type === 'warning' ? 'warning' : 'primary'});margin-top:1px">${icons[n.type]}</span>
        <span style="font-size:var(--text-sm);line-height:1.4">${n.text}<br><span style="color:var(--color-text-muted);font-size:var(--text-xs)">${timeAgo(n.time)}</span></span>
      </div>
    `).join('');
  }

  // Init collapsible sidebar if service is loaded
  if (typeof initCollapsibleSidebar === 'function') {
    initCollapsibleSidebar();
  }
}
