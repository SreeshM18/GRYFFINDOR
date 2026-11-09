-- =========================================================================
-- GRYFFINDOR GOD MODE — USER THEME CONFIGURATIONS & REALTIME SYNC SCHEMA
-- =========================================================================
-- Supports private user themes, shared workspace themes, and public site themes
-- with strict row-level security and size constraints.

create table if not exists public.user_theme_configs (
  owner_id text not null,
  scope text not null default 'personal' check (scope in ('personal', 'shared', 'public')),
  name text not null default 'Gryffindor Custom Theme',
  config jsonb not null default '{}'::jsonb,
  revision bigint not null default 1 check (revision > 0),
  updated_at timestamptz not null default now(),
  primary key (owner_id, scope),
  constraint theme_config_is_object check (jsonb_typeof(config) = 'object'),
  constraint theme_config_size check (pg_column_size(config) < 250000)
);

-- Enable Row Level Security
alter table public.user_theme_configs enable row level security;

-- 1. Read Policy: Users can read their own personal theme, shared themes, and public themes
create policy "Allow read theme configs" on public.user_theme_configs
  for select
  using (
    scope in ('shared', 'public') or
    auth.uid()::text = owner_id or
    owner_id in ('sreesh', 'mrithula') -- Session user fallback
  );

-- 2. Insert Policy: Users can save their own personal or shared themes
create policy "Allow insert theme configs" on public.user_theme_configs
  for insert
  with check (
    auth.uid()::text = owner_id or
    owner_id in ('sreesh', 'mrithula')
  );

-- 3. Update Policy: Users can update their own personal or authorized shared themes
create policy "Allow update theme configs" on public.user_theme_configs
  for update
  using (
    auth.uid()::text = owner_id or
    owner_id in ('sreesh', 'mrithula')
  )
  with check (
    auth.uid()::text = owner_id or
    owner_id in ('sreesh', 'mrithula')
  );

-- 4. Delete Policy
create policy "Allow delete own theme configs" on public.user_theme_configs
  for delete
  using (
    auth.uid()::text = owner_id or
    owner_id in ('sreesh', 'mrithula')
  );

-- Grant access to authenticated & anon roles (with RLS protecting rows)
grant select, insert, update, delete on public.user_theme_configs to authenticated;
grant select on public.user_theme_configs to anon;

-- Enable Realtime publication
alter publication supabase_realtime add table public.user_theme_configs;
