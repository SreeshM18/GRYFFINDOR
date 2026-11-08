-- GRYFFINDOR: secure two-person task assignment, independent private tasks,
-- shared tasks, consent-based assignment, comments, checklist and notifications.
-- Run against a NEW Supabase project. Never put a service-role key in the browser.

create table public.gr_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Member' check (char_length(display_name) between 1 and 80),
  created_at timestamptz not null default now()
);

create function public.gr_on_signup() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.gr_profiles (id, display_name)
  values (new.id, left(coalesce(nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''), split_part(new.email, '@', 1), 'Member'), 80));
  return new;
end; $$;
create trigger gr_auth_created after insert on auth.users
for each row execute function public.gr_on_signup();

create table public.gr_rooms (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) between 1 and 90),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

create table public.gr_room_members (
  room_id uuid not null references public.gr_rooms(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (room_id, user_id)
);
create index gr_room_members_user_idx on public.gr_room_members(user_id);

create table public.gr_room_invites (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.gr_rooms(id) on delete cascade,
  code_hash text not null unique,
  created_by uuid not null references auth.users(id),
  expires_at timestamptz not null,
  consumed_at timestamptz,
  consumed_by uuid references auth.users(id)
);

create table public.gr_tasks (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.gr_rooms(id) on delete cascade,
  created_by uuid not null references auth.users(id),
  assigned_to uuid references auth.users(id),
  visibility text not null check (visibility in ('private','shared')),
  assignment_state text not null check (assignment_state in ('unassigned','pending','accepted','declined')),
  title text not null check (char_length(trim(title)) between 1 and 180),
  description text not null default '' check (char_length(description) <= 20000),
  priority text not null default 'medium' check (priority in ('low','medium','high','urgent')),
  status text not null default 'todo' check (status in ('todo','in_progress','blocked','review','done')),
  due_at timestamptz,
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  archived_at timestamptz,
  constraint gr_private_self check (visibility <> 'private' or assigned_to = created_by)
);
create index gr_tasks_room_idx on public.gr_tasks(room_id, created_at desc);
create index gr_tasks_assignee_idx on public.gr_tasks(assigned_to, status) where archived_at is null;
create index gr_tasks_creator_idx on public.gr_tasks(created_by);

create table public.gr_comments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.gr_tasks(id) on delete cascade,
  author_id uuid not null references auth.users(id),
  body text not null check (char_length(trim(body)) between 1 and 4000),
  created_at timestamptz not null default now()
);
create index gr_comments_task_idx on public.gr_comments(task_id, created_at);

create table public.gr_checklist (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.gr_tasks(id) on delete cascade,
  label text not null check (char_length(trim(label)) between 1 and 200),
  done boolean not null default false,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);
create index gr_checklist_task_idx on public.gr_checklist(task_id);

create table public.gr_events (
  id bigint generated always as identity primary key,
  task_id uuid not null references public.gr_tasks(id) on delete cascade,
  actor_id uuid not null references auth.users(id),
  event_type text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index gr_events_task_idx on public.gr_events(task_id, created_at desc);

create table public.gr_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  task_id uuid references public.gr_tasks(id) on delete set null,
  message text not null,
  created_at timestamptz not null default now(),
  read_at timestamptz
);
create index gr_notifications_user_idx on public.gr_notifications(user_id, created_at desc);

-- Helper functions use narrowly scoped definer privileges and a fixed search path.
create function public.gr_is_member(p_room uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.gr_room_members
    where room_id = p_room and user_id = (select auth.uid())
  );
$$;

create function public.gr_share_room(p_other uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.gr_room_members mine
    join public.gr_room_members theirs on theirs.room_id = mine.room_id
    where mine.user_id = (select auth.uid()) and theirs.user_id = p_other
  );
$$;

create function public.gr_can_view_task(p_task uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.gr_tasks t
    where t.id = p_task
      and public.gr_is_member(t.room_id)
      and (t.visibility = 'shared' or t.created_by = (select auth.uid()))
  );
$$;

