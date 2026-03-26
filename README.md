## Hospital Complaint Management System

A role-based web application for managing hospital complaints end-to-end.
Patients can submit and track complaints, staff can review and update assigned cases, and admins can monitor overall performance through dashboards and analytics.

## Features

- Patient complaint submission with generated ticket IDs (`CMP-2026-XXXX`)
- Public complaint tracking by ticket ID
- Staff dashboard for assigned complaints and status updates
- Admin dashboard for complaint oversight, departments, staff, and analytics
- Status timeline, priorities, notifications, and response history
- Responsive UI built with reusable components

## Tech Stack

- React 18 + TypeScript
- Vite 5
- Tailwind CSS + shadcn/ui + Radix UI
- React Router
- TanStack Query
- Vitest + Testing Library

## Important Note

This project currently uses **mock in-memory data/services** (`src/mock-data` and `src/services/api.ts`).
Data resets on page refresh or app restart, and no real backend/database is connected yet.

## Getting Started

### Prerequisites

- Node.js 18+ (recommended)
- npm 9+ (or compatible)

### Installation

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

The app runs on `http://localhost:8080`.

## Available Scripts

- `npm run dev` - Start Vite dev server
- `npm run build` - Build production bundle
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint


## Main Routes

- `/` - Landing page
- `/submit-complaint` - Complaint submission form
- `/track` - Complaint tracking page
- `/staff` - Staff area (dashboard and complaint management)
- `/admin` - Admin area (dashboard, complaints, departments, staff, analytics, settings)

## Project Structure

```text
src/
  components/       Reusable UI and feature components
  hooks/            Auth, utility, and UI hooks
  layouts/          Admin and staff layout wrappers
  mock-data/        Seeded demo data
  pages/            Route-level pages
  services/         API-like service layer (mocked)
  types/            Shared TypeScript types
```

## Next Improvements

- Replace mock services with real REST/GraphQL APIs
- Add authentication/authorization with protected routes
- Persist data with a database
- Add end-to-end tests and CI checks
- Update SEO metadata in `index.html` to match this project
