# 🦁 GRYFFINDOR OS — Agent Operating & Architecture Standards

> **Project Reference**: Sreesh M & Mrithula M — Complete Digital Life, Study & Work Operating System  
> **Craft Protocol**: `@docs/GRYFFINDOR_CRAFT_PROTOCOL.md`  
> **Design Engineering Engine**: `.agents/skills/emilkowalski/` (18 skills + Apple HIG)

---

## 1. Prime Directive: Real Functionality Over Simulation

1. **Zero AI Dependency / Zero Hallucination**:
   - The user experience is powered by **deterministic rules, real database queries, and live system integrations**—not a generative AI chatbot.
   - Every button, form, filter, and action must actually execute a database query, update state, or trigger a real workflow.
2. **Three Connected Environments**:
   - 🌐 **Gryffindor Public** (`/`, `/sreesh`, `/mrithula`, `/projects`, `/work`, `/collaborations`, `/skills`, `/resumes`, `/atrium`, `/worlds`, `/designs`): Public portfolio, dimension atlas, and case studies.
   - 🔐 **Gryffindor Personal** (`/app/my-space`, `/app/academics`, `/app/finance`, `/app/focus`, `/app/habits`, `/app/career`): Isolated personal sanctuaries for Sreesh and Mrithula independently. Private records are guarded by PostgreSQL Row Level Security (RLS).
   - 🤝 **The Common Room** (`/app/dashboard`, `/app/quests`, `/app/projects`, `/app/attendance`, `/app/calendar`, `/app/messages`, `/app/analytics`, `/app/devices`): Shared collaborative headquarters for mutual consent-based task assignments, biometric work hours, calendar, and telemetry.
3. **Equal Control Guarantee**:
   - Both Sreesh and Mrithula have equal administrative rights. Neither can override or peek into the other's private data without explicit sharing.
   - Tasks assigned to each other require consent (Pending $\rightarrow$ Accepted / Declined).

---

## 2. Design Engineering & Craft Rules (Emil Kowalski Standards)

Governed by [`docs/GRYFFINDOR_CRAFT_PROTOCOL.md`](file:///E:/Projects/sreesh-mrithula/docs/GRYFFINDOR_CRAFT_PROTOCOL.md):

1. **Make High-Frequency Actions Instantaneous**:
   - Actions invoked 100+ times/day (Command Palette `⌘K`/`Ctrl+K`, navigation tabs, task checkmarks, search) must respond **immediately with zero animation delay** (Raycast speed).
   - No sluggish entrance transitions or artificial timers on core work tools.
2. **Tactile Button Press is Selective, Never Blanket-Forced**:
   - Do **NOT** apply `transform: scale(0.975)` globally across all buttons, as it interferes with components using custom translation, drag gestures, or 3D rotation.
   - Apply tactile press selectively using `.btn-tactile:active`, `.btn-press:active`, `.apple-btn:active`, or composed Framer Motion springs.
3. **Numeric Stability (Tabular Numbers)**:
   - Always enforce `tabular-nums` / `font-variant-numeric: tabular-nums` on attendance timers, currency, clock-in counters, exam countdowns, and metrics so numbers do not horizontally wobble during real-time updates.
4. **Apple UI Design & Fluid Interfaces (WWDC HIG)**:
   - Translucent functional layers (`.apple-glass`, `backdrop-filter: blur(20px) saturate(180%)`) with a light-catching top bevel (`border-top: 1px solid rgba(255,255,255,0.15)`).
   - Critically damped springs (`damping: 1.0`, response `0.35s`) by default; bounce reserved strictly for momentum flicks.
   - Optical typography: negative tracking on large headlines (`-0.035em`), positive tracking on small captions (`+0.025em`).
   - Symmetrical paths: dialogs exit in the same direction they entered; popovers scale from their trigger button origin.

---

## 3. Technology Architecture & Persistence

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons.
- **Audio Synthesis**: Native Web Audio API (`AudioSynthesizer.ts`) for deterministic chime, click, hover, and alert feedback.
- **Backend / Database**: PostgreSQL via Supabase with Row Level Security (RLS).
  - Migrations: `supabase/migrations/20261108000000_init_sreesh_mrithula.sql` and `20261108010000_gryffindor_tasks.sql`.
- **Hybrid Storage & Offline Resilience**: `src/services/workOsStorage.ts` provides instant local execution and automatically syncs to Supabase Realtime when connected.
- **Multi-Device Synchronization**: Real-time WebSocket updates between HP OMEN (Windows), MacBook, and iPhone.

---

## 4. Verification Gate Before Shipping

Every pull request or release must pass:
1. `npm run build`: Zero TypeScript errors, zero bundling errors.
2. Responsive check: Viewports at 320px, 375px, 390px (iPhone), 768px (iPad), 1024px, 1440px (MacBook), and 1920px+ (HP OMEN) with zero unwanted horizontal overflow.
3. Contrast verification: All theme and palette overrides must maintain WCAG 2.1 AA contrast ($4.5:1$).
4. Data persistence: Verify actions persist across browser refresh and logout/login.
