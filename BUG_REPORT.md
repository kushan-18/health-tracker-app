# VitalX AI — QA Bug Report

**Date:** 2026-08-06
**Scope:** Full-stack QA sweep (UI, logic, auth/security, a11y, responsive, console/network, build)
**Environment:** Local Next.js 16 dev + production build (Turbopack), headless Chrome via CDP at 1440px / 375px / 768px
**Status:** Bugs marked **FIXED** were patched in this pass; the rest remain for the product owner.

---

## Severity Summary

| Severity | Open | Fixed |
|----------|------|-------|
| Critical | 2 | 3 |
| High     | 1 | 1 |
| Medium   | 3 | 5 |
| Low      | 2 | 0 |

---

## Critical

### C-01. OTP verification is fake — any 6 digits grant access  ✅ FIXED
- **File:** `src/app/auth/otp/page.tsx`
- **Repro:** Open `/auth/otp`, type any 6 digits (e.g. `000000`), click **Verify**.
- **Actual:** `handleVerify` used `setTimeout(2000)` then `window.location.href = "/profile/setup"`. No code was ever checked against Supabase. "Resend Code" also just waited 1s.
- **Expected:** The OTP must be validated against the user's email (`supabase.auth.verifyOtp`).
- **Fix applied:** `handleVerify` now calls `supabase.auth.verifyOtp({ email, token, type: "email" })`; errors are surfaced inline; `handleResend` calls `signInWithOtp({ email, shouldCreateUser: false })` and resets the 30s countdown. Email is read from `?email=` query param.
- **Security note:** The old code meant the "email verification" gate was cosmetic; any visitor could reach the onboarding flow with no proof of email ownership.

### C-02. Forgot-password page never sent a reset email  ✅ FIXED
- **File:** `src/app/auth/forgot-password/page.tsx`
- **Repro:** Go to `/auth/forgot-password`, submit a valid email, wait.
- **Actual:** `onSubmit` only ran `setTimeout(1500)` and showed "Check your email". No Supabase call — no email was ever sent. The page was also unreachable (no link from login).
- **Expected:** `supabase.auth.resetPasswordForEmail()` is called and an error is shown on failure.
- **Fix applied:** `onSubmit` now calls `resetPasswordForEmail` with a `redirectTo` of `/auth/forgot-password?reset=true`. Added a real password-reset form rendered when `?reset=true` (calls `supabase.auth.updateUser`), plus error display and a working "Resend Email". Added a **Forgot password?** link on the login page.

### C-03. Register flow bypassed email verification  ✅ FIXED
- **File:** `src/app/auth/register/page.tsx`
- **Repro:** Register with a new email while Supabase email confirmation is enabled.
- **Actual:** After `supabase.auth.signUp`, the app pushed straight to `/profile/setup` without verifying the email. The OTP page (`/auth/otp`) was in `proxy.ts` `authRoutes` but never routed to from any page.
- **Expected:** If a session is returned (confirmation off), go to `/profile/setup`; otherwise send an OTP and route to `/auth/otp?email=...`.
- **Fix applied:** Register now checks `signUpData.session`; if absent, it sends an email OTP via `signInWithOtp({ email, shouldCreateUser: false })` and routes to `/auth/otp?email=<encoded>`.

### C-04. `useSearchParams` prerender crash on `/auth/otp`  ✅ FIXED (build)
- **File:** `src/app/auth/otp/page.tsx`
- **Repro:** `npm run build` — aborted at "Generating static pages" with `useSearchParams() should be wrapped in a suspense boundary`.
- **Fix applied:** Extracted the form into `OtpPageContent` and wrapped it in `<Suspense>` in the default export. Build now completes cleanly (all 28 routes).

---

## High

### H-01. Chat input & icon-only buttons lack accessible names  ✅ FIXED
- **Files:** `src/app/coach/page.tsx`, `src/app/page.tsx`
- **Repro:** Run an a11y scan (e.g. axe) on `/coach` and `/`. Screen readers announce unlabeled controls.
- **Actual:** Coach chat input had no label/aria-label; coach **Send** button was icon-only. Landing page mobile menu toggle and demo-chat send button were icon-only, and the "Ask your AI coach…" demo input had no label.
- **Expected:** Every input/button has a programmatic name.
- **Fix applied:** `aria-label` on coach input + send button; `aria-label` on landing menu/send buttons; visually-hidden `<label htmlFor>` for the landing demo input.

