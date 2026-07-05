/* ============================================================
   OpenCore — Utility Functions
   ============================================================ */

/** Format a number with thousands separators (e.g. 12450 -> "12,450") */
function formatNumber(num) {
  return new Intl.NumberFormat('en-US').format(num);
}

/** Format a number compactly (e.g. 12450 -> "12.4k") */
function formatCompact(num) {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(num);
}

/** Get initials from a full name, e.g. "Ada Lovelace" -> "AL" */
function getInitials(name) {
  return name
    .split(' ')
    .map(p => p[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
}

/** Format relative time, e.g. "2h ago", "3d ago" */
function timeAgo(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHrs / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return `${Math.floor(diffDays / 30)}mo ago`;
}

/** Format a date as "Jan 24, 2026" */
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/** Returns { day, month } for deadline widget */
function splitDate(dateStr) {
  const date = new Date(dateStr);
  return {
    day: date.getDate(),
    month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
  };
}

/** Days remaining until a date (can be negative) */
function daysUntil(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  return Math.ceil((date - now) / (1000 * 60 * 60 * 24));
}

/** Simple debounce for search inputs */
function debounce(fn, delay = 250) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/** Build avatar HTML — uses initials with a deterministic color */
const AVATAR_COLORS = ['#0057D9', '#7C3AED', '#DC2626', '#D97706', '#16A34A', '#0284C7', '#DB2777', '#65A30D'];
function avatarColor(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}
function avatarHTML(name, size = 'md') {
  const color = avatarColor(name);
  return `<div class="avatar avatar-${size}" style="background:${color}">${getInitials(name)}</div>`;
}

/** Render star rating-like difficulty badge */
function difficultyBadge(level) {
  const map = {
    Beginner: 'easy',
    Intermediate: 'medium',
    Advanced: 'hard'
  };
  const cls = map[level] || 'medium';
  return `<span class="badge badge-${cls}">${level}</span>`;
}

/** Language dot + label */
function languageTag(lang) {
  const map = {
    JavaScript: 'js', TypeScript: 'ts', Python: 'python', Java: 'java',
    Go: 'go', Rust: 'rust', 'C++': 'cpp', Ruby: 'ruby', PHP: 'php', 'C#': 'cs'
  };
  const cls = map[lang] || 'js';
  return `<span class="repo-card-lang"><span class="lang-dot lang-${cls}"></span>${lang}</span>`;
}

/** Escape HTML to prevent injection from dummy data edge cases */
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/** Query param helper */
function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}