-- RLS: no direct writes to business tables. Mutations go through validated RPCs.
alter table public.gr_profiles enable row level security;
alter table public.gr_rooms enable row level security;
alter table public.gr_room_members enable row level security;
alter table public.gr_room_invites enable row level security;
alter table public.gr_tasks enable row level security;
alter table public.gr_comments enable row level security;
alter table public.gr_checklist enable row level security;
alter table public.gr_events enable row level security;
alter table public.gr_notifications enable row level security;

create policy gr_profiles_read on public.gr_profiles for select to authenticated
using (id = (select auth.uid()) or public.gr_share_room(id));
create policy gr_profiles_update on public.gr_profiles for update to authenticated
using (id = (select auth.uid())) with check (id = (select auth.uid()));
create policy gr_rooms_read on public.gr_rooms for select to authenticated
using (public.gr_is_member(id));
create policy gr_members_read on public.gr_room_members for select to authenticated
using (public.gr_is_member(room_id));
create policy gr_tasks_read on public.gr_tasks for select to authenticated
using (public.gr_is_member(room_id) and (visibility = 'shared' or created_by = (select auth.uid())));
create policy gr_comments_read on public.gr_comments for select to authenticated
using (public.gr_can_view_task(task_id));
create policy gr_checklist_read on public.gr_checklist for select to authenticated
using (public.gr_can_view_task(task_id));
create policy gr_events_read on public.gr_events for select to authenticated
using (public.gr_can_view_task(task_id));
create policy gr_notifications_read on public.gr_notifications for select to authenticated
using (user_id = (select auth.uid()));

revoke all on public.gr_profiles, public.gr_rooms, public.gr_room_members,
  public.gr_room_invites, public.gr_tasks, public.gr_comments,
  public.gr_checklist, public.gr_events, public.gr_notifications from anon, authenticated;
grant select on public.gr_profiles, public.gr_rooms, public.gr_room_members,
  public.gr_tasks, public.gr_comments, public.gr_checklist,
  public.gr_events, public.gr_notifications to authenticated;
grant update (display_name) on public.gr_profiles to authenticated;
-- Invite codes are never directly readable from their table.

create function public.gr_create_room(p_title text) returns uuid
language plpgsql security definer set search_path = '' as $$
declare v_room uuid;
begin
  if auth.uid() is null then raise exception 'Not signed in'; end if;
  if char_length(trim(coalesce(p_title,''))) not between 1 and 90 then
    raise exception 'Room title must contain 1–90 characters';
  end if;
  insert into public.gr_rooms (title, created_by)
    values (trim(p_title), auth.uid()) returning id into v_room;
  insert into public.gr_room_members(room_id,user_id) values (v_room,auth.uid());
  return v_room;
end; $$;

create function public.gr_create_invite(p_room uuid) returns text
language plpgsql security definer set search_path = '' as $$
declare v_code text;
begin
  if not public.gr_is_member(p_room) then raise exception 'Not a room member'; end if;
  -- Two independent CSPRNG-backed UUIDs; raw code is shown once only.
  v_code := replace(gen_random_uuid()::text,'-','') || replace(gen_random_uuid()::text,'-','');
  insert into public.gr_room_invites(room_id,code_hash,created_by,expires_at)
  values (p_room, encode(sha256(convert_to(v_code,'UTF8')),'hex'), auth.uid(), now()+interval '7 days');
  return v_code;
end; $$;

create function public.gr_join_room(p_code text) returns uuid
language plpgsql security definer set search_path = '' as $$
declare v_inv public.gr_room_invites%rowtype;
begin
  if auth.uid() is null then raise exception 'Not signed in'; end if;
  select * into v_inv from public.gr_room_invites
  where code_hash = encode(sha256(convert_to(trim(coalesce(p_code,'')),'UTF8')),'hex')
    and consumed_at is null and expires_at > now()
  for update;
  if not found then raise exception 'Invalid, used, or expired invitation'; end if;
  insert into public.gr_room_members(room_id,user_id)
    values (v_inv.room_id,auth.uid()) on conflict do nothing;
  update public.gr_room_invites set consumed_at=now(), consumed_by=auth.uid()
  where id = v_inv.id;
  return v_inv.room_id;
end; $$;

create function public.gr_create_task(
  p_room uuid, p_title text, p_description text default '',
  p_assignee uuid default null, p_visibility text default 'shared',
  p_priority text default 'medium', p_due_at timestamptz default null,
  p_tags text[] default '{}'
) returns uuid
language plpgsql security definer set search_path = '' as $$
declare v_id uuid; v_state text;
begin
  if not public.gr_is_member(p_room) then raise exception 'Not a room member'; end if;
  if char_length(trim(coalesce(p_title,''))) not between 1 and 180 then
    raise exception 'Title must contain 1–180 characters'; end if;
  if char_length(coalesce(p_description,'')) > 20000 then raise exception 'Description too long'; end if;
  if p_priority not in ('low','medium','high','urgent') then raise exception 'Invalid priority'; end if;
  if p_visibility not in ('private','shared') then raise exception 'Invalid visibility'; end if;
  if p_visibility='private' and p_assignee is distinct from auth.uid() then
    raise exception 'Private tasks must be assigned to yourself'; end if;
  if p_assignee is not null and not exists(
    select 1 from public.gr_room_members where room_id=p_room and user_id=p_assignee
  ) then raise exception 'Assignee is not a member'; end if;
  v_state := case when p_assignee is null then 'unassigned'
                  when p_assignee=auth.uid() then 'accepted' else 'pending' end;
  insert into public.gr_tasks(room_id,created_by,assigned_to,visibility,assignment_state,
                              title,description,priority,due_at,tags)
  values (p_room,auth.uid(),p_assignee,p_visibility,v_state,trim(p_title),
          coalesce(p_description,''),p_priority,p_due_at,coalesce(p_tags,'{}'))
  returning id into v_id;
  insert into public.gr_events(task_id,actor_id,event_type) values (v_id,auth.uid(),'created');
  if v_state='pending' then
    insert into public.gr_notifications(user_id,task_id,message)
    values (p_assignee,v_id,'You received a new task assignment. Accept or decline it.');
  end if;
  return v_id;
end; $$;

create function public.gr_respond_assignment(p_task uuid,p_action text) returns void
language plpgsql security definer set search_path = '' as $$
declare v_task public.gr_tasks%rowtype;
begin
  select * into v_task from public.gr_tasks where id=p_task for update;
  if not found or v_task.assigned_to is distinct from auth.uid()
      or v_task.assignment_state <> 'pending' or v_task.archived_at is not null
      or not public.gr_is_member(v_task.room_id) then
    raise exception 'Not an actionable assignment'; end if;
  if p_action not in ('accept','decline') then raise exception 'Invalid action'; end if;
  update public.gr_tasks set assignment_state=case when p_action='accept' then 'accepted' else 'declined' end,
  updated_at=now() where id=p_task;
  insert into public.gr_events(task_id,actor_id,event_type) values(p_task,auth.uid(),p_action);
  if v_task.created_by<>auth.uid() then
    insert into public.gr_notifications(user_id,task_id,message)
    values(v_task.created_by,p_task,case when p_action='accept' then 'Your task was accepted.' else 'Your task was declined.' end);
  end if;
end; $$;

create function public.gr_set_status(p_task uuid,p_status text) returns void
language plpgsql security definer set search_path = '' as $$
declare v_task public.gr_tasks%rowtype;
begin
  select * into v_task from public.gr_tasks where id=p_task for update;
  if not found or not public.gr_is_member(v_task.room_id) or v_task.archived_at is not null then
    raise exception 'Task unavailable'; end if;
  if p_status not in ('todo','in_progress','blocked','review','done') then raise exception 'Invalid status'; end if;
  if not ((v_task.assigned_to = auth.uid() and v_task.assignment_state='accepted')
    or (v_task.assigned_to is null and v_task.created_by=auth.uid())) then
    raise exception 'Only the accepted assignee can move this task'; end if;
  update public.gr_tasks set status=p_status,
    completed_at=case when p_status='done' then now() else null end,
    updated_at=now() where id=p_task;
  insert into public.gr_events(task_id,actor_id,event_type,details)
    values(p_task,auth.uid(),'status',jsonb_build_object('from',v_task.status,'to',p_status));
  if p_status='done' and v_task.created_by<>auth.uid() then
    insert into public.gr_notifications(user_id,task_id,message)
      values(v_task.created_by,p_task,'An assigned task was completed.');
  end if;