---

## Medium

### M-01. Login form: labels not associated with inputs  ✅ FIXED
- **File:** `src/app/auth/login/page.tsx`
- **Repro:** Inspect email/password inputs; labels are plain `<label>` without `htmlFor`, inputs without `id`.
- **Impact:** Screen readers don't announce field names; clicking label text doesn't focus the field.
- **Fix applied:** Added `htmlFor`/`id` pairs, `aria-label` on the show/hide-password toggle, and a "Forgot password?" link.

### M-02. Register form: 4 unlabeled inputs + 2 icon-only buttons  ✅ FIXED
- **File:** `src/app/auth/register/page.tsx`
- **Repro:** A11y scan of `/auth/register` reports 4 unlabeled inputs (name/email/password/confirm) and 2 empty buttons (eye toggles).
- **Fix applied:** `htmlFor`/`id` on all four fields; `aria-label` on both eye toggles.

### M-03. OTP page: 6 unlabeled digit inputs  ✅ FIXED
- **File:** `src/app/auth/otp/page.tsx`
- **Repro:** A11y scan of `/auth/otp` reports all six boxes unlabeled.
- **Fix applied:** Added `aria-label="Verification code digit N"` to each.

### M-04. Content clipped under fixed navbar (auth/landing pages)  ✅ FIXED (earlier pass)
- **Files:** `src/components/layout/app-layout.tsx`, `src/components/layout/navbar.tsx`, `src/app/page.tsx`
- **Repro:** First content block on protected pages appeared at y=24 under the 64px header; header was transparent (blur only) making dropdown text ghost through.
- **Fix applied:** `<main>` now uses `pt-16 min-h-screen ...`; header uses `bg-background/90 backdrop-blur-md`; dropdowns use opaque `bg-zinc-900`. Verified via CDP: content starts at y=64, overlap count 0.

### M-05. Coach chat messages didn't scroll / no typing indicator  ✅ FIXED (earlier pass)
- **File:** `src/app/coach/page.tsx`
- **Repro:** Long threads never auto-scrolled; no visual feedback while waiting for the AI reply.
- **Fix applied:** `min-h-0` flex chain + scrollTop-based auto-scroll with stick-to-bottom detection; 3-dot bouncing indicator while streaming.

---

---

## 2026-08-07 Follow-up — 3 bug fixes

### F-01. Settings do not persist to the database  ✅ FIXED
- **File:** `src/app/settings/page.tsx`
- **Repro:** Change units/toggles/privacy preferences, reload the page — everything resets.
- **Actual:** Toggles only updated local React state; nothing was saved.
- **Fix applied:** Preferences are now loaded via `getPreferences()` (reads `profiles.preferences` JSONB) on mount and saved via `updatePreferences()` on every change, with a "Changes saved" banner. Works for units, privacy, and notification toggles.
- **Verified (E2E):** Toggled lb → "Changes saved" → reload → `lbsActive=true` persisted.

### F-02. Sport sessions were never saved  ✅ FIXED
- **File:** `src/app/sports/page.tsx`, `src/lib/data-operations.ts`
- **Repro:** Start a sport session, let it track time/calories/distance, end it — the session was lost (History/Performance re-derived from `getWorkouts()` which had no session data).
- **Actual:** Session metrics (duration, calories, distance, heart rate) lived only in ephemeral component state.
- **Fix applied:** New `sport_sessions` table (migration), plus `getSportSessions`/`addSportSession`/`deleteSportSession`. History/Performance now read from `sport_sessions`; "End Session"/"Finish" persists the completed session. RLS owner-scoped.
- **Verified (E2E):** Pick Running → Start Session → Finish → History shows the saved Running session.

