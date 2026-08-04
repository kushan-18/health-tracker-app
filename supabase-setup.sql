-- ============================================================
-- VitalX AI — Supabase Database Setup
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- 1. Users table (extends Supabase auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text not null default '',
  avatar text default '',
  age integer default 25,
  gender text default 'Male',
  height numeric default 175,
  weight numeric default 70,
  body_fat numeric default 18,
  fitness_goal text default 'General Fitness',
  activity_level text default 'Moderate',
  medical_conditions text[] default '{}',
  diet_preference text default 'No Preference',
  workout_experience text default 'Intermediate',
  sports_played text[] default '{}',
  sleep_schedule text default '10 PM - 6 AM',
  water_intake_glasses integer default 8,
  target_weight numeric default 70,
  target_calories integer default 2200,
  created_at timestamptz default now()
);

-- 2. Workouts
create table public.workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null default 'Workout',
  type text not null default 'General',
  duration_minutes integer not null default 0,
  calories_burned integer not null default 0,
  exercises jsonb default '[]',
  date date not null default current_date,
  completed boolean default false,
  notes text default '',
  created_at timestamptz default now()
);

-- 3. Meals
create table public.meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  type text not null default 'breakfast',
  calories numeric not null default 0,
  protein_g numeric not null default 0,
  carbs_g numeric not null default 0,
  fat_g numeric not null default 0,
  foods jsonb default '[]',
  logged_at timestamptz default now()
);

-- 4. Weight logs
create table public.weight_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  weight numeric not null,
  logged_at timestamptz default now()
);

-- 5. Water logs
create table public.water_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  glasses integer not null default 1,
  logged_at timestamptz default now()
);

-- 6. Health metrics (heart rate, blood pressure, sleep, steps, etc.)
create table public.health_metrics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  value numeric not null,
  unit text not null default '',
  notes text default '',
  recorded_at timestamptz default now()
);

-- 7. Chat history
create table public.chat_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  conversation_id text not null default 'default',
  message text not null,
  role text not null check (role in ('user', 'assistant')),
  created_at timestamptz default now()
);

-- ============================================================
-- Indexes
-- ============================================================
create index idx_workouts_user_date on public.workouts(user_id, date desc);
create index idx_meals_user_date on public.meals(user_id, logged_at desc);
create index idx_weight_logs_user_date on public.weight_logs(user_id, logged_at desc);
create index idx_water_logs_user_date on public.water_logs(user_id, logged_at desc);
create index idx_health_metrics_user_date on public.health_metrics(user_id, recorded_at desc);
create index idx_chat_history_user on public.chat_history(user_id, conversation_id);

-- ============================================================
-- Auto-create profile on signup via trigger
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================
alter table public.profiles enable row level security;
alter table public.workouts enable row level security;
alter table public.meals enable row level security;
alter table public.weight_logs enable row level security;
alter table public.water_logs enable row level security;
alter table public.health_metrics enable row level security;
alter table public.chat_history enable row level security;

-- Profiles: users can read/update own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Workouts: users can CRUD own workouts
create policy "Users can view own workouts"
  on public.workouts for select
  using (auth.uid() = user_id);

create policy "Users can insert own workouts"
  on public.workouts for insert
  with check (auth.uid() = user_id);

create policy "Users can update own workouts"
  on public.workouts for update
  using (auth.uid() = user_id);

create policy "Users can delete own workouts"
  on public.workouts for delete
  using (auth.uid() = user_id);

-- Meals
create policy "Users can view own meals"
  on public.meals for select
  using (auth.uid() = user_id);

create policy "Users can insert own meals"
  on public.meals for insert
  with check (auth.uid() = user_id);

create policy "Users can update own meals"
  on public.meals for update
  using (auth.uid() = user_id);

create policy "Users can delete own meals"
  on public.meals for delete
  using (auth.uid() = user_id);

-- Weight logs
create policy "Users can view own weight logs"
  on public.weight_logs for select
  using (auth.uid() = user_id);

create policy "Users can insert own weight logs"
  on public.weight_logs for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own weight logs"
  on public.weight_logs for delete
  using (auth.uid() = user_id);

-- Water logs
create policy "Users can view own water logs"
  on public.water_logs for select
  using (auth.uid() = user_id);

create policy "Users can insert own water logs"
  on public.water_logs for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own water logs"
  on public.water_logs for delete
  using (auth.uid() = user_id);

-- Health metrics
create policy "Users can view own health metrics"
  on public.health_metrics for select
  using (auth.uid() = user_id);

create policy "Users can insert own health metrics"
  on public.health_metrics for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own health metrics"
  on public.health_metrics for delete
  using (auth.uid() = user_id);

-- Chat history
create policy "Users can view own chat history"
  on public.chat_history for select
  using (auth.uid() = user_id);

create policy "Users can insert own chat history"
  on public.chat_history for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own chat history"
  on public.chat_history for delete
  using (auth.uid() = user_id);
