/* ============================================================
   OpenCore — Global UI Components
   Reusable, accessible, framework-free UI primitives.
   All components are instantiated via static factory methods.
   ============================================================ */

'use strict';

/* ══════════════════════════════════════════════════════════
   1. TOAST NOTIFICATION SYSTEM
   Enhanced version — replaces the basic showToast in app.js.
   Supports: success | error | warning | info
             progress toasts (for long operations)
   ══════════════════════════════════════════════════════════ */
const Toast = (() => {
  const ICONS = {
    success: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    error:   `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    warning: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    info:    `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
    loading: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" class="oc-spin"><circle cx="12" cy="12" r="10" stroke-opacity=".2"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>`,
  };

  function _getContainer() {
    let c = document.getElementById('oc-toast-container');
    if (!c) {
      c = document.createElement('div');
      c.id = 'oc-toast-container';
      c.className = 'toast-container';
      c.setAttribute('role', 'region');
      c.setAttribute('aria-label', 'Notifications');
      c.setAttribute('aria-live', 'polite');
      document.body.appendChild(c);
    }
    return c;
  }

  /**
   * Show a toast notification.
   * @param {object} opts
   * @param {'success'|'error'|'warning'|'info'|'loading'} opts.type
   * @param {string}  opts.title
   * @param {string}  [opts.message]
   * @param {number}  [opts.duration=4500]  0 = persistent
   * @param {string}  [opts.id]             Provide to update an existing toast
   * @returns {string} toastId — pass to Toast.update() or Toast.dismiss()
   */
  function show({ type = 'info', title, message, duration = 4500, id } = {}) {
    const container = _getContainer();
    const toastId = id || `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    // If updating an existing toast
    const existing = document.getElementById(toastId);
    if (existing) {
      existing.remove();
    }

    const el = document.createElement('div');
    el.id = toastId;
    el.className = `toast toast-${type}`;
    el.setAttribute('role', type === 'error' ? 'alert' : 'status');
    el.innerHTML = `
      <div class="toast-icon">${ICONS[type] || ICONS.info}</div>
      <div class="toast-body">
        <div class="toast-title">${escapeHTML(title)}</div>
        ${message ? `<div class="toast-msg">${escapeHTML(message)}</div>` : ''}
      </div>
      <button class="toast-close" aria-label="Dismiss notification">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    `;

    const dismiss = () => {
      el.classList.add('toast-hiding');
      el.addEventListener('animationend', () => el.remove(), { once: true });
      setTimeout(() => el.remove(), 400); // fallback
    };

    el.querySelector('.toast-close').addEventListener('click', dismiss);
    container.appendChild(el);

    if (duration > 0 && type !== 'loading') {
      setTimeout(dismiss, duration);
    }

    return toastId;
  }

  /** Update an in-flight toast (e.g. loading → success) */
  function update(id, opts) {
    return show({ ...opts, id });
  }

  /** Immediately dismiss a toast by id */
  function dismiss(id) {
    const el = document.getElementById(id);
    if (el) {
      el.classList.add('toast-hiding');
      setTimeout(() => el.remove(), 400);
    }
  }

  // Convenience shorthands
  const success = (title, message, opts) => show({ type: 'success', title, message, ...opts });
  const error   = (title, message, opts) => show({ type: 'error',   title, message, duration: 7000, ...opts });
  const warning = (title, message, opts) => show({ type: 'warning', title, message, ...opts });
  const info    = (title, message, opts) => show({ type: 'info',    title, message, ...opts });
  const loading = (title, message, opts) => show({ type: 'loading', title, message, duration: 0, ...opts });

  return { show, update, dismiss, success, error, warning, info, loading };
})();

// Keep backward compat with existing showToast() calls in app.js
window.showToast = ({ type, title, message }) => Toast.show({ type, title, message });
window.Toast = Toast;


/* ══════════════════════════════════════════════════════════
   2. GLOBAL LOADING OVERLAY
   Full-page overlay for heavy operations (page load, bulk sync).
   ══════════════════════════════════════════════════════════ */
const LoadingOverlay = (() => {
  let _el = null;

  function _ensure() {
    if (_el) return _el;
    _el = document.createElement('div');
    _el.id = 'oc-loading-overlay';
    _el.setAttribute('role', 'status');
    _el.setAttribute('aria-live', 'polite');
    _el.innerHTML = `
      <div class="oc-overlay-inner">
        <div class="oc-overlay-spinner" aria-hidden="true">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="12" cy="12" r="10" stroke-opacity=".15"/>
            <path d="M12 2a10 10 0 0 1 10 10"/>
          </svg>
        </div>
        <div class="oc-overlay-text" id="oc-overlay-text">Loading…</div>
        <div class="oc-overlay-sub" id="oc-overlay-sub"></div>
      </div>
    `;
    document.body.appendChild(_el);
    return _el;
  }

  function show(text = 'Loading…', sub = '') {
    const el = _ensure();
    document.getElementById('oc-overlay-text').textContent = text;
    document.getElementById('oc-overlay-sub').textContent  = sub;
    el.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function hide() {
    const el = document.getElementById('oc-loading-overlay');
    if (el) {
      el.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  function updateText(text, sub = '') {
    const t = document.getElementById('oc-overlay-text');
    const s = document.getElementById('oc-overlay-sub');
    if (t) t.textContent = text;
    if (s) s.textContent = sub;
  }

  return { show, hide, updateText };
})();

window.LoadingOverlay = LoadingOverlay;


/* ══════════════════════════════════════════════════════════
   3. SKELETON LOADER
   Drop-in skeleton blocks for cards, rows, lists.
   ══════════════════════════════════════════════════════════ */
const SkeletonLoader = (() => {
  /** Returns skeleton HTML for a repository card */
  function repoCard() {
    return `
      <div class="repo-card" aria-busy="true" aria-label="Loading repository">
        <div class="skeleton" style="height:14px;width:55%;margin-bottom:10px"></div>
        <div class="skeleton skeleton-title" style="width:75%;margin-bottom:8px"></div>
        <div class="skeleton skeleton-text" style="width:100%;margin-bottom:6px"></div>
        <div class="skeleton skeleton-text" style="width:80%;margin-bottom:16px"></div>
        <div style="display:flex;gap:8px">
          <div class="skeleton" style="height:22px;width:70px;border-radius:99px"></div>
          <div class="skeleton" style="height:22px;width:70px;border-radius:99px"></div>
        </div>
        <div style="display:flex;gap:12px;margin-top:16px;padding-top:12px;border-top:1px solid var(--color-border)">
          <div class="skeleton" style="height:12px;width:40px"></div>
          <div class="skeleton" style="height:12px;width:40px"></div>
          <div class="skeleton" style="height:12px;width:40px"></div>
        </div>
      </div>`;
  }

  /** Returns skeleton HTML for a KPI card */
  function kpiCard() {
    return `
      <div class="kpi-card" aria-busy="true">
        <div class="skeleton skeleton-circle" style="width:42px;height:42px;margin-bottom:14px"></div>
        <div class="skeleton skeleton-title" style="width:50%;margin-bottom:8px"></div>
        <div class="skeleton skeleton-text" style="width:70%;margin-bottom:10px"></div>
        <div class="skeleton" style="height:18px;width:80px;border-radius:99px"></div>
      </div>`;
  }

  /** Returns skeleton HTML for a table row */
  function tableRow(cols = 5) {
    const cells = Array(cols).fill(0).map(() =>
      `<td><div class="skeleton skeleton-text" style="width:${60 + Math.random() * 30}%"></div></td>`
    ).join('');
    return `<tr aria-busy="true">${cells}</tr>`;
  }

  /** Returns multiple skeletons */
  function repeat(fn, count = 3, ...args) {
    return Array(count).fill(0).map(() => fn(...args)).join('');
  }

  return { repoCard, kpiCard, tableRow, repeat };
})();

window.SkeletonLoader = SkeletonLoader;


/* ══════════════════════════════════════════════════════════
   4. ERROR STATE COMPONENT
   ══════════════════════════════════════════════════════════ */
const ErrorState = (() => {
  /**
   * Render an error state into a container element.
   * @param {HTMLElement} container
   * @param {object} opts
   */
  function render(container, { title = 'Something went wrong', message, onRetry, code } = {}) {
    container.innerHTML = `
      <div class="oc-error-state" role="alert">
        <div class="oc-error-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <div class="oc-error-title">${escapeHTML(title)}</div>
        ${message ? `<div class="oc-error-message">${escapeHTML(message)}</div>` : ''}
        ${code    ? `<div class="oc-error-code font-mono text-xs text-muted">Error code: ${escapeHTML(String(code))}</div>` : ''}
        ${onRetry ? `<button class="btn btn-secondary oc-error-retry-btn" style="margin-top:16px">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.45"/></svg>
          Try again
        </button>` : ''}
      </div>
    `;
    if (onRetry) {
      container.querySelector('.oc-error-retry-btn').addEventListener('click', onRetry);
    }
  }

  return { render };
})();

window.ErrorState = ErrorState;


/* ══════════════════════════════════════════════════════════
   5. REUSABLE MODAL COMPONENT
   Enhanced modal with keyboard trap, focus management,
   and a programmatic API.
   ══════════════════════════════════════════════════════════ */
const Modal = (() => {
  let _activeModal = null;

  /**
   * Open a modal.
   * @param {object} opts
   * @param {string}   opts.title
   * @param {string}   opts.body         Raw HTML string for body content
   * @param {Array}    opts.actions       [{label, type:'primary'|'secondary'|'danger', onClick, closeOnClick:true}]
   * @param {string}   [opts.size]        'sm' | 'md'(default) | 'lg'
   * @param {Function} [opts.onClose]
   * @returns {{ close: Function, setBody: Function, setTitle: Function }}
   */
  function open({ title, body, actions = [], size = 'md', onClose } = {}) {
    close(); // close any existing modal

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'oc-modal-title');

    const maxWidths = { sm: '400px', md: '520px', lg: '720px' };

    overlay.innerHTML = `
      <div class="modal" style="max-width:${maxWidths[size] || maxWidths.md}">
        <div class="modal-header">
          <h3 class="modal-title" id="oc-modal-title">${escapeHTML(title)}</h3>
          <button class="modal-close" aria-label="Close dialog">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="modal-body" id="oc-modal-body">${body || ''}</div>
        ${actions.length ? `<div class="modal-footer" id="oc-modal-footer"></div>` : ''}
      </div>
    `;

    // Build action buttons
    const footer = overlay.querySelector('#oc-modal-footer');
    if (footer) {
      actions.forEach(action => {
        const btn = document.createElement('button');
        btn.className = `btn btn-${action.type || 'secondary'}`;
        btn.textContent = action.label;
        btn.addEventListener('click', () => {
          if (action.onClick) action.onClick();
          if (action.closeOnClick !== false) close();
        });
        footer.appendChild(btn);
      });
    }

    const _close = () => {
      overlay.classList.add('modal-closing');
      overlay.addEventListener('animationend', () => {
        overlay.remove();
        if (onClose) onClose();
        _activeModal = null;
      }, { once: true });
      setTimeout(() => overlay.remove(), 300); // fallback
      document.removeEventListener('keydown', _keyHandler);
    };

    overlay.querySelector('.modal-close').addEventListener('click', _close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) _close(); });

    const _keyHandler = (e) => { if (e.key === 'Escape') _close(); };
    document.addEventListener('keydown', _keyHandler);

    document.body.appendChild(overlay);
    _activeModal = overlay;

    // Focus first focusable element
    setTimeout(() => {
      const firstFocusable = overlay.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (firstFocusable) firstFocusable.focus();
    }, 50);

    return {
      close: _close,
      setBody: (html) => {
        const bodyEl = overlay.querySelector('#oc-modal-body');
        if (bodyEl) bodyEl.innerHTML = html;
      },
      setTitle: (text) => {
        const titleEl = overlay.querySelector('#oc-modal-title');
        if (titleEl) titleEl.textContent = text;
      },
    };
  }

  function close() {
    if (_activeModal) {
      _activeModal.remove();
      _activeModal = null;
    }
  }

  return { open, close };
})();

window.Modal = Modal;

// Keep backward compat with existing showConfirmDialog() in app.js
window.showConfirmDialog = ({ title, message, confirmText, cancelText, danger, onConfirm }) => {
  Modal.open({
    title,
    body: `<p class="text-secondary">${escapeHTML(message)}</p>`,
    actions: [
      { label: cancelText || 'Cancel', type: 'secondary', closeOnClick: true },
      { label: confirmText || 'Confirm', type: danger ? 'danger' : 'primary', onClick: onConfirm, closeOnClick: true },
    ],
  });
};