### F-03. AI Workout Generator navigated to `/workout/undefined` / no real AI  ✅
- **File:** `src/app/workout/page.tsx` (AI Generator tab), `src/lib/data-operations.ts`
- **Repro:** The "AI Generator" tab had no backend: selecting it crashed the page and it never used Gemini.
- **Fix applied (AI tab now works end-to-end):**
  1. Wired the tab to a real Supabase client; removed the client-only crash. Form validation + loading + error states added.
  2. Saved plans go into a new `workout_plans` table via `addWorkoutPlan`; "Save This Plan" persists the generated plan.
  3. New server route `src/app/api/generate-workout` calls Gemini (`gemini-flash-latest`) with validated goal/experience/days/equipment and returns a typed plan.
- **Bug found during verification:** Gemini's pretty-printed JSON was being truncated at `maxOutputTokens: 2048`, producing invalid/partial JSON → repeated 422 "Could not parse". **Fixed by setting `responseMimeType: "application/json"` and raising the budget to 8192**, plus a retry-and-parse fallback.
- **Verified (E2E):** Generate → real 4-day "Muscle Building" plan renders with exercises + sets×reps; "Save This Plan" → "Plan saved successfully"; row confirmed in `workout_plans` via REST (HTTP 200 with plan JSON).

---

## Remaining / Recommendations (not fixed in this pass)

### R-01 (Critical, open) — Auth API leaks underlying DB errors to clients
- **Files:** `src/app/api/chat/route.ts`, `src/app/api/chat/history/route.ts`, `src/app/api/analyze-food/route.ts`
- **Detail:** Catch blocks return `err.message` (e.g. raw Postgres/Supabase error text) to the browser with HTTP 500. This can reveal table/schema details.
- **Suggestion:** Return generic messages ("Something went wrong"), log the real error server-side.

### R-02 (High, open) — No RLS seed check / `chat_history` vs `chat_messages` mismatch
- **Files:** `src/lib/data-operations.ts` (uses `chat_history`), `src/app/api/chat/*` (use `conversations` + `chat_messages`).
- **Detail:** `data-operations.ts` `getChatHistory`/`addChatMessage` target a `chat_history` table that the seed SQL (`supabase-chat-tables.sql`) never creates; the API routes use different tables. Dead code / drift.
- **Suggestion:** Align on `conversations` + `chat_messages`, or remove the unused `chat_history` helpers.

### R-03 (Medium, open) — Auth pages static; no `autocomplete`/`aria-describedby` on password fields
- **Files:** `src/app/auth/login/page.tsx`, `register/page.tsx`, `forgot-password/page.tsx`
- **Suggestion:** Add `autoComplete="email" / "current-password" / "new-password"` and hook error `<p>`s to inputs with `aria-describedby`/`aria-invalid`.

### R-04 (Medium, open) — 2 unlabeled image-less footer social links
- **File:** `src/app/page.tsx` (footer `#` links "Twitter/GitHub/Discord")
- **Detail:** Links point to `#` and have no target URL — dead links. Either point to real profiles or remove; add `aria-label` if kept as icons.

### R-05 (Low, open) — No rate limiting / abuse guards on `/api/chat` beyond Supabase RLS
- **Detail:** Per-user DB constraints protect data, but there is no quota on AI chat turns server-side (the "5 msgs/day" claim on the landing pricing is not enforced anywhere).
- **Suggestion:** Track a daily `chat_messages` count per user in the API and reject over quota with 429.

### R-06 (Low, open) — `sports/[id]` and `reports/[id]` are server-rendered (`ƒ`)
- **Detail:** These render on demand; fine for now, but consider caching/static generation where data is non-personal.

---

## Verified Healthy (no findings)
- No horizontal overflow at 1440px across all 19 tested routes.
- Landing page has a valid single-H1 heading outline.
- Navbar overlap: first content at y=64, `underHeader` overlap = 0 after fixes.
- `net::ERR_ABORTED` entries on `/coach`, `/auth/login`, `/auth/register` are benign canceled navigations, not errors.
- Production build passes cleanly: `✓ Compiled`, `TypeScript OK`, all 28 routes, proxy middleware compiled.
- All API routes require an authenticated user (`supabase.auth.getUser()`) before serving data.
- `GEMINI_API_KEY` is only read server-side (`process.env`), never exposed to the client.
