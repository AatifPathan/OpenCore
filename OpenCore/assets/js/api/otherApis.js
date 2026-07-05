/* ============================================================
   OpenCore — Contributor API Service
   ============================================================ */
'use strict';

const ContributorApi = (() => {
  async function getContributors(filters = {}) {
    if (OcApi.ApiConfig.mockMode) {
      await OcApi.mockDelay(500);
      let list = [...OpenCoreData.contributors];
      if (filters.availability) list = list.filter(c => c.availability === filters.availability);
      if (filters.rank)         list = list.filter(c => c.rank         === filters.rank);
      if (filters.query) {
        const q = filters.query.toLowerCase();
        list = list.filter(c => c.name.toLowerCase().includes(q) || c.skills.some(s => s.toLowerCase().includes(q)));
      }
      return { records: list, totalSize: list.length };
    }
    const qs = new URLSearchParams(filters).toString();
    return OcApi.sfRequest(`/opencore/contributors${qs ? '?' + qs : ''}`);
  }

  async function getContributor(id) {
    if (OcApi.ApiConfig.mockMode) {
      await OcApi.mockDelay(400);
      const c = OpenCoreData.contributors.find(c => c.id === id);
      if (!c) throw new OcApi.ApiError(`Contributor '${id}' not found.`, 404, 'NOT_FOUND');
      return c;
    }
    return OcApi.sfRequest(`/opencore/contributors/${id}`);
  }

  async function getTopContributors(limit = 6) {
    if (OcApi.ApiConfig.mockMode) {
      await OcApi.mockDelay(350);
      const sorted = [...OpenCoreData.contributors].sort((a, b) => b.reputation - a.reputation);
      return { records: sorted.slice(0, limit) };
    }
    return OcApi.sfRequest(`/opencore/contributors/top?limit=${limit}`);
  }

  return { getContributors, getContributor, getTopContributors };
})();

window.ContributorApi = ContributorApi;


/* ============================================================
   OpenCore — Organization API Service
   ============================================================ */
const OrganizationApi = (() => {
  async function getOrganizations(filters = {}) {
    if (OcApi.ApiConfig.mockMode) {
      await OcApi.mockDelay(500);
      let list = [...OpenCoreData.organizations];
      if (filters.query) {
        const q = filters.query.toLowerCase();
        list = list.filter(o => o.name.toLowerCase().includes(q) || o.description.toLowerCase().includes(q));
      }
      return { records: list, totalSize: list.length };
    }
    const qs = new URLSearchParams(filters).toString();
    return OcApi.sfRequest(`/opencore/organizations${qs ? '?' + qs : ''}`);
  }

  async function getOrganization(id) {
    if (OcApi.ApiConfig.mockMode) {
      await OcApi.mockDelay(400);
      const org = OpenCoreData.organizations.find(o => o.id === id);
      if (!org) throw new OcApi.ApiError(`Organization '${id}' not found.`, 404, 'NOT_FOUND');
      return org;
    }
    return OcApi.sfRequest(`/opencore/organizations/${id}`);
  }

  return { getOrganizations, getOrganization };
})();

window.OrganizationApi = OrganizationApi;


/* ============================================================
   OpenCore — Application API Service
   ============================================================ */
