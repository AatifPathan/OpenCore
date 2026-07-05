/* ============================================================
   OpenCore — Core Application Script
   Shared across all pages: sidebar, topbar, toasts, modals, data
   ============================================================ */

/* ──────────────────────────────────────────────────────────
   DUMMY DATA STORE — shared "backend" for the whole prototype
   ────────────────────────────────────────────────────────── */
const OpenCoreData = {
  currentUser: {
    name: 'Sarah Chen',
    role: 'Maintainer',
    email: 'sarah.chen@opencore.dev',
    avatarColor: '#0057D9'
  },

  organizations: [
    { id: 'org-1', name: 'Mozilla Foundation', handle: '@mozilla', description: 'Building a better, open web for everyone through open-source software.', repos: 24, contributors: 1840, projects: 6, verified: true },
    { id: 'org-2', name: 'Apache Software Foundation', handle: '@apache', description: 'Providing software for the public good, governed by an open, collaborative community.', repos: 41, contributors: 3200, projects: 12, verified: true },
    { id: 'org-3', name: 'CNCF', handle: '@cncf', description: 'Cloud Native Computing Foundation — fostering a sustainable ecosystem for cloud native software.', repos: 18, contributors: 2150, projects: 9, verified: true },
    { id: 'org-4', name: 'FreeCodeCamp', handle: '@freecodecamp', description: 'Learn to code for free, build projects, and earn certifications.', repos: 9, contributors: 980, projects: 4, verified: true },
    { id: 'org-5', name: 'Open Web Foundation', handle: '@openweb', description: 'Advocating for open standards and specifications on the web.', repos: 7, contributors: 410, projects: 3, verified: false },
    { id: 'org-6', name: 'PyData', handle: '@pydata', description: 'Open-source tools for data analysis in the Python scientific stack.', repos: 15, contributors: 1120, projects: 5, verified: true },
  ],

  repositories: [
    { id: 'repo-1', name: 'firefox-devtools', org: 'Mozilla Foundation', orgId: 'org-1', description: 'Developer tools front-end for Firefox, including the inspector, console, and debugger.', stars: 4820, forks: 612, watchers: 312, openIssues: 47, language: 'JavaScript', difficulty: 'Intermediate', visibility: 'Public', status: 'Active', tags: ['devtools', 'browser', 'frontend'] },
    { id: 'repo-2', name: 'kafka-connect', org: 'Apache Software Foundation', orgId: 'org-2', description: 'Scalable and reliable streaming data pipeline connector framework for Apache Kafka.', stars: 9120, forks: 1840, watchers: 590, openIssues: 132, language: 'Java', difficulty: 'Advanced', visibility: 'Public', status: 'Active', tags: ['streaming', 'data', 'kafka'] },
    { id: 'repo-3', name: 'envoy-proxy', org: 'CNCF', orgId: 'org-3', description: 'Cloud-native high-performance edge/middle/service proxy written in C++.', stars: 23400, forks: 4210, watchers: 980, openIssues: 218, language: 'C++', difficulty: 'Advanced', visibility: 'Public', status: 'Active', tags: ['networking', 'proxy', 'cloud-native'] },
    { id: 'repo-4', name: 'fcc-curriculum', org: 'FreeCodeCamp', orgId: 'org-4', description: 'Curriculum source for freeCodeCamp.org coding challenges and certifications.', stars: 7650, forks: 9800, watchers: 420, openIssues: 89, language: 'JavaScript', difficulty: 'Beginner', visibility: 'Public', status: 'Active', tags: ['education', 'curriculum'] },
    { id: 'repo-5', name: 'pandas-core', org: 'PyData', orgId: 'org-6', description: 'Flexible and powerful data analysis / manipulation library for Python.', stars: 41200, forks: 17600, watchers: 1410, openIssues: 312, language: 'Python', difficulty: 'Intermediate', visibility: 'Public', status: 'Active', tags: ['data-science', 'python', 'analysis'] },
    { id: 'repo-6', name: 'helm-charts', org: 'CNCF', orgId: 'org-3', description: 'Curated application definitions for Kubernetes Helm package manager.', stars: 5300, forks: 6200, watchers: 280, openIssues: 64, language: 'Go', difficulty: 'Intermediate', visibility: 'Public', status: 'Active', tags: ['kubernetes', 'helm', 'devops'] },
    { id: 'repo-7', name: 'rust-analyzer-lsp', org: 'Open Web Foundation', orgId: 'org-5', description: 'A Rust compiler front-end for IDEs, providing language server protocol support.', stars: 12800, forks: 1080, watchers: 410, openIssues: 156, language: 'Rust', difficulty: 'Advanced', visibility: 'Public', status: 'Active', tags: ['rust', 'lsp', 'tooling'] },
    { id: 'repo-8', name: 'web-standards-spec', org: 'Open Web Foundation', orgId: 'org-5', description: 'Draft specifications for emerging open web standards and proposals.', stars: 980, forks: 210, watchers: 95, openIssues: 28, language: 'JavaScript', difficulty: 'Beginner', visibility: 'Public', status: 'Archived', tags: ['standards', 'spec'] },
    { id: 'repo-9', name: 'maven-build-plugin', org: 'Apache Software Foundation', orgId: 'org-2', description: 'Build automation plugin extending Maven lifecycle for Java enterprise projects.', stars: 2140, forks: 980, watchers: 140, openIssues: 41, language: 'Java', difficulty: 'Intermediate', visibility: 'Public', status: 'Active', tags: ['build', 'java', 'maven'] },
    { id: 'repo-10', name: 'numpy-extensions', org: 'PyData', orgId: 'org-6', description: 'Extended array operations and numerical computing extensions for NumPy.', stars: 6720, forks: 1320, watchers: 380, openIssues: 73, language: 'Python', difficulty: 'Advanced', visibility: 'Public', status: 'Active', tags: ['numpy', 'scientific-computing'] },
    { id: 'repo-11', name: 'fcc-api', org: 'FreeCodeCamp', orgId: 'org-4', description: 'Backend API services powering freeCodeCamp learning platform features.', stars: 1890, forks: 940, watchers: 110, openIssues: 35, language: 'JavaScript', difficulty: 'Intermediate', visibility: 'Private', status: 'Active', tags: ['api', 'backend'] },
    { id: 'repo-12', name: 'thunderbird-ui', org: 'Mozilla Foundation', orgId: 'org-1', description: 'User interface components for the Thunderbird email client.', stars: 1240, forks: 380, watchers: 160, openIssues: 52, language: 'JavaScript', difficulty: 'Beginner', visibility: 'Public', status: 'Active', tags: ['email', 'ui', 'desktop'] },
  ],

  issues: [
    { id: 'iss-1', title: 'Fix memory leak in inspector panel re-renders', repo: 'firefox-devtools', repoId: 'repo-1', status: 'open', difficulty: 'Intermediate', labels: ['bug', 'performance'], applicants: 6, createdAt: '2026-06-18', assignee: null, points: 40 },
    { id: 'iss-2', title: 'Add dark mode support to console output formatting', repo: 'firefox-devtools', repoId: 'repo-1', status: 'in-progress', difficulty: 'Beginner', labels: ['enhancement', 'ui'], applicants: 12, createdAt: '2026-06-10', assignee: 'Marcus Johnson', points: 20 },
    { id: 'iss-3', title: 'Implement exactly-once semantics for sink connectors', repo: 'kafka-connect', repoId: 'repo-2', status: 'open', difficulty: 'Advanced', labels: ['feature', 'core'], applicants: 3, createdAt: '2026-06-22', assignee: null, points: 80 },
    { id: 'iss-4', title: 'Improve error messages for malformed connector configs', repo: 'kafka-connect', repoId: 'repo-2', status: 'open', difficulty: 'Beginner', labels: ['good-first-issue', 'docs'], applicants: 18, createdAt: '2026-06-25', assignee: null, points: 15 },
    { id: 'iss-5', title: 'Add HTTP/3 support to listener configuration', repo: 'envoy-proxy', repoId: 'repo-3', status: 'open', difficulty: 'Advanced', labels: ['feature', 'networking'], applicants: 4, createdAt: '2026-06-15', assignee: null, points: 90 },
    { id: 'iss-6', title: 'Update curriculum links for deprecated JS challenges', repo: 'fcc-curriculum', repoId: 'repo-4', status: 'closed', difficulty: 'Beginner', labels: ['good-first-issue', 'content'], applicants: 9, createdAt: '2026-05-28', assignee: 'Priya Patel', points: 10 },
    { id: 'iss-7', title: 'Optimize groupby performance for large categorical data', repo: 'pandas-core', repoId: 'repo-5', status: 'in-progress', difficulty: 'Advanced', labels: ['performance'], applicants: 7, createdAt: '2026-06-12', assignee: 'Wei Zhang', points: 70 },
    { id: 'iss-8', title: 'Fix Helm chart values schema validation error', repo: 'helm-charts', repoId: 'repo-6', status: 'open', difficulty: 'Intermediate', labels: ['bug'], applicants: 5, createdAt: '2026-06-24', assignee: null, points: 35 },
    { id: 'iss-9', title: 'Write integration tests for proc-macro expansion', repo: 'rust-analyzer-lsp', repoId: 'repo-7', status: 'open', difficulty: 'Advanced', labels: ['testing'], applicants: 2, createdAt: '2026-06-20', assignee: null, points: 60 },
    { id: 'iss-10', title: 'Add JSDoc comments to maven-plugin public API', repo: 'maven-build-plugin', repoId: 'repo-9', status: 'open', difficulty: 'Beginner', labels: ['good-first-issue', 'docs'], applicants: 14, createdAt: '2026-06-26', assignee: null, points: 12 },
  ],

  contributors: [
    { id: 'c-1', name: 'Ava Martinez', handle: '@avamartinez', rank: 'Diamond', reputation: 9840, skills: ['Python', 'ML', 'Data Eng'], availability: 'available', contributions: 142, badges: 18, location: 'Austin, TX', joined: '2023-02-14' },
    { id: 'c-2', name: 'Liam Okafor', handle: '@liamokafor', rank: 'Platinum', reputation: 7210, skills: ['Go', 'Kubernetes', 'DevOps'], availability: 'busy', contributions: 98, badges: 13, location: 'Lagos, NG', joined: '2023-06-01' },
    { id: 'c-3', name: 'Priya Patel', handle: '@priyapatel', rank: 'Diamond', reputation: 10240, skills: ['JavaScript', 'React', 'Accessibility'], availability: 'available', contributions: 168, badges: 21, location: 'Toronto, CA', joined: '2022-11-09' },
    { id: 'c-4', name: 'Marcus Johnson', handle: '@marcusj', rank: 'Gold', reputation: 4320, skills: ['TypeScript', 'UI/UX'], availability: 'available', contributions: 56, badges: 9, location: 'Atlanta, GA', joined: '2024-01-22' },
    { id: 'c-5', name: 'Wei Zhang', handle: '@weizhang', rank: 'Platinum', reputation: 8120, skills: ['Python', 'Pandas', 'Statistics'], availability: 'unavailable', contributions: 113, badges: 16, location: 'Singapore', joined: '2023-04-18' },
    { id: 'c-6', name: 'Sofia Rossi', handle: '@sofiarossi', rank: 'Gold', reputation: 3980, skills: ['Rust', 'Systems'], availability: 'busy', contributions: 47, badges: 8, location: 'Milan, IT', joined: '2024-03-05' },
    { id: 'c-7', name: 'Daniel Kim', handle: '@danielkim', rank: 'Silver', reputation: 2140, skills: ['Java', 'Spring'], availability: 'available', contributions: 29, badges: 5, location: 'Seoul, KR', joined: '2024-09-12' },
    { id: 'c-8', name: 'Elena Petrova', handle: '@elenap', rank: 'Platinum', reputation: 7650, skills: ['C++', 'Networking'], availability: 'available', contributions: 104, badges: 15, location: 'Berlin, DE', joined: '2023-05-30' },
    { id: 'c-9', name: 'Noah Williams', handle: '@noahw', rank: 'Bronze', reputation: 980, skills: ['JavaScript', 'Docs'], availability: 'available', contributions: 11, badges: 3, location: 'Manchester, UK', joined: '2025-02-19' },
    { id: 'c-10', name: 'Isabella Garcia', handle: '@isabellag', rank: 'Gold', reputation: 4560, skills: ['Go', 'gRPC'], availability: 'busy', contributions: 61, badges: 10, location: 'Mexico City, MX', joined: '2024-02-08' },
    { id: 'c-11', name: 'Ethan Brooks', handle: '@ethanb', rank: 'Silver', reputation: 1840, skills: ['Python', 'Testing'], availability: 'available', contributions: 22, badges: 4, location: 'Denver, CO', joined: '2024-11-03' },
    { id: 'c-12', name: 'Mei Lin', handle: '@meilin', rank: 'Diamond', reputation: 11020, skills: ['Kubernetes', 'Go', 'Cloud'], availability: 'available', contributions: 189, badges: 24, location: 'Shanghai, CN', joined: '2022-08-21' },
  ],

  applications: [
    { id: 'app-1', applicant: 'Ethan Brooks', issue: 'Improve error messages for malformed connector configs', repo: 'kafka-connect', status: 'pending', appliedAt: '2026-06-27', skillMatch: 82 },
    { id: 'app-2', applicant: 'Noah Williams', issue: 'Add JSDoc comments to maven-plugin public API', repo: 'maven-build-plugin', status: 'pending', appliedAt: '2026-06-26', skillMatch: 64 },
    { id: 'app-3', applicant: 'Daniel Kim', issue: 'Fix Helm chart values schema validation error', repo: 'helm-charts', status: 'approved', appliedAt: '2026-06-21', skillMatch: 91 },
    { id: 'app-4', applicant: 'Sofia Rossi', issue: 'Write integration tests for proc-macro expansion', repo: 'rust-analyzer-lsp', status: 'approved', appliedAt: '2026-06-19', skillMatch: 95 },
    { id: 'app-5', applicant: 'Isabella Garcia', issue: 'Add HTTP/3 support to listener configuration', repo: 'envoy-proxy', status: 'rejected', appliedAt: '2026-06-16', skillMatch: 48 },
    { id: 'app-6', applicant: 'Elena Petrova', issue: 'Implement exactly-once semantics for sink connectors', repo: 'kafka-connect', status: 'pending', appliedAt: '2026-06-23', skillMatch: 88 },
    { id: 'app-7', applicant: 'Marcus Johnson', issue: 'Add dark mode support to console output formatting', repo: 'firefox-devtools', status: 'approved', appliedAt: '2026-06-09', skillMatch: 90 },
    { id: 'app-8', applicant: 'Priya Patel', issue: 'Update curriculum links for deprecated JS challenges', repo: 'fcc-curriculum', status: 'approved', appliedAt: '2026-05-27', skillMatch: 97 },
  ],

  badges: [
    { id: 'b-1', name: 'First Contribution', desc: 'Made your first merged pull request', icon: '🌱', tier: 'bronze', earned: true },
    { id: 'b-2', name: 'Bug Hunter', desc: 'Fixed 10+ confirmed bugs', icon: '🐞', tier: 'silver', earned: true },
    { id: 'b-3', name: 'Code Reviewer', desc: 'Reviewed 25+ pull requests', icon: '🔍', tier: 'silver', earned: true },
    { id: 'b-4', name: 'Documentation Hero', desc: 'Authored 15+ documentation pages', icon: '📚', tier: 'gold', earned: true },
    { id: 'b-5', name: 'Streak Master', desc: 'Contributed for 30 consecutive days', icon: '🔥', tier: 'gold', earned: true },
    { id: 'b-6', name: 'Mentor', desc: 'Successfully mentored 5 new contributors', icon: '🎓', tier: 'gold', earned: false },
    { id: 'b-7', name: 'Security Champion', desc: 'Resolved a critical security vulnerability', icon: '🛡️', tier: 'platinum', earned: false },
    { id: 'b-8', name: 'Performance Wizard', desc: 'Improved benchmark performance by 50%+', icon: '⚡', tier: 'platinum', earned: true },
    { id: 'b-9', name: 'Community Pillar', desc: 'Helped 100+ contributors in discussions', icon: '🏛️', tier: 'diamond', earned: false },
    { id: 'b-10', name: 'Top Contributor', desc: 'Ranked top 10 contributor for a quarter', icon: '🏆', tier: 'diamond', earned: true },
  ],

  skills: [
    { id: 's-1', name: 'JavaScript', icon: '🟨', contributors: 1240, openIssues: 89, category: 'Language' },
    { id: 's-2', name: 'Python', icon: '🐍', contributors: 980, openIssues: 64, category: 'Language' },
    { id: 's-3', name: 'Go', icon: '🐹', contributors: 520, openIssues: 41, category: 'Language' },
    { id: 's-4', name: 'Rust', icon: '🦀', contributors: 410, openIssues: 38, category: 'Language' },
    { id: 's-5', name: 'Kubernetes', icon: '☸️', contributors: 690, openIssues: 52, category: 'DevOps' },
    { id: 's-6', name: 'React', icon: '⚛️', contributors: 870, openIssues: 47, category: 'Framework' },
    { id: 's-7', name: 'Machine Learning', icon: '🤖', contributors: 540, openIssues: 33, category: 'Domain' },
    { id: 's-8', name: 'Accessibility', icon: '♿', contributors: 210, openIssues: 22, category: 'Domain' },
  ],

  mentors: [
    { id: 'm-1', name: 'Ava Martinez', title: 'Senior ML Maintainer', mentees: 8, sessionsHeld: 64, rating: 4.9, skills: ['Python', 'ML'] },
    { id: 'm-2', name: 'Priya Patel', title: 'Frontend Lead Mentor', mentees: 12, sessionsHeld: 98, rating: 5.0, skills: ['React', 'Accessibility'] },
    { id: 'm-3', name: 'Mei Lin', title: 'Cloud Infrastructure Mentor', mentees: 10, sessionsHeld: 81, rating: 4.8, skills: ['Kubernetes', 'Go'] },
    { id: 'm-4', name: 'Elena Petrova', title: 'Systems Programming Mentor', mentees: 6, sessionsHeld: 52, rating: 4.9, skills: ['C++', 'Networking'] },
    { id: 'm-5', name: 'Wei Zhang', title: 'Data Engineering Mentor', mentees: 9, sessionsHeld: 70, rating: 4.7, skills: ['Pandas', 'Statistics'] },
    { id: 'm-6', name: 'Liam Okafor', title: 'DevOps & Platform Mentor', mentees: 7, sessionsHeld: 59, rating: 4.8, skills: ['Go', 'DevOps'] },
  ],

  notifications: [
    { id: 'n-1', type: 'success', text: '<strong>Marcus Johnson</strong> merged your pull request in firefox-devtools', time: '2026-06-29T14:20:00', read: false },
    { id: 'n-2', type: 'info', text: 'New issue matching your skills posted in kafka-connect', time: '2026-06-29T10:05:00', read: false },
    { id: 'n-3', type: 'success', text: 'You earned the <strong>Performance Wizard</strong> badge', time: '2026-06-28T18:40:00', read: true },
    { id: 'n-4', type: 'warning', text: 'Your application to envoy-proxy is pending review', time: '2026-06-27T09:15:00', read: true },
    { id: 'n-5', type: 'info', text: '<strong>Priya Patel</strong> commented on your contribution', time: '2026-06-26T16:00:00', read: true },
  ],

  deadlines: [
    { id: 'd-1', title: 'Submit PR for HTTP/3 listener support', sub: 'envoy-proxy', date: '2026-07-02' },
    { id: 'd-2', title: 'Mentorship review session', sub: 'with Ava Martinez', date: '2026-07-04' },
    { id: 'd-3', title: 'Quarterly contribution report due', sub: 'CNCF program', date: '2026-07-10' },
    { id: 'd-4', title: 'Code freeze — pandas-core v2.4', sub: 'pandas-core', date: '2026-07-15' },
  ],
};

