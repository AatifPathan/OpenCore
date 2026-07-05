/* ============================================================
   OpenCore — GitHub Sync Service
   Orchestrates the full sync workflow:
     1. UI enters loading state
     2. Calls RepositoryApi.syncRepository(id)  →  Salesforce Apex
     3. Refreshes repository data from backend
     4. Updates all sync-aware UI elements
     5. Shows success / error toast
   ============================================================ */

'use strict';

const GitHubSyncService = (() => {

  /**
   * Full sync workflow for a single repository.
   *
   * @param {string}  repoId       Salesforce Repository record Id
   * @param {object}  callbacks    Lifecycle hooks for UI updates
   *   onStart(repoId)             — called immediately; use to disable button, show spinner
   *   onSuccess(result, repo)     — called with sync result + refreshed repo data
   *   onError(error)              — called with ApiError instance
   *   onFinally()                 — always called; use to re-enable button
   */
  async function syncRepository(repoId, callbacks = {}) {
    const { onStart, onSuccess, onError, onFinally } = callbacks;

    // 1. Notify UI that sync has started
    if (onStart) onStart(repoId);

    // 2. Show persistent loading toast
    const toastId = Toast.loading(
      'Syncing with GitHub…',
      'Fetching latest stars, forks, issues and metadata'
    );

    try {
      // 3. Call the API layer — this maps to GitHubSyncController.syncRepository(repoId)
      const result = await RepositoryApi.syncRepository(repoId);

      // 4. Dismiss loading toast, show success
      Toast.update(toastId, {
        type:    'success',
        title:   'Repository synced',
        message: `${result.recordsUpdated} records updated from GitHub.`,
        duration: 4000,
      });

      // 5. Fetch refreshed repo data from backend
      const refreshedRepo = await RepositoryApi.getRepository(repoId);

      if (onSuccess) onSuccess(result, refreshedRepo);

    } catch (err) {
      // Dismiss loading toast, show error
      Toast.update(toastId, {
        type:    'error',
        title:   'Sync failed',
        message: err.message || 'An unexpected error occurred during synchronisation.',
        duration: 8000,
      });

      if (onError) onError(err);
      console.error('[GitHubSyncService] syncRepository error:', err);

    } finally {
      if (onFinally) onFinally();
    }
  }

  /**
   * Build the sync button element — self-contained, injectable anywhere.
   * The button manages its own state (idle / syncing / disabled).
   *
   * @param {string}   repoId
   * @param {Function} onAfterSync(refreshedRepo)  called after successful sync
   * @returns {HTMLButtonElement}
   */
  function createSyncButton(repoId, onAfterSync) {
    const btn = document.createElement('button');
    btn.className = 'btn-github-sync';
    btn.setAttribute('aria-live', 'polite');
    _setSyncButtonIdle(btn);

    btn.addEventListener('click', async () => {
      await syncRepository(repoId, {
        onStart: () => {
          btn.disabled = true;
          btn.classList.add('syncing');
          _setSyncButtonSyncing(btn);
        },
        onSuccess: (result, refreshedRepo) => {
          _setSyncButtonSuccess(btn);
          if (onAfterSync) onAfterSync(refreshedRepo);
          // Reset to idle after 3s
          setTimeout(() => _setSyncButtonIdle(btn), 3000);
        },
        onError: (err) => {
          _setSyncButtonError(btn);
          setTimeout(() => _setSyncButtonIdle(btn), 4000);
        },
        onFinally: () => {
          btn.disabled = false;
          btn.classList.remove('syncing');
        },
      });
    });

    return btn;
  }

  /* ── Button state helpers ── */
  const GITHUB_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.8.1-.7.1-.7 1.2.1 1.9 1.3 1.9 1.3 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.3-3.2-.1-.3-.6-1.6.1-3.2 0 0 1-.3 3.4 1.2 1-.3 2-.4 3-.4s2 .1 3 .4c2.4-1.6 3.4-1.2 3.4-1.2.7 1.6.2 2.9.1 3.2.8.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3z"/></svg>`;
  const SPINNER_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="sync-spinner"><circle cx="12" cy="12" r="10" stroke-opacity=".2"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>`;
  const CHECK_ICON   = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
  const ERROR_ICON   = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;

  function _setSyncButtonIdle(btn) {
    btn.style.background = '';
    btn.innerHTML = `${GITHUB_ICON} <span>Sync from GitHub</span>`;
  }
  function _setSyncButtonSyncing(btn) {
    btn.innerHTML = `${SPINNER_ICON} <span>Syncing…</span>`;
  }
  function _setSyncButtonSuccess(btn) {
    btn.style.background = '#15803D';
    btn.innerHTML = `${CHECK_ICON} <span>Synced</span>`;
  }
  function _setSyncButtonError(btn) {
    btn.style.background = '#B91C1C';
    btn.innerHTML = `${ERROR_ICON} <span>Sync failed</span>`;
  }

  /**
   * Render a sync status bar element.
   * @param {object} syncState   from RepositoryApi.getSyncState(id)
   * @returns {string} HTML string
   */
  function renderSyncStatusBar(syncState) {
    const { syncStatus, lastSynced, syncError } = syncState;

    const statusLabels = {
      never:   'Never synced',
      syncing: 'Syncing now…',
      success: 'Sync successful',
      error:   'Last sync failed',
    };

    const lastSyncedText = lastSynced
      ? `Last synced ${timeAgo(lastSynced)}`
      : 'Not yet synced with GitHub';

    return `
      <div class="sync-status-bar">
        <div class="sync-status-dot ${syncStatus}"></div>
        <span class="font-medium text-sm" style="color:var(--color-text-primary)">${statusLabels[syncStatus] || 'Unknown'}</span>
        <span class="text-muted" style="font-size:var(--text-xs)">·</span>
        <span class="last-synced-time text-sm">${lastSyncedText}</span>
        ${syncError ? `<span class="text-xs text-danger" style="margin-left:auto">⚠ ${escapeHTML(syncError)}</span>` : ''}
        <div class="badge-github-live" style="margin-left:auto">
          <span class="live-dot"></span> Live Sync
        </div>
      </div>
    `;
  }

  /**
   * Compute and render a health badge based on health score.
   * @param {number} score  0–100
   * @returns {string} HTML string
   */
  function renderHealthBadge(score) {
    let cls, label;
    if (score >= 90)      { cls = 'excellent'; label = '● Excellent'; }
    else if (score >= 75) { cls = 'good';      label = '● Good'; }
    else if (score >= 55) { cls = 'fair';      label = '● Fair'; }
    else                  { cls = 'poor';      label = '● Poor'; }
    return `<span class="health-badge ${cls}" data-tooltip="Repository health score: ${score}/100">${label} ${score}</span>`;
  }

  return {
    syncRepository,
    createSyncButton,
    renderSyncStatusBar,
    renderHealthBadge,
  };
})();

window.GitHubSyncService = GitHubSyncService;
