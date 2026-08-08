-- ============================================================
-- VitalX AI — Fix migrations (Settings, Sport Sessions, Workout Plans)
-- Run this in the Supabase SQL Editor after supabase-setup.sql
-- ============================================================

-- ------------------------------------------------------------------
-- 1. Settings persistence: add a JSONB `preferences` column to profiles
-- ------------------------------------------------------------------
alter table public.profiles
  add column if not exists preferences jsonb default '{}'::jsonb;

-- ------------------------------------------------------------------
-- 2. Sport sessions table
-- ------------------------------------------------------------------
create table if not exists public.sport_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  sport text not null,
  duration_minutes integer not null default 0,
  calories_burned integer not null default 0,
  distance numeric not null default 0,
  avg_heart_rate integer not null default 0,
  notes text default '',
  completed_at timestamptz default now()
);

create index if not exists idx_sport_sessions_user_date
  on public.sport_sessions(user_id, completed_at desc);

alter table public.sport_sessions enable row level security;

create policy "Users can view own sport sessions"
  on public.sport_sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert own sport sessions"
  on public.sport_sessions for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own sport sessions"
  on public.sport_sessions for delete
  using (auth.uid() = user_id);

-- ------------------------------------------------------------------
-- 3. Workout plans table (AI-generated plans)
-- ------------------------------------------------------------------
create table if not exists public.workout_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  goal text not null,
  experience text not null,
  days_per_week integer not null,
  equipment text not null,
  plan jsonb not null default '[]',
  created_at timestamptz default now()
);

create index if not exists idx_workout_plans_user
  on public.workout_plans(user_id, created_at desc);

alter table public.workout_plans enable row level security;

create policy "Users can view own workout plans"
  on public.workout_plans for select
  using (auth.uid() = user_id);

create policy "Users can insert own workout plans"
  on public.workout_plans for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own workout plans"
  on public.workout_plans for delete
  using (auth.uid() = user_id);