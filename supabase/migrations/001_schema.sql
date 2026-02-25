-- ═══════════════════════════════════════════════════
-- AuditPeer — Supabase Database Schema
-- Run this in: Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ─── Profiles ───────────────────────────────────────
create table profiles (
  id              uuid references auth.users on delete cascade primary key,
  username        text unique not null,
  job_title       text,
  industry        text,
  experience      text,
  certifications  text[] default '{}',
  avatar_gradient text default '135deg, #00d4ff, #7b61ff',
  is_anonymous    boolean default true,
  reputation      integer default 0,
  created_at      timestamptz default now()
);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, username)
  values (new.id, 'Auditor' || floor(random() * 90000 + 10000)::text);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ─── Questions ──────────────────────────────────────
create table questions (
  id           uuid primary key default uuid_generate_v4(),
  title        text not null,
  body         text not null,
  author_id    uuid references profiles(id) on delete set null,
  tags         text[] default '{}',
  vote_count   integer default 0,
  answer_count integer default 0,
  view_count   integer default 0,
  is_answered  boolean default false,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- ─── Answers ────────────────────────────────────────
create table answers (
  id           uuid primary key default uuid_generate_v4(),
  question_id  uuid references questions(id) on delete cascade not null,
  body         text not null,
  author_id    uuid references profiles(id) on delete set null,
  vote_count   integer default 0,
  is_accepted  boolean default false,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- Auto-increment answer_count on questions
create or replace function increment_answer_count()
returns trigger as $$
begin
  update questions set answer_count = answer_count + 1, updated_at = now()
  where id = new.question_id;
  return new;
end;
$$ language plpgsql;

create trigger on_answer_created
  after insert on answers
  for each row execute procedure increment_answer_count();

-- ─── Votes ──────────────────────────────────────────
create table votes (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references profiles(id) on delete cascade not null,
  target_id   uuid not null,
  target_type text check (target_type in ('question', 'answer')) not null,
  value       smallint check (value in (1, -1)) not null,
  created_at  timestamptz default now(),
  unique(user_id, target_id, target_type)
);

-- ─── Bookmarks ──────────────────────────────────────
create table bookmarks (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references profiles(id) on delete cascade not null,
  question_id uuid references questions(id) on delete cascade not null,
  created_at  timestamptz default now(),
  unique(user_id, question_id)
);

-- ─── Templates ──────────────────────────────────────
create table templates (
  id             uuid primary key default uuid_generate_v4(),
  title          text not null,
  description    text,
  category       text,
  file_url       text,
  file_format    text check (file_format in ('xlsx','docx','pdf','zip')),
  author_id      uuid references profiles(id) on delete set null,
  download_count integer default 0,
  rating_avg     numeric(3,2) default 0,
  rating_count   integer default 0,
  tags           text[] default '{}',
  created_at     timestamptz default now()
);

-- ─── Row Level Security ─────────────────────────────
alter table profiles   enable row level security;
alter table questions  enable row level security;
alter table answers    enable row level security;
alter table votes      enable row level security;
alter table bookmarks  enable row level security;
alter table templates  enable row level security;

-- Profiles: anyone can read, only owner can update
create policy "Profiles are publicly readable" on profiles for select using (true);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Questions: anyone can read, authenticated users can insert
create policy "Questions are publicly readable" on questions for select using (true);
create policy "Authenticated users can post questions" on questions for insert with check (auth.uid() = author_id);
create policy "Authors can update own questions" on questions for update using (auth.uid() = author_id);

-- Answers: anyone can read, authenticated users can insert
create policy "Answers are publicly readable" on answers for select using (true);
create policy "Authenticated users can post answers" on answers for insert with check (auth.uid() = author_id);
create policy "Authors can update own answers" on answers for update using (auth.uid() = author_id);

-- Votes: users manage their own votes
create policy "Users can manage their votes" on votes for all using (auth.uid() = user_id);
create policy "Votes are publicly readable" on votes for select using (true);

-- Bookmarks: private to each user
create policy "Users can manage their bookmarks" on bookmarks for all using (auth.uid() = user_id);

-- Templates: anyone can read, authenticated users can insert
create policy "Templates are publicly readable" on templates for select using (true);
create policy "Authenticated users can upload templates" on templates for insert with check (auth.uid() = author_id);

-- ─── Indexes ────────────────────────────────────────
create index on questions(created_at desc);
create index on questions(vote_count desc);
create index on questions(author_id);
create index on answers(question_id);
create index on votes(target_id, target_type);
create index on bookmarks(user_id);
