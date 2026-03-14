-- Kindness Community Foundation — Initial Supabase Schema
-- Run this in your Supabase SQL editor or via supabase db push

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ──────────────────────────────────────────
-- USERS / PROFILES
-- ──────────────────────────────────────────
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  role text default 'user',
  avatar_url text,
  bio text,
  phone text,
  department text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-create a profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ──────────────────────────────────────────
-- ANALYTICS
-- ──────────────────────────────────────────
create table if not exists public.analytics (
  id uuid primary key default uuid_generate_v4(),
  metric_type text not null,
  metric_value text,
  metric_date date,
  user_id uuid references auth.users(id),
  user_email text,
  created_at timestamptz default now()
);

-- ──────────────────────────────────────────
-- GIVING / DONATIONS
-- ──────────────────────────────────────────
create table if not exists public.donations (
  id uuid primary key default uuid_generate_v4(),
  user_email text not null,
  cause text,
  charity_name text,
  amount numeric not null,
  donation_type text default 'one_time',
  donation_date date,
  note text,
  created_at timestamptz default now()
);

create table if not exists public.giving_goals (
  id uuid primary key default uuid_generate_v4(),
  user_email text not null,
  goal_name text,
  target_amount numeric,
  current_amount numeric default 0,
  cause text,
  deadline date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_email text not null,
  plan_name text,
  amount numeric,
  frequency text default 'monthly',
  status text default 'active',
  next_payment_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ──────────────────────────────────────────
-- COMMUNITY STORIES
-- ──────────────────────────────────────────
create table if not exists public.community_stories (
  id uuid primary key default uuid_generate_v4(),
  author_name text,
  author_email text,
  title text not null,
  content text,
  pillar text,
  status text default 'pending',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ──────────────────────────────────────────
-- VOLUNTEER
-- ──────────────────────────────────────────
create table if not exists public.volunteer_submissions (
  id uuid primary key default uuid_generate_v4(),
  full_name text,
  email text,
  message text,
  created_at timestamptz default now()
);

create table if not exists public.volunteer_signups (
  id uuid primary key default uuid_generate_v4(),
  user_email text not null,
  initiative_id text,
  initiative_name text,
  signup_date date default current_date,
  created_at timestamptz default now()
);

create table if not exists public.volunteer_hours (
  id uuid primary key default uuid_generate_v4(),
  user_email text not null,
  initiative_name text,
  hours numeric not null,
  activity_date date default current_date,
  description text,
  created_at timestamptz default now()
);

create table if not exists public.volunteer_badges (
  id uuid primary key default uuid_generate_v4(),
  user_email text not null,
  badge_type text not null,
  hours_earned_at numeric,
  earned_date date default current_date,
  created_at timestamptz default now()
);

-- ──────────────────────────────────────────
-- TEAM PORTAL
-- ──────────────────────────────────────────
create table if not exists public.team_members (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  full_name text,
  department text,
  role text,
  avatar_url text,
  bio text,
  phone text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.team_directory (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  full_name text,
  department text,
  role text,
  avatar_url text,
  bio text,
  phone text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.chat_groups (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  icon_emoji text default '💬',
  description text,
  created_by_email text,
  created_at timestamptz default now()
);

create table if not exists public.team_messages (
  id uuid primary key default uuid_generate_v4(),
  sender_email text not null,
  sender_name text,
  message text,
  message_type text default 'direct',
  receiver_email text,
  group_id uuid references public.chat_groups(id),
  created_at timestamptz default now()
);

create table if not exists public.message_attachments (
  id uuid primary key default uuid_generate_v4(),
  message_id uuid references public.team_messages(id) on delete cascade,
  file_url text,
  file_name text,
  file_type text,
  file_size bigint,
  created_at timestamptz default now()
);

create table if not exists public.team_documents (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  content text,
  file_url text,
  file_name text,
  author_email text,
  author_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.team_tasks (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  status text default 'todo',
  priority text default 'medium',
  assigned_to_email text,
  due_date date,
  created_by_email text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.task_attachments (
  id uuid primary key default uuid_generate_v4(),
  task_id uuid references public.team_tasks(id) on delete cascade,
  file_url text,
  file_name text,
  file_type text,
  file_size bigint,
  created_at timestamptz default now()
);

create table if not exists public.team_announcements (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  content text,
  author_name text,
  author_email text,
  priority text default 'normal',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_email text not null,
  message text,
  type text default 'info',
  read boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ──────────────────────────────────────────
-- ROW LEVEL SECURITY (basic policies)
-- ──────────────────────────────────────────
-- Enable RLS on all tables
alter table public.users enable row level security;
alter table public.analytics enable row level security;
alter table public.donations enable row level security;
alter table public.giving_goals enable row level security;
alter table public.subscriptions enable row level security;
alter table public.community_stories enable row level security;
alter table public.volunteer_submissions enable row level security;
alter table public.volunteer_signups enable row level security;
alter table public.volunteer_hours enable row level security;
alter table public.volunteer_badges enable row level security;
alter table public.team_members enable row level security;
alter table public.team_directory enable row level security;
alter table public.chat_groups enable row level security;
alter table public.team_messages enable row level security;
alter table public.message_attachments enable row level security;
alter table public.team_documents enable row level security;
alter table public.team_tasks enable row level security;
alter table public.task_attachments enable row level security;
alter table public.team_announcements enable row level security;
alter table public.notifications enable row level security;

-- Allow authenticated users to read/write all tables
-- (adjust these policies to your security requirements)
create policy "authenticated_all" on public.users for all to authenticated using (true) with check (true);
create policy "authenticated_all" on public.analytics for all to authenticated using (true) with check (true);
create policy "authenticated_all" on public.donations for all to authenticated using (true) with check (true);
create policy "authenticated_all" on public.giving_goals for all to authenticated using (true) with check (true);
create policy "authenticated_all" on public.subscriptions for all to authenticated using (true) with check (true);
create policy "authenticated_all" on public.community_stories for all to authenticated using (true) with check (true);
create policy "authenticated_all" on public.volunteer_submissions for all to authenticated using (true) with check (true);
create policy "authenticated_all" on public.volunteer_signups for all to authenticated using (true) with check (true);
create policy "authenticated_all" on public.volunteer_hours for all to authenticated using (true) with check (true);
create policy "authenticated_all" on public.volunteer_badges for all to authenticated using (true) with check (true);
create policy "authenticated_all" on public.team_members for all to authenticated using (true) with check (true);
create policy "authenticated_all" on public.team_directory for all to authenticated using (true) with check (true);
create policy "authenticated_all" on public.chat_groups for all to authenticated using (true) with check (true);
create policy "authenticated_all" on public.team_messages for all to authenticated using (true) with check (true);
create policy "authenticated_all" on public.message_attachments for all to authenticated using (true) with check (true);
create policy "authenticated_all" on public.team_documents for all to authenticated using (true) with check (true);
create policy "authenticated_all" on public.team_tasks for all to authenticated using (true) with check (true);
create policy "authenticated_all" on public.task_attachments for all to authenticated using (true) with check (true);
create policy "authenticated_all" on public.team_announcements for all to authenticated using (true) with check (true);
create policy "authenticated_all" on public.notifications for all to authenticated using (true) with check (true);

-- Allow anonymous users to read approved community stories (public-facing)
create policy "public_read_approved_stories" on public.community_stories
  for select to anon using (status = 'approved');

-- Allow anonymous users to insert volunteer submissions (contact form)
create policy "anon_insert_volunteer_submissions" on public.volunteer_submissions
  for insert to anon with check (true);

-- ──────────────────────────────────────────
-- STORAGE BUCKET
-- ──────────────────────────────────────────
-- Run this to create the file storage bucket:
-- insert into storage.buckets (id, name, public) values ('app-files', 'app-files', true);