end; $$;

create function public.gr_edit_task(
  p_task uuid, p_title text, p_description text,
  p_assignee uuid, p_visibility text, p_priority text,
  p_due_at timestamptz, p_tags text[]
) returns void
language plpgsql security definer set search_path = '' as $$
declare v_task public.gr_tasks%rowtype; v_state text;
begin
  select * into v_task from public.gr_tasks where id=p_task for update;
  if not found or v_task.created_by<>auth.uid() or not public.gr_is_member(v_task.room_id)
      or v_task.archived_at is not null then raise exception 'Only the creator can edit this task'; end if;
  if char_length(trim(coalesce(p_title,''))) not between 1 and 180 then raise exception 'Invalid title'; end if;
  if char_length(coalesce(p_description,'')) > 20000 then raise exception 'Description too long'; end if;
  if p_priority not in ('low','medium','high','urgent') then raise exception 'Invalid priority'; end if;
  if p_visibility not in ('private','shared') then raise exception 'Invalid visibility'; end if;
  if p_visibility='private' and p_assignee is distinct from auth.uid() then
    raise exception 'Private tasks must be assigned to yourself'; end if;
  if p_assignee is not null and not exists(
    select 1 from public.gr_room_members where room_id=v_task.room_id and user_id=p_assignee
  ) then raise exception 'Assignee is not a member'; end if;
  v_state := case when p_assignee is not distinct from v_task.assigned_to
                      and v_task.assignment_state <> 'declined' then v_task.assignment_state
                  when p_assignee is null then 'unassigned'
                  when p_assignee=auth.uid() then 'accepted' else 'pending' end;
  update public.gr_tasks set title=trim(p_title),description=coalesce(p_description,''),
    assigned_to=p_assignee,visibility=p_visibility,priority=p_priority,due_at=p_due_at,
    tags=coalesce(p_tags,'{}'), assignment_state=v_state,
    status=case when p_assignee is distinct from v_task.assigned_to then 'todo' else status end,
    completed_at=case when p_assignee is distinct from v_task.assigned_to then null else completed_at end,
    updated_at=now() where id=p_task;
  insert into public.gr_events(task_id,actor_id,event_type) values(p_task,auth.uid(),'edited');
  if v_state='pending' and (p_assignee is distinct from v_task.assigned_to
       or v_task.assignment_state='declined') then
    insert into public.gr_notifications(user_id,task_id,message)
      values(p_assignee,p_task,'A task has been assigned to you. Accept or decline.');
  end if;
end; $$;

create function public.gr_archive_task(p_task uuid) returns void
language plpgsql security definer set search_path = '' as $$
declare v_task public.gr_tasks%rowtype;
begin
  select * into v_task from public.gr_tasks where id=p_task for update;
  if not found or v_task.created_by<>auth.uid() or not public.gr_is_member(v_task.room_id)
    then raise exception 'Only the creator can archive this task'; end if;
  update public.gr_tasks set archived_at=now(),updated_at=now() where id=p_task;
  insert into public.gr_events(task_id,actor_id,event_type) values(p_task,auth.uid(),'archived');
end; $$;