/* ──────────────────────────────────────────────────────────
   SIDEBAR / TOPBAR / MOBILE NAV
   ────────────────────────────────────────────────────────── */
function initShell() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  const menuBtn = document.querySelector('.topbar-menu-btn');

  if (menuBtn && sidebar && overlay) {
    menuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('show');
    });
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('show');
    });
  }

  // Generic dropdown toggling (profile menu, notification panel, action menus)
  document.querySelectorAll('[data-dropdown-toggle]').forEach(btn => {
    const targetId = btn.getAttribute('data-dropdown-toggle');
    const menu = document.getElementById(targetId);
    if (!menu) return;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.dropdown-menu').forEach(m => { if (m !== menu) m.classList.add('hidden'); });
      menu.classList.toggle('hidden');
    });
  });
  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.add('hidden'));
  });

  // Tabs
  document.querySelectorAll('.tabs').forEach(tabGroup => {
    const tabItems = tabGroup.querySelectorAll('.tab-item');
    tabItems.forEach(tab => {
      tab.addEventListener('click', () => {
        const panelId = tab.getAttribute('data-tab');
        const contentWrap = tabGroup.parentElement.querySelector('.tab-content');
        tabItems.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        if (contentWrap) {
          contentWrap.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
          const panel = document.getElementById(panelId);
          if (panel) panel.classList.add('active');
        }
      });
    });
  });
}

