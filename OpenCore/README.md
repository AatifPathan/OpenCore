# OpenCore — Open Source Contribution Management Platform

A complete, modern frontend prototype for **OpenCore**, a Salesforce-style SaaS platform where organizations publish repositories and issues, contributors apply to work on them, mentors guide contributors, and badges reward participation.

Built with **only HTML5, CSS3, and Vanilla JavaScript** — no frameworks, no UI libraries (Chart.js is used solely for dashboard analytics charts).

## ✨ Design Inspiration
GitHub (repository semantics) · Linear (clean information density) · Vercel (typography, spacing, dark sidebar) · Salesforce Lightning Design System (enterprise component patterns)

## 📁 Folder Structure

```
OpenCore/
├── index.html                 → Login
├── dashboard.html              → Dashboard (KPIs, charts, widgets)
├── organizations.html          → Organizations directory
├── projects.html                → Projects (initiatives)
├── repositories.html           → Repository directory + filter panel
├── repository-details.html     → Single repository (tabs: overview/issues/contributors/activity)
├── issues.html                  → Issues board
├── contributors.html           → Contributors directory
├── contributor-profile.html    → Single contributor profile
├── applications.html           → Application review queue
├── contributions.html          → Contribution history table
├── mentors.html                 → Mentors directory
├── skills.html                  → Skills catalogue
├── badges.html                  → Badge showcase
├── settings.html                → Account settings panel
│
├── assets/
│   ├── css/
│   │   ├── style.css          → Design tokens, reset, shell layout, base components
│   │   ├── dashboard.css      → KPI cards, charts, dashboard-only widgets
│   │   ├── components.css     → Repo/contributor/org/mentor cards, filters, settings, profile header
│   │   └── responsive.css     → Mobile-first breakpoints (1280/1024/768/480)
│   │
│   ├── js/
│   │   ├── utils.js           → Formatting, date, avatar, badge helpers
│   │   ├── layout.js          → Shared sidebar/topbar injection (mountLayout)
│   │   ├── app.js              → Shared data store + toasts + modals + dropdowns + tabs
│   │   └── dashboard.js        → Dashboard-specific rendering + Chart.js setup
│   │
│   ├── images/                 (placeholder — avatars are generated via CSS-colored initials)
│   └── icons/                  (placeholder — icons are inline SVG, no icon font dependency)
│
└── README.md
```

## 🧩 Architecture Notes

- **Shared shell, zero duplication of nav markup.** Every page has empty `#sidebarMount` / `#topbarMount` divs. `assets/js/layout.js` defines the sidebar navigation and topbar once and injects them via `mountLayout(activePage, { breadcrumb })` on `DOMContentLoaded`. To add a new sidebar link, edit `NAV_ITEMS` in `layout.js` only.
- **Single dummy "backend".** `assets/js/app.js` exposes `OpenCoreData`, an in-memory object holding organizations, repositories, issues, contributors, applications, badges, skills, mentors, notifications, and deadlines. All pages read from this same object, so data is consistent across pages (e.g. the same contributors appear on the dashboard, contributors list, and applications queue).
- **Reusable UI primitives in CSS**, all driven by CSS custom properties defined in `:root` in `style.css` (colors, spacing, radii, shadows, typography). Swapping the theme means editing those variables once.
- **Toasts & confirmation dialogs** are JS-generated (`showToast()`, `showConfirmDialog()` in `app.js`) and can be called from any page without extra markup.
- **Loading skeletons** use a CSS shimmer animation (`.skeleton`) and appear as static fallback markup in `dashboard.html`'s KPI grid before JS populates real values.
- **Empty states** are rendered by each page's JS whenever a filtered/searched list comes back empty (organizations, repositories, issues, contributors, applications, skills, badges, mentors).

## 🎨 Design System Highlights

- **Palette:** Primary blue `#0057D9`, near-black sidebar `#0F172A`, neutral surface grays — enterprise blue/white throughout.
- **Typography:** Inter (UI text) + JetBrains Mono (repo names, code-like values).
- **Cards:** Consistent radius (12px), subtle shadow on rest, elevated shadow + translateY on hover.
- **Status semantics:** Difficulty (green/amber/red), application status (pending/approved/rejected), issue status (open/in-progress/closed) all use the same badge component with different color tokens.

## 📱 Responsive Behavior

Mobile-first: at ≤768px the sidebar becomes an off-canvas drawer (hamburger menu + overlay), KPI/card grids collapse to 1–2 columns, the filter panel on Repositories hides (toolbar filter button shown instead), and table-like rows (Applications) reflow into stacked cards.

## ▶️ Running Locally

No build step required. Open `index.html` directly in a browser, or serve the folder with any static server:

```bash
cd OpenCore
python3 -m http.server 8000
# visit http://localhost:8000
```

Login page → "Sign In" → redirects to `dashboard.html` (no real auth, purely a UX flow demo).

## 🔌 Extending with a Real Backend

Replace `OpenCoreData` in `app.js` with `fetch()` calls to your API, keeping the same shape (arrays of objects with the same field names) so the rendering functions in each page's `<script>` block continue to work unchanged.