const ApplicationApi = (() => {
  async function getApplications(filters = {}) {
    if (OcApi.ApiConfig.mockMode) {
      await OcApi.mockDelay(500);
      let list = [...OpenCoreData.applications];
      if (filters.status) list = list.filter(a => a.status === filters.status);
      if (filters.query) {
        const q = filters.query.toLowerCase();
        list = list.filter(a => a.applicant.toLowerCase().includes(q) || a.issue.toLowerCase().includes(q) || a.repo.toLowerCase().includes(q));
      }
      return { records: list, totalSize: list.length };
    }
    const qs = new URLSearchParams(filters).toString();
    return OcApi.sfRequest(`/opencore/applications${qs ? '?' + qs : ''}`);
  }

  async function updateApplicationStatus(id, status) {
    if (OcApi.ApiConfig.mockMode) {
      await OcApi.mockDelay(600);
      if (window.__OC_MOCK_FAIL__) throw new OcApi.ApiError('Failed to update application.', 500, 'UPDATE_FAILED');
      const app = OpenCoreData.applications.find(a => a.id === id);
      if (!app) throw new OcApi.ApiError(`Application '${id}' not found.`, 404, 'NOT_FOUND');
      app.status = status;
      return { id, status, updatedAt: new Date().toISOString() };
    }
    return OcApi.sfRequest(`/opencore/applications/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  return { getApplications, updateApplicationStatus };
})();

window.ApplicationApi = ApplicationApi;


/* ============================================================
   OpenCore — Contribution API Service
   ============================================================ */
const ContributionApi = (() => {
  async function getContributions(filters = {}) {
    if (OcApi.ApiConfig.mockMode) {
      await OcApi.mockDelay(500);
      // Contributions are built dynamically in the page; return from shared mock store
      const list = [
        { id: 'cn-1', user: 'Priya Patel',    type: 'Pull Request', repo: 'firefox-devtools',  desc: 'Add dark mode support to console output formatting',     points: 20, status: 'Merged',    date: '2026-06-29' },
        { id: 'cn-2', user: 'Wei Zhang',       type: 'Pull Request', repo: 'pandas-core',       desc: 'Optimize groupby performance for large categorical data',  points: 70, status: 'Merged',    date: '2026-06-29' },
        { id: 'cn-3', user: 'Mei Lin',         type: 'Issue Closed', repo: 'helm-charts',       desc: 'Fix Helm chart values schema validation error',            points: 35, status: 'Closed',    date: '2026-06-28' },
        { id: 'cn-4', user: 'Elena Petrova',   type: 'Pull Request', repo: 'envoy-proxy',       desc: 'Add HTTP/3 support to listener configuration',             points: 90, status: 'In Review', date: '2026-06-28' },
        { id: 'cn-5', user: 'Daniel Kim',      type: 'Review',       repo: 'maven-build-plugin', desc: 'Reviewed PR #1182 — JSDoc comments for public API',       points: 8,  status: 'Completed', date: '2026-06-28' },
        { id: 'cn-6', user: 'Sofia Rossi',     type: 'Pull Request', repo: 'rust-analyzer-lsp', desc: 'Write integration tests for proc-macro expansion',         points: 60, status: 'Merged',    date: '2026-06-27' },
        { id: 'cn-7', user: 'Ava Martinez',    type: 'Pull Request', repo: 'pandas-core',       desc: 'Add type hints to core indexing module',                   points: 45, status: 'Merged',    date: '2026-06-26' },
        { id: 'cn-8', user: 'Liam Okafor',     type: 'Review',       repo: 'helm-charts',       desc: 'Reviewed PR #998 — chart schema validation',              points: 8,  status: 'Completed', date: '2026-06-25' },
        { id: 'cn-9', user: 'Marcus Johnson',  type: 'Pull Request', repo: 'firefox-devtools',  desc: 'Fix memory leak in inspector panel re-renders',            points: 40, status: 'In Review', date: '2026-06-25' },
        { id: 'cn-10', user: 'Isabella Garcia', type: 'Issue Closed', repo: 'kafka-connect',    desc: 'Improve error messages for malformed connector configs',    points: 15, status: 'Closed',    date: '2026-06-24' },
      ];
      let result = list;
      if (filters.type)  result = result.filter(c => c.type   === filters.type);
      if (filters.query) result = result.filter(c => c.user.toLowerCase().includes(filters.query.toLowerCase()) || c.repo.toLowerCase().includes(filters.query.toLowerCase()));
      return { records: result, totalSize: result.length };
    }
    const qs = new URLSearchParams(filters).toString();
    return OcApi.sfRequest(`/opencore/contributions${qs ? '?' + qs : ''}`);
  }

  return { getContributions };
})();

window.ContributionApi = ContributionApi;
