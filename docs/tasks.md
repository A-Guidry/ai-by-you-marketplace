# AI by You — Implementation Task List

## Phase 1: Foundation & Authentication (Weeks 1–2)

### 1.1 Repository & Project Setup
- [x] Initialize Next.js project with App Router
- [x] Configure Tailwind CSS (port existing config from prototype)
- [x] Set up Git repository with `.gitignore`, branch strategy
- [x] Install core dependencies: `lucide-react`, `@supabase/supabase-js`, etc.
- [x] Configure ESLint, Prettier, and project-level TypeScript settings
- [x] Set up environment variable structure (`.env.local`, `.env.example`)

### 1.2 Component Migration (from prototype → Next.js)
- [x] Extract `ProjectCard` component from monolithic `App.jsx`
- [x] Extract `SortButton` component
- [x] Extract `SidebarTag` component
- [x] Extract `PlatformIcon` component
- [x] Extract `UploadIcon` component
- [x] Create `Navbar` component (search bar, upload button, avatar)
- [x] Create `SortingBar` component (Hot / Top Ranked / New Arrivals + Filters button)
- [x] Create `Sidebar` layout component (LMArena card, Trending Tech, Community Notice)
- [x] Create shared utility module: `formatNumber()`, `getPriceSubtext()`
- [x] Set up Next.js layout (`app/layout.tsx`) with global styles, fonts, metadata
- [x] Create the main marketplace page (`app/page.tsx`) composing all components
- [x] Verify pixel-accurate parity with the original UI prototype

### 1.3 Authentication Integration
- [x] Provision Supabase project (or Firebase — decision required)
- [x] Implement sign-up flow (Email/Password)
- [x] Implement OAuth login (Google)
- [x] Implement OAuth login (GitHub)
- [x] Build auth context / provider for client-side session state
- [x] Create login/signup modal or page UI
- [x] Protect authenticated routes (upload, voting)
- [x] Display logged-in user avatar in Navbar

### 1.4 Database Setup
- [x] Design and create `users` table (id, username, email, wallet_address, created_at)
- [x] Design and create `projects` table (id, title, developer_id, category, genre, type, platforms[], os[], aiFeatures[], description, price_model, image_url, created_at)
- [x] Design and create `metrics` table (project_id, downloads_count, upvotes, downvotes, hot_score)
- [x] Design and create `votes` ledger table (user_id, project_id, vote_type)
- [x] Set up Row-Level Security (RLS) policies in Supabase
- [x] Seed the database with the 6 mock projects from the UI prototype

---

## Phase 2: Core Marketplace Functionality (Weeks 3–4)

### 2.1 Dynamic Data Fetching
- [x] Replace `initialProjects` mock data with Supabase API calls
- [x] Create server-side data-fetching functions (Next.js Server Components or API routes)
- [x] Implement loading / skeleton states for the project feed
- [x] Implement error handling and empty-state UI

### 2.2 Voting System
- [x] Build backend API route / Supabase RPC for casting a vote
- [x] Enforce single-vote-per-user via `votes` ledger (upsert logic)
- [x] Implement vote toggle (upvote ↔ undo ↔ downvote) matching the existing client-side logic
- [x] Update aggregate `metrics.upvotes` / `metrics.downvotes` on each vote
- [x] Optimistic UI updates on vote click (instant feedback, rollback on error)
- [x] Require authentication before voting (redirect or show login prompt)

### 2.3 Sorting Algorithms (Server-Side)
- [x] Implement **Hot** sort query (score-weighted by recency, e.g., Reddit-style decay)
- [x] Implement **Top Ranked** sort query (pure score DESC)
- [x] Implement **New Arrivals** sort query (created_at DESC)
- [x] Wire sorting bar buttons to re-fetch / re-query with selected sort
- [x] Add URL query parameter support (`?sort=hot`) for shareable links

