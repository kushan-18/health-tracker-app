# VitalX AI — Full Product Audit

**Date:** 2026-08-04
**Status:** Pre-Beta Audit

---

## Category A: Fully Supabase-Connected (Real Data)

| Page | Backend | Notes |
|------|---------|-------|
| `dashboard/page.tsx` | `Promise.allSettled` — 5 queries (weight_logs, health_metrics, meals, workouts, water_logs) | Empty states for new users |
| `nutrition/page.tsx` | Meals, water_logs, food_search (Open Food Facts API) | `foods`/`recipes` in data.ts kept as reference templates only |
| `health/page.tsx` | health_metrics (dynamic metrics) | Heart/Sleep tabs show empty states (no DB columns yet) |
| `analytics/page.tsx` | weight_logs only (`weight` column, NOT `weight_kg`) | Body composition / compare tabs show empty states |
| `sports/page.tsx` | workouts (history + performance stats) | Derived from workouts table |
| `sports/[id]/page.tsx` | Single workout by ID | — |
| `calendar/page.tsx` | workouts + meals + health_metrics combined into events | — |
| `workout/page.tsx` | Workouts read/write | Still imports `exercises`/`workoutPlanSample` from data.ts for exercise library UI (templates, not user data) |
| `workout/[id]/page.tsx` | Single workout by ID | — |
| `auth/login/page.tsx` | `signInWithPassword` | No `router.refresh()` |
| `auth/register/page.tsx` | `signUp` | No `router.refresh()` |
| `auth/callback/route.ts` | OAuth callback | — |
| `profile/setup/page.tsx` | Writes to `profiles` table | — |
| `settings/page.tsx` | Real `signOut` | — |

---

## Category B: Demo/Placeholder (Honest — Not Claiming Real)

| Page | Issue | Severity |
|------|-------|----------|
| `coach/page.tsx` | Hardcoded AI responses (4 canned answers, 1 fallback). No real AI integration. | Low — expected for prototype |
| `reports/page.tsx` | Hardcoded weekly data, macros data, report generation is `window.open` + `print()`. | Low — PDF export is functional (prints the page) |

---

## Category C: Fake Data Presented as Real (Trust Risk)

| Page | Issue | Severity |
|------|-------|----------|
| `social/page.tsx` | Entire page is fake: hardcoded feed posts, fake friends list, fake challenges, fake leaderboard. No Supabase tables exist for social features. | **High** |
| `community/page.tsx` (if exists) | Likely same as social | **High** |

---

## Category D: Landing Page Issues (`page.tsx`)

### D1: Pricing Bug (Line 571)
```tsx
<span className="text-4xl font-bold">${plan.price}</span>
```
`plan.price` already contains `₹` symbol (e.g. `"₹399"`). Renders as **`$₹399`** — broken display.

**Fix:** Remove the `$` prefix.

### D2: Dead "Watch Demo" Button (Line 144)
```tsx
<a href="#features">Watch Demo</a>
```
Links to `#features` — no demo exists. Misleading.

**Fix:** Disable or relabel as "Explore Features".

### D3: Fake Sports Metrics (Lines 401-417)
Sports section shows hardcoded metrics (VO2 Max: 48, FTP: 245W, etc.) as if they're real user data.

**Fix:** Show as example capabilities, or remove specific numbers.

### D4: Fake Leaderboard / Community (Lines 488-518)
Fake leaderboard with 5 fake users. "Connect with millions of health enthusiasts" claim.

**Fix:** Add disclaimer or remove the section.

### D5: Misleading Claims
- **Line 494:** "Connect with millions of health enthusiasts" — no users exist yet
- **Line 356:** "Photo Recognition" tag — not implemented
- **Line 398:** "Track performance across 50+ sports" — only workout logging exists
- **Line 354:** "photo recognition" for meal tracking — not implemented

### D6: Dead Footer Links (Lines 648-655)
Several footer links go to `#` or `#features`:
- Company: Blog (#), Careers (#), Press (#)
- Support: Help Center (#), Contact (#)

**Fix:** Remove or disable these.

---

## Category E: Missing Infrastructure

| Feature | Status |
|---------|--------|
| Real AI integration | Not connected — coach has 4 hardcoded responses |
| Social/community tables in Supabase | Don't exist |
| Heart rate / sleep DB columns | Not in schema |
| Body composition DB columns | Not in schema |
| Device integrations (Apple Health, etc.) | Not implemented |
| Photo recognition for meals | Not implemented |
| Subscription/payment system | Not implemented |
| Email notifications | Not implemented |
| Real user-generated content | None (all users are demo) |

---

## Summary: Files Requiring Changes

### High Priority (Trust)
1. **`src/app/page.tsx`** — Fix pricing bug (`$₹`), remove dead demo button, add disclaimers to community/testimonials, remove misleading claims
2. **`src/app/social/page.tsx`** — Add prominent "Demo" label or disable the page
3. **`src/app/reports/page.tsx`** — Add disclaimer that reports use sample data

### Medium Priority (Build)
4. **Build verification** — `npx next build` must pass clean

### Low Priority (Future)
5. `coach/page.tsx` — Works fine as prototype
6. `src/lib/data.ts` — Acceptable as reference/template data

---

## Recommended Next Phase

1. **Sprint 1:** Fix all Category D issues (landing page trust)
2. **Sprint 2:** Add social Supabase tables OR hide social page
3. **Sprint 3:** Real AI integration (OpenAI/Claude API)
4. **Sprint 4:** Device integrations, photo recognition
5. **Sprint 5:** Subscription system