create function public.gr_add_comment(p_task uuid,p_body text) returns uuid
language plpgsql security definer set search_path = '' as $$
declare v_id uuid; v_task public.gr_tasks%rowtype;
begin
  select * into v_task from public.gr_tasks where id=p_task;
  if not found or v_task.archived_at is not null or not public.gr_can_view_task(p_task)
    then raise exception 'Task not accessible'; end if;
  if char_length(trim(coalesce(p_body,''))) not between 1 and 4000 then raise exception 'Invalid comment'; end if;
  insert into public.gr_comments(task_id,author_id,body)
    values(p_task,auth.uid(),trim(p_body)) returning id into v_id;
  insert into public.gr_events(task_id,actor_id,event_type) values(p_task,auth.uid(),'comment');
  if v_task.visibility='shared' then
    if v_task.created_by<>auth.uid() then
      insert into public.gr_notifications(user_id,task_id,message) values(v_task.created_by,p_task,'A comment was added to your task.');
    end if;
    if v_task.assigned_to is not null and v_task.assigned_to<>auth.uid() and v_task.assigned_to<>v_task.created_by then
      insert into public.gr_notifications(user_id,task_id,message) values(v_task.assigned_to,p_task,'A comment was added to your assigned task.');
    end if;
  end if;
  return v_id;
end; $$;

create function public.gr_add_checklist(p_task uuid,p_label text) returns uuid
language plpgsql security definer set search_path = '' as $$
declare v_id uuid;
begin
  if not public.gr_can_view_task(p_task) or exists(
    select 1 from public.gr_tasks where id=p_task and archived_at is not null
  ) then raise exception 'Task unavailable'; end if;
  if char_length(trim(coalesce(p_label,''))) not between 1 and 200 then raise exception 'Invalid checklist label'; end if;
  insert into public.gr_checklist(task_id,label,created_by)
    values(p_task,trim(p_label),auth.uid()) returning id into v_id;
  return v_id;
end; $$;

create function public.gr_toggle_checklist(p_item uuid,p_done boolean) returns void
language plpgsql security definer set search_path = '' as $$
declare v_task uuid;
begin
  select task_id into v_task from public.gr_checklist where id=p_item;
  if v_task is null or not public.gr_can_view_task(v_task) or exists(
    select 1 from public.gr_tasks where id=v_task and archived_at is not null
  ) then raise exception 'Item unavailable'; end if;
  update public.gr_checklist set done=coalesce(p_done,false) where id=p_item;
end; $$;

create function public.gr_mark_read(p_notification uuid) returns void
language plpgsql security definer set search_path = '' as $$
begin
  update public.gr_notifications set read_at=coalesce(read_at,now())
    where id=p_notification and user_id=auth.uid();
end; $$;

-- Only authenticated clients may invoke these mutations. No browser admin key.
revoke all on function public.gr_is_member(uuid),public.gr_share_room(uuid),
 public.gr_can_view_task(uuid),public.gr_create_room(text),public.gr_create_invite(uuid),
 public.gr_join_room(text), public.gr_create_task(uuid,text,text,uuid,text,text,timestamptz,text[]),
 public.gr_respond_assignment(uuid,text),public.gr_set_status(uuid,text),
 public.gr_edit_task(uuid,text,text,uuid,text,text,timestamptz,text[]),
 public.gr_archive_task(uuid),public.gr_add_comment(uuid,text),
 public.gr_add_checklist(uuid,text),public.gr_toggle_checklist(uuid,boolean),
 public.gr_mark_read(uuid) from public, anon;
grant execute on function public.gr_is_member(uuid),public.gr_share_room(uuid),
 public.gr_can_view_task(uuid),public.gr_create_room(text),public.gr_create_invite(uuid),
 public.gr_join_room(text), public.gr_create_task(uuid,text,text,uuid,text,text,timestamptz,text[]),
 public.gr_respond_assignment(uuid,text),public.gr_set_status(uuid,text),
 public.gr_edit_task(uuid,text,text,uuid,text,text,timestamptz,text[]),
 public.gr_archive_task(uuid),public.gr_add_comment(uuid,text),
 public.gr_add_checklist(uuid,text),public.gr_toggle_checklist(uuid,boolean),
 public.gr_mark_read(uuid) to authenticated;

-- Optional: enable Realtime by running these in SQL Editor. Initial version also
-- refreshes on focus and a 20-second polling interval if Realtime is disabled.
-- alter publication supabase_realtime add table public.gr_tasks;
-- alter publication supabase_realtime add table public.gr_notifications;
-- alter publication supabase_realtime add table public.gr_comments;
-- alter publication supabase_realtime add table public.gr_checklist;
