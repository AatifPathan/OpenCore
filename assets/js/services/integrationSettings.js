/* ============================================================
   OpenCore — Sidebar Collapse + Integration Settings
   Progressively enhances the existing sidebar with a collapse
   toggle and wires up the settings integration section.
   ============================================================ */

'use strict';

/* ──────────────────────────────────────────────────────────
   COLLAPSIBLE SIDEBAR
   Adds a toggle button to the sidebar and persists state
   in localStorage so the preference survives navigation.
   ────────────────────────────────────────────────────────── */
function initCollapsibleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;

  // Create the collapse toggle button
  const collapseBtn = document.createElement('button');
  collapseBtn.className = 'sidebar-collapse-btn';
  collapseBtn.setAttribute('aria-label', 'Toggle sidebar');
  collapseBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>`;
  sidebar.style.position = 'fixed'; // ensure positioning context
  sidebar.appendChild(collapseBtn);

  const mainContent = document.querySelector('.main-content');

  function applyCollapsed(collapsed) {
    sidebar.classList.toggle('collapsed', collapsed);
    if (mainContent) {
      mainContent.style.marginLeft = collapsed ? '64px' : 'var(--sidebar-width)';
      mainContent.style.transition = 'margin-left 0.25s ease';
    }
    localStorage.setItem('oc_sidebar_collapsed', collapsed ? '1' : '0');
  }

  // Restore persisted state
  const savedCollapsed = localStorage.getItem('oc_sidebar_collapsed') === '1';
  if (savedCollapsed) applyCollapsed(true);

  collapseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    applyCollapsed(!sidebar.classList.contains('collapsed'));
  });

  // On mobile, collapsed sidebar should still work as a drawer
  function handleResize() {
    if (window.innerWidth <= 768) {
      if (mainContent) mainContent.style.marginLeft = '';
    } else {
      applyCollapsed(sidebar.classList.contains('collapsed'));
    }
  }
  window.addEventListener('resize', handleResize);
}

/* ──────────────────────────────────────────────────────────
   INTEGRATION SETTINGS SECTION
   Renders into #section-integrations on settings.html.
   ────────────────────────────────────────────────────────── */
async function initIntegrationSettings() {
  const section = document.getElementById('section-integrations');
  if (!section) return;

  // Show loading skeleton while testing connection
  section.innerHTML = `
    <div class="card mb-16">
      <div class="card-header"><div class="card-title">Integration Status</div></div>
      <div class="card-body">
        <div class="skeleton skeleton-text" style="width:80%;margin-bottom:12px"></div>
        <div class="skeleton skeleton-text" style="width:60%;margin-bottom:12px"></div>
        <div class="skeleton skeleton-text" style="width:70%"></div>
      </div>
    </div>`;

  const sfStatus = await OcApi.testSalesforceConnection();
  const ghStatus = { connected: true, lastSync: new Date(Date.now() - 38 * 60000).toISOString() };

  function connectedHTML(label) {
    return `<span class="integration-status connected">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
      ${label}
    </span>`;
  }
  function disconnectedHTML(label) {
    return `<span class="integration-status disconnected">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      ${label}
    </span>`;
  }

  section.innerHTML = `
    <div class="card mb-16">
      <div class="card-header">
        <div>
          <div class="card-title">Integration Status</div>
          <div class="card-subtitle">Manage connections to Salesforce and GitHub</div>
        </div>
        <button class="btn btn-sm btn-secondary" id="testAllConnectionsBtn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.45"/></svg>
          Test all
        </button>
      </div>
      <div class="card-body" style="display:flex;flex-direction:column;gap:0;padding:16px 20px">

        <!-- Salesforce -->
        <div class="integration-card">
          <div class="integration-icon sf">
            <svg width="22" height="22" viewBox="0 0 100 70" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="50" cy="35" rx="48" ry="33" fill="#00A1E0"/>
              <text x="50" y="48" text-anchor="middle" fill="white" font-size="32" font-weight="700" font-family="Arial">SF</text>
            </svg>
          </div>
          <div class="integration-info">
            <div class="integration-name">Salesforce</div>
            <div class="integration-desc">
              ${sfStatus.connected
                ? `Connected to <strong>${sfStatus.orgName || 'OpenCore Org'}</strong> · API ${sfStatus.apiVersion}`
                : `Not connected — ${sfStatus.error || 'OAuth token missing'}`}
              ${sfStatus.mockMode ? ' · <span class="badge badge-warning" style="font-size:10px">Mock Mode</span>' : ''}
            </div>
          </div>
          <div>${sfStatus.connected ? connectedHTML('Connected') : disconnectedHTML('Disconnected')}</div>
          <button class="btn btn-sm btn-secondary" id="testSfBtn">Test</button>
        </div>

        <!-- GitHub -->
        <div class="integration-card">
          <div class="integration-icon gh">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#24292F"><path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.8.1-.7.1-.7 1.2.1 1.9 1.3 1.9 1.3 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.3-3.2-.1-.3-.6-1.6.1-3.2 0 0 1-.3 3.4 1.2 1-.3 2-.4 3-.4s2 .1 3 .4c2.4-1.6 3.4-1.2 3.4-1.2.7 1.6.2 2.9.1 3.2.8.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3z"/></svg>
          </div>
          <div class="integration-info">
            <div class="integration-name">GitHub</div>
            <div class="integration-desc">Last synced ${timeAgo(ghStatus.lastSync)} · Used by GitHubSyncController</div>
          </div>
          <div>${ghStatus.connected ? connectedHTML('Connected') : disconnectedHTML('Disconnected')}</div>
          <button class="btn btn-sm btn-secondary" id="testGhBtn">Test</button>
        </div>
      </div>
    </div>

    <!-- Sync Configuration -->
    <div class="card">
      <div class="card-header"><div class="card-title">Sync Configuration</div></div>
      <div class="card-body" style="padding:0 20px">
        <div class="settings-row">
          <div>
            <div class="settings-row-label">Sync Interval</div>
            <div class="settings-row-desc">How often OpenCore auto-syncs repositories from GitHub</div>
          </div>
          <select class="form-control" style="width:170px" id="syncIntervalSelect">
            <option value="15">Every 15 minutes</option>
            <option value="30">Every 30 minutes</option>
            <option value="60" selected>Every hour</option>
            <option value="360">Every 6 hours</option>
            <option value="1440">Daily</option>
          </select>
        </div>
        <div class="settings-row">
          <div>
            <div class="settings-row-label">Auto-sync on push</div>
            <div class="settings-row-desc">Trigger sync via GitHub webhook on every push event</div>
          </div>
          <label class="toggle-switch"><input type="checkbox" id="webhookToggle" checked><span class="toggle-slider"></span></label>
        </div>
        <div class="settings-row">
          <div>
            <div class="settings-row-label">Sync issues &amp; pull requests</div>
            <div class="settings-row-desc">Pull issue data and PR metadata from GitHub during sync</div>
          </div>
          <label class="toggle-switch"><input type="checkbox" id="syncIssuesToggle" checked><span class="toggle-slider"></span></label>
        </div>
        <div class="settings-row" style="border-bottom:none;padding-bottom:0">
          <div>
            <div class="settings-row-label">Manual sync — all repositories</div>
            <div class="settings-row-desc">Trigger a full sync of all repositories now</div>
          </div>
          <button class="btn btn-secondary" id="manualSyncAllBtn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.45"/></svg>
            Sync All Now
          </button>
        </div>
      </div>
    </div>
  `;

  /* ── Wire up buttons ── */
  document.getElementById('testSfBtn').addEventListener('click', async () => {
    const btn = document.getElementById('testSfBtn');
    btn.disabled = true; btn.textContent = 'Testing…';
    const res = await OcApi.testSalesforceConnection();
    btn.disabled = false; btn.textContent = 'Test';
    if (res.connected) Toast.success('Salesforce connected', `API ${res.apiVersion} · ${res.mockMode ? 'Mock Mode' : res.orgName}`);
    else               Toast.error('Salesforce connection failed', res.error);
  });

  document.getElementById('testGhBtn').addEventListener('click', async () => {
    const btn = document.getElementById('testGhBtn');
    btn.disabled = true; btn.textContent = 'Testing…';
    await OcApi.mockDelay(800);
    btn.disabled = false; btn.textContent = 'Test';
    Toast.success('GitHub connected', 'Token valid · Rate limit: 4,823 / 5,000 remaining');
  });

  document.getElementById('testAllConnectionsBtn').addEventListener('click', async () => {
    const toastId = Toast.loading('Testing connections…', 'Checking Salesforce and GitHub');
    await OcApi.mockDelay(1200);
    Toast.update(toastId, { type: 'success', title: 'All connections OK', message: 'Salesforce and GitHub are reachable.', duration: 4000 });
  });

  document.getElementById('manualSyncAllBtn').addEventListener('click', () => {
    Modal.open({
      title: 'Sync all repositories?',
      body: `<p class="text-secondary">This will trigger a full GitHub sync for all 142 repositories. The process runs in the background via Salesforce batch jobs and may take a few minutes.</p>`,
      actions: [
        { label: 'Cancel', type: 'secondary', closeOnClick: true },
        {
          label: 'Start Sync',
          type: 'primary',
          closeOnClick: true,
          onClick: async () => {
            const id = Toast.loading('Queuing batch sync…', 'Starting Salesforce batch job');
            await OcApi.mockDelay(1800);
            Toast.update(id, { type: 'success', title: 'Batch sync started', message: '142 repositories queued. Check back in a few minutes.', duration: 6000 });
          },
        },
      ],
    });
  });

  document.getElementById('syncIntervalSelect').addEventListener('change', (e) => {
    Toast.info('Sync interval updated', `Repositories will sync every ${e.target.options[e.target.selectedIndex].text.toLowerCase()}.`);
  });
}

/* ── Auto-init on DOM ready ── */
document.addEventListener('DOMContentLoaded', () => {
  initCollapsibleSidebar();
  initIntegrationSettings();
});
