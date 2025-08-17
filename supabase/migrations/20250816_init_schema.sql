
-- Supabase initial schema for English Panda App
-- Date: 2025-08-16

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  display_name text,
  created_at timestamptz default now()
);

create table if not exists progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  level text check (level in ('A1','A2','B1','B2','C1','C2')) not null,
  xp integer default 0,
  streak integer default 0,
  achievements jsonb default '[]'::jsonb,
  updated_at timestamptz default now()
);
create index if not exists idx_progress_user on progress(user_id);

create table if not exists errors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  exercise_type text not null,
  payload jsonb not null,
  last_attempt timestamptz default now(),
  attempts integer default 1,
  resolved boolean default false
);
create index if not exists idx_errors_user on errors(user_id);
create index if not exists idx_errors_resolved on errors(resolved);

create table if not exists collocations (
  id uuid primary key default gen_random_uuid(),
  level text check (level in ('A1','A2','B1','B2','C1','C2')) not null,
  headword text not null,
  pattern text not null,
  example text
);

-- Vocabulary storage (optional when not using mock)
create table if not exists vocabulary (
  id uuid primary key default gen_random_uuid(),
  level text check (level in ('A1','A2','B1','B2','C1','C2')) not null,
  category text check (category in ('adjectives','verbs','nouns','phrasal_verbs','idioms','general')) not null,
  en text not null,
  it text,
  meaning text,
  unique(level, category, en)
);
create index if not exists idx_vocab_level_cat on vocabulary(level, category);
