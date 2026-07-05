/* ============================================================
   OpenCore — Repository API Service
   All repository-related backend operations.
   Calls GitHubSyncController.syncRepository(repositoryId) on sync.
   ============================================================ */

'use strict';

const RepositoryApi = (() => {

  /* ── Mock sync state store (persisted in memory per session) ── */
  const _syncState = {};
  OpenCoreData.repositories.forEach(r => {
    _syncState[r.id] = {
      lastSynced: null,
      syncStatus: 'never',   // 'never' | 'syncing' | 'success' | 'error'
      syncError:  null,
      healthScore: Math.floor(Math.random() * 30) + 70,  // 70–100
      githubUrl: `https://github.com/${r.org.toLowerCase().replace(/\s+/g, '')}/${r.name}`,
    };
  });

  /* ────────────────────────────────────────────────────────────
     GET /repositories
     Returns all repositories with enriched sync metadata.
  ─────────────────────────────────────────────────────────────── */
  async function getRepositories(filters = {}) {
    if (OcApi.ApiConfig.mockMode) {
      await OcApi.mockDelay(500);
      let list = OpenCoreData.repositories.map(r => _enrich(r));
      if (filters.language)   list = list.filter(r => r.language   === filters.language);
      if (filters.difficulty) list = list.filter(r => r.difficulty === filters.difficulty);
      if (filters.status)     list = list.filter(r => r.status     === filters.status);
      if (filters.visibility) list = list.filter(r => r.visibility === filters.visibility);
      if (filters.query) {
        const q = filters.query.toLowerCase();
        list = list.filter(r =>
          r.name.toLowerCase().includes(q) ||
          r.org.toLowerCase().includes(q)  ||
          r.tags.some(t => t.includes(q))
        );
      }
      return { records: list, totalSize: list.length };
    }
    const qs = new URLSearchParams(filters).toString();
    return OcApi.sfRequest(`/opencore/repositories${qs ? '?' + qs : ''}`);
  }

  /* ────────────────────────────────────────────────────────────
     GET /repositories/:id
     Returns one repository with full details + sync metadata.
  ─────────────────────────────────────────────────────────────── */
  async function getRepository(id) {
    if (OcApi.ApiConfig.mockMode) {
      await OcApi.mockDelay(400);
      const repo = OpenCoreData.repositories.find(r => r.id === id);
      if (!repo) throw new OcApi.ApiError(`Repository '${id}' not found.`, 404, 'NOT_FOUND');
      return _enrich(repo);
    }
    return OcApi.sfRequest(`/opencore/repositories/${id}`);
  }

  /* ────────────────────────────────────────────────────────────
     POST /repositories/:id/sync
     Maps to: GitHubSyncController.syncRepository(repositoryId)
     This is the primary Salesforce integration point.
  ─────────────────────────────────────────────────────────────── */
  async function syncRepository(id) {
    if (OcApi.ApiConfig.mockMode) {
      // Mark as syncing immediately so callers can update UI
      _syncState[id].syncStatus = 'syncing';
      _syncState[id].syncError  = null;

      // Simulate Apex job processing time (1.2–2s)
      await OcApi.mockDelay(1200 + Math.random() * 800);

      if (window.__OC_MOCK_FAIL__) {
        _syncState[id].syncStatus = 'error';
        _syncState[id].syncError  = 'GitHub API rate limit exceeded. Retry in 60 seconds.';
        throw new OcApi.ApiError(
          'GitHub API rate limit exceeded. Retry in 60 seconds.',
          429,
          'GITHUB_RATE_LIMIT'
        );
      }

      // Simulate updated stats from GitHub
      const repo = OpenCoreData.repositories.find(r => r.id === id);
      if (repo) {
        repo.stars      += Math.floor(Math.random() * 12);
        repo.forks      += Math.floor(Math.random() * 4);
        repo.watchers   += Math.floor(Math.random() * 3);
        repo.openIssues += Math.floor(Math.random() * 5) - 2;
        if (repo.openIssues < 0) repo.openIssues = 0;
      }

      _syncState[id].lastSynced   = new Date().toISOString();
      _syncState[id].syncStatus   = 'success';
      _syncState[id].healthScore  = Math.min(100, (_syncState[id].healthScore || 80) + Math.floor(Math.random() * 3));

      return {
        repositoryId: id,
        syncedAt:     _syncState[id].lastSynced,
        status:       'success',
        recordsUpdated: Math.floor(Math.random() * 20) + 5,
        message:      'Repository synchronized successfully from GitHub.',
      };
    }

    /* Production path — calls the Salesforce Apex REST endpoint
       which internally calls GitHubSyncController.syncRepository(repositoryId) */
    return OcApi.sfRequest(`/opencore/repositories/${id}/sync`, { method: 'POST' });
  }

  /* ────────────────────────────────────────────────────────────
     GET /repositories/:id/issues
  ─────────────────────────────────────────────────────────────── */
  async function getRepositoryIssues(id) {
    if (OcApi.ApiConfig.mockMode) {
      await OcApi.mockDelay(350);
      const issues = OpenCoreData.issues.filter(i => i.repoId === id);
      return { records: issues, totalSize: issues.length };
    }
    return OcApi.sfRequest(`/opencore/repositories/${id}/issues`);
  }

  /* ────────────────────────────────────────────────────────────
     GET /repositories/:id/contributors
  ─────────────────────────────────────────────────────────────── */
  async function getRepositoryContributors(id) {
    if (OcApi.ApiConfig.mockMode) {
      await OcApi.mockDelay(350);
      // Return a random sample of contributors for mock purposes
      const shuffled = [...OpenCoreData.contributors].sort(() => Math.random() - 0.5);
      return { records: shuffled.slice(0, 6), totalSize: 6 };
    }
    return OcApi.sfRequest(`/opencore/repositories/${id}/contributors`);
  }

  /* ────────────────────────────────────────────────────────────
     GET /repositories/:id/activity
  ─────────────────────────────────────────────────────────────── */
  async function getRepositoryActivity(id) {
    if (OcApi.ApiConfig.mockMode) {
      await OcApi.mockDelay(300);
      const repo = OpenCoreData.repositories.find(r => r.id === id);
      return {
        records: [
          { actor: 'Elena Petrova', action: 'opened a pull request', detail: '"Add HTTP/3 listener support"', ts: new Date(Date.now() - 2*3600*1000).toISOString() },
          { actor: 'Mei Lin',       action: 'merged pull request',   detail: '#2841',                         ts: new Date(Date.now() - 26*3600*1000).toISOString() },
          { actor: 'Daniel Kim',    action: 'commented on issue',    detail: '#2839',                         ts: new Date(Date.now() - 50*3600*1000).toISOString() },
          { actor: 'Sofia Rossi',   action: 'pushed 4 commits to',   detail: 'main',                          ts: new Date(Date.now() - 74*3600*1000).toISOString() },
          { actor: 'Ava Martinez',  action: 'reviewed pull request', detail: '#2835',                         ts: new Date(Date.now() - 98*3600*1000).toISOString() },
        ],
      };
    }
    return OcApi.sfRequest(`/opencore/repositories/${id}/activity`);
  }

  /* ── Private: enrich a repository record with sync metadata ── */
  function _enrich(repo) {
    const state = _syncState[repo.id] || {};
    return {
      ...repo,
      lastSynced:  state.lastSynced  || null,
      syncStatus:  state.syncStatus  || 'never',
      syncError:   state.syncError   || null,
      healthScore: state.healthScore || 80,
      githubUrl:   state.githubUrl   || `https://github.com/${repo.name}`,
    };
  }

  /* ── Expose sync state for UI reads ── */
  function getSyncState(id) {
    return { ...(_syncState[id] || {}) };
  }

  return {
    getRepositories,
    getRepository,
    syncRepository,
    getRepositoryIssues,
    getRepositoryContributors,
    getRepositoryActivity,
    getSyncState,
  };
})();

window.RepositoryApi = RepositoryApi;