/* ──────────────────────────────────────────────────────────
   TOAST NOTIFICATIONS
   ────────────────────────────────────────────────────────── */
function ensureToastContainer() {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  return container;
}

const TOAST_ICONS = {
  success: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>',
  error:   '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
  warning: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  info:    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
};

function showToast({ type = 'info', title, message, duration = 4000 }) {
  const container = ensureToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-icon">${TOAST_ICONS[type] || TOAST_ICONS.info}</div>
    <div class="toast-body">
      <div class="toast-title">${escapeHTML(title)}</div>
      ${message ? `<div class="toast-msg">${escapeHTML(message)}</div>` : ''}
    </div>
    <div class="toast-close" role="button" aria-label="Dismiss notification">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </div>
  `;
  container.appendChild(toast);

  const remove = () => {
    toast.classList.add('toast-hiding');
    setTimeout(() => toast.remove(), 250);
  };
  toast.querySelector('.toast-close').addEventListener('click', remove);
  if (duration) setTimeout(remove, duration);
}

/* ──────────────────────────────────────────────────────────
   CONFIRMATION DIALOG (MODAL)
   ────────────────────────────────────────────────────────── */
function showConfirmDialog({ title, message, confirmText = 'Confirm', cancelText = 'Cancel', danger = false, onConfirm }) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="confirm-dialog-title">
      <div class="modal-header">
        <h3 class="modal-title" id="confirm-dialog-title">${escapeHTML(title)}</h3>
        <div class="modal-close" role="button" aria-label="Close dialog">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </div>
      </div>
      <div class="modal-body">
        <p class="text-secondary">${escapeHTML(message)}</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" data-action="cancel">${escapeHTML(cancelText)}</button>
        <button class="btn ${danger ? 'btn-danger' : 'btn-primary'}" data-action="confirm">${escapeHTML(confirmText)}</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const close = () => overlay.remove();
  overlay.querySelector('.modal-close').addEventListener('click', close);
  overlay.querySelector('[data-action="cancel"]').addEventListener('click', close);
  overlay.querySelector('[data-action="confirm"]').addEventListener('click', () => {
    close();
    if (onConfirm) onConfirm();
  });
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', function escListener(e) {
    if (e.key === 'Escape') { close(); document.removeEventListener('keydown', escListener); }
  });
}

/* ──────────────────────────────────────────────────────────
   INIT
   ────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initShell();
});
