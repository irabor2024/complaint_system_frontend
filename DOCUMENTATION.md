# Application navigation guide

This document explains how to move through the **SmartCare Hospital Complaint Management** web app: public pages, sign-in, and the dashboard experience for **patients**, **staff**, and **admins**.

---

## 1. Before you start

- **Local URLs** (defaults): marketing site `http://localhost:5173`, API `http://localhost:4000`.
- **Roles** come from the account you use after login: **patient**, **staff**, or **admin**. The sidebar and available screens change automatically.
- **Theme**: use the sun/moon control on the landing header or in the dashboard top bar to switch light/dark mode.

---

## 2. Map of routes

### Public (no login required)

| Path | What it is |
|------|------------|
| **`/`** | Landing / marketing page (features, how it works, links to submit/track/login). |
| **`/submit`** | Submit a complaint (minimal header: home, track, submit, sign in). Works **without** an account. |
| **`/track`** | Look up a complaint by **ticket ID** (e.g. `CMP-2026-00001`). No login. |
| **`/login`** | Sign in. Also has quick-login buttons for seeded demo roles (if you ran `npm run prisma:seed` on the API). |
| **`*`** (unknown path) | “Not found” page. |

### Authenticated dashboard (login required)

All of these live under **`/dashboard`** … **`/`**. If you are not logged in, you are redirected to **`/login`**.

| Path | Typical use |
|------|-------------|
| **`/dashboard`** | Role-specific **home** (patient vs staff vs admin). |
| **`/dashboard/complaints`** | **Patient:** my complaints list · **Admin:** all complaints. |
| **`/dashboard/submit`** | Submit a complaint (same form as public submit, with optional profile prefill when logged in). |
| **`/dashboard/track`** | Track by ticket ID (same behavior as `/track`, inside dashboard chrome). |
| **`/dashboard/profile`** | Profile for the current role. |
| **`/dashboard/settings`** | Settings for the current role. |
| **`/dashboard/assigned`** | **Staff:** shortcut to assigned complaints (also available from sidebar). |
| **`/dashboard/complaint/:id`** | **Complaint detail** (timeline, description, staff actions when allowed). `:id` is the internal complaint ID from the API, not the ticket code. |
| **`/dashboard/analytics`** | **Admin:** analytics dashboard. |
| **`/dashboard/departments`** | **Admin:** manage departments. |
| **`/dashboard/staff`** | **Admin:** manage staff users. |

> **Note:** Staff and admin users can open URLs like `/dashboard/analytics` directly; use the sidebar for discovery.

---

## 3. Global UI patterns

### Landing page (`/`)

- **SmartCare** logo links home.
- Anchors **Features** and **How it works** scroll within the page.
- **Submit complaint** / **Track complaint** / **Sign in** / **Sign up** (sign up uses the same login screen in this demo).

### Public submit & track (`/submit`, `/track`)

- Compact top bar: brand, **Track**, **Submit**, **Sign in**.
- **Submit:** describe the issue; you can use **automatic routing** (AI picks category, priority, department) or check the box to choose category and department yourself. Attach files if needed.
- **Track:** enter the ticket ID you received after submit; see status, description, activity, staff responses, and attachment names. **Downloading files** requires signing in and opening the complaint from **My Complaints** (or the equivalent detail page).

### After login — dashboard shell

- **Left sidebar** — primary navigation; items depend on **role** (see sections 4–6).
- **Top bar** — menu toggle on small screens, search-style area (if present), **notifications** bell, theme toggle, **Dashboard/home** link, **Logout**.
- **Notifications** — bell opens a panel; unread count when available. New complaints can notify **admins** with links tied to the complaint record.
- **Footer** — appears on public layout; dashboard uses the shell’s layout.

Clicking **SmartCare** in the sidebar brand usually goes to **`/`** (marketing site), not only the dashboard.

---

## 4. Patient navigation

**Sidebar:** Dashboard · My Complaints · Submit Complaint · Track Complaint · Profile · Settings.

| Goal | Where to go |
|------|-------------|
| See overview | **`/dashboard`** |
| List my complaints | **`/dashboard/complaints`** |
| File a complaint | **`/dashboard/submit`** or public **`/submit`** |
| Check status by ticket | **`/dashboard/track`** or **`/track`** |
| Account details | **`/dashboard/profile`** |
| Preferences | **`/dashboard/settings`** |
| Open one complaint | From **My Complaints**, open the row/link → **`/dashboard/complaint/:id`** |

Patients only see complaints tied to their account email when listing; tracking by ticket on the public page may show limited detail compared to the dashboard.

---

## 5. Staff navigation

**Sidebar:** Dashboard · Assigned Complaints · Profile · Settings.

| Goal | Where to go |
|------|-------------|
| Overview of assigned work | **`/dashboard`** |
| All tickets assigned to me | **`/dashboard/assigned`** or **`/dashboard/complaints`** (same assigned view for staff in routing) |
| Work a single ticket | Open from list → **`/dashboard/complaint/:id`** |
| Profile / settings | **`/dashboard/profile`**, **`/dashboard/settings`** |

On **complaint detail**, staff may **update status**, **reply**, etc., only when that complaint is **assigned to them** (otherwise the API returns forbidden).

---

## 6. Admin navigation

**Sidebar:** Dashboard · Complaints · Analytics · Departments · Staff · Profile · Settings.

| Goal | Where to go |
|------|-------------|
| Operational overview | **`/dashboard`** |
| Full complaint list & filters | **`/dashboard/complaints`** |
| Charts / metrics | **`/dashboard/analytics`** |
| Departments CRUD | **`/dashboard/departments`** |
| Staff accounts | **`/dashboard/staff`** |
| Any complaint detail | From **Complaints** → **`/dashboard/complaint/:id`** |

Admins can assign staff, change priority, and moderate complaints according to API rules.

---

## 7. Login and logout

- **`/login`** — email + password. After **`npm run prisma:seed`** on the API, demo accounts use password **`ChangeMe123!`** (see **`README.md`** for seeded emails).
- Successful login sends you to **`/dashboard`** (role-specific home).
- **Logout** (top bar) clears the session and returns you toward the public experience (e.g. home).

---

## 8. Tips

1. **Ticket ID vs internal ID** — Patients see **ticket IDs** (`CMP-…`) on submit success and in emails; **URLs** for detail pages use the internal **`complaint.id`** from the database.
2. **Two ways to submit** — **`/submit`** (guest-friendly) and **`/dashboard/submit`** (logged-in, fields may prefill).
3. **CORS / API URL** — If the UI cannot reach the API, check **`VITE_API_URL`** (client) and **`CORS_ORIGIN`** (server); see **`README.md`**.
4. **Direct URLs** — Bookmark **`/dashboard/complaints`** etc. only works when **logged in** with a role that is allowed to use that screen.

---

## 9. Related docs

- **Setup and run:** [`README.md`](./README.md)