### 2.4 Filtering System
- [x] Build Filter panel UI (expandable from the "Filters" button)
- [x] Filter by **OS** (Windows, macOS, Linux, iOS, Android, Web)
- [x] Filter by **Category** (Game / App)
- [x] Filter by **Platform** (PC, Console, Mobile, Web)
- [x] Filter by **Genre** (Action, Simulation, Finance, Productivity, Mystery, etc.)
- [x] Combine filters with sorting; reflect active filters in URL params
- [x] Show active filter count / badges on the Filters button

---

## Phase 3: Developer Portal & Upload Flow (Week 5)

### 3.1 Developer Dashboard
- [x] Create `/dashboard` route with auth guard
- [x] Build "My Projects" list view (developer's submitted projects)
- [x] Add edit/delete actions for owned projects
- [x] Show per-project analytics (downloads, votes, trend)

### 3.2 Upload Project Flow
- [x] Create `/upload` or `/dashboard/new` route
- [x] Build multi-step form — **Step 1:** Title, Description
- [x] Build multi-step form — **Step 2:** File uploads or external links
- [x] Build multi-step form — **Step 3:** Metadata (Platforms, OS, AI Features tags)
- [x] Build multi-step form — **Step 4:** Pricing model selection (IAP, BYOK, Subscription, One-time, Free)
- [x] Add client-side + server-side form validation
- [x] Submit project data to Supabase `projects` table

### 3.3 Image / Asset Hosting
- [x] Set up Supabase Storage bucket (or AWS S3) for thumbnails & screenshots
- [x] Implement image upload with drag-and-drop UI
- [x] Generate and store optimized thumbnail URLs
- [x] Display uploaded images in `ProjectCard` (replace gradient placeholders)

---

## Phase 4: Advanced Curation & LMArena (Weeks 6–7)

### 4.1 LMArena MVP
- [x] Create `/arena` route and page
- [x] Build randomized matchmaking: pick 2 anonymous projects for comparison
- [x] Design side-by-side Arena UI (two project previews with "Vote A / Vote B")
- [x] Record arena votes in a new `arena_votes` table
- [x] Prevent the same user from rating the same pair twice

### 4.2 Elo Rating Backend
- [x] Implement Elo rating calculation function (K-factor, expected score, adjustment)
- [x] Update each project's Elo score after every arena vote
- [x] Surface Elo-based ranking in a new "Arena Ranked" sort option or leaderboard
- [x] Create an `/arena/leaderboard` view (integrated into main feed as Arena Leaders)

### 4.3 Trending Tags
- [x] Create a backend function / cron job to aggregate `aiFeatures` popularity over the last 24 hours
- [x] Replace hardcoded `SidebarTag` data with dynamically fetched trending tags
- [x] Show tag counts based on real project data
- [x] Make tags clickable → filter feed by that AI feature

---

## Phase 5: Testing, Polish, and Launch (Week 8)

### 5.1 Quality Assurance
- [x] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [x] Mobile responsiveness audit (breakpoints, touch targets)
- [x] Accessibility audit (keyboard navigation, ARIA labels, contrast)
- [x] End-to-end tests for critical flows (login, vote, upload, arena)

### 5.2 Load & Performance Testing
- [x] Simulate concurrent voting to check for race conditions
- [x] Load-test API routes and database queries
- [x] Optimize slow queries, add indexes as needed
- [ ] Implement rate limiting on vote and upload endpoints

### 5.3 Analytics & Monitoring
- [x] Integrate PostHog or Google Analytics
- [x] Track CTR on project cards, sort changes, filter usage
- [ ] Set up error tracking (Sentry or similar)
- [ ] Create a basic admin dashboard for platform metrics

### 5.4 Deployment & Launch
- [ ] Configure Vercel project (or AWS Amplify)
- [ ] Set up environment variables on hosting platform
- [ ] Configure custom domain and SSL
- [ ] Set up CI/CD pipeline (auto-deploy on merge to `main`)
- [ ] Final smoke test on production
- [ ] 🚀 Launch V1.0
