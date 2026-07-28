begin;

create schema if not exists private;

revoke all on schema private from public;
revoke all on schema private from anon;
revoke all on schema private from authenticated;

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  name text not null check (btrim(name) <> ''),
  email text not null check (btrim(email) <> ''),
  height_cm numeric not null
    check (height_cm > 0 and height_cm < 'Infinity'::numeric),
  initial_weight_kg numeric not null
    check (
      initial_weight_kg > 0
      and initial_weight_kg < 'Infinity'::numeric
    ),
  theme_preference text not null default 'dark'
    check (theme_preference in ('dark', 'light', 'system')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.weigh_ins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  weighed_on date not null check (weighed_on <= current_date),
  weight_kg numeric not null
    check (weight_kg > 0 and weight_kg < 'Infinity'::numeric),
  waist_cm numeric
    check (
      waist_cm is null
      or (waist_cm > 0 and waist_cm < 'Infinity'::numeric)
    ),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint weigh_ins_user_date_key unique (user_id, weighed_on)
);

create table public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  target_weight_kg numeric not null
    check (
      target_weight_kg > 0
      and target_weight_kg < 'Infinity'::numeric
    ),
  display_order integer not null check (display_order >= 0),
  is_active boolean not null default false,
  completed_on date check (completed_on is null or completed_on <= current_date),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint goals_completion_state_check
    check (completed_on is null or is_active = false)
);

create unique index goals_one_active_per_user_idx
  on public.goals (user_id)
  where is_active = true;

create index goals_user_order_idx
  on public.goals (user_id, display_order);

create function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create function private.protect_record_identity()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.id is distinct from old.id
    or new.user_id is distinct from old.user_id
    or new.created_at is distinct from old.created_at
  then
    raise exception 'id, user_id and created_at are immutable'
      using errcode = '23514';
  end if;

  return new;
end;
$$;

create function private.validate_goal_target()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  reference_weight numeric;
  must_validate boolean;
begin
  if tg_op = 'INSERT' then
    must_validate := true;
  else
    must_validate :=
      new.target_weight_kg is distinct from old.target_weight_kg
      or new.user_id is distinct from old.user_id;
  end if;

  if not must_validate then
    return new;
  end if;

  select wi.weight_kg
    into reference_weight
    from public.weigh_ins as wi
    where wi.user_id = new.user_id
    order by wi.weighed_on desc
    limit 1;

  if reference_weight is null then
    select p.initial_weight_kg
      into reference_weight
      from public.profiles as p
      where p.user_id = new.user_id;
  end if;

  if reference_weight is null then
    raise exception 'a profile is required before creating a goal'
      using errcode = '23514';
  end if;

  if new.target_weight_kg >= reference_weight then
    raise exception 'target weight must be lower than the reference weight'
      using errcode = '23514';
  end if;

  return new;
end;
$$;

create function private.enforce_goal_lifecycle()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    if new.completed_on is not null then
      raise exception 'a goal cannot be created as completed'
        using errcode = '23514';
    end if;

    return new;
  end if;

  if old.completed_on is not null then
    raise exception 'a completed goal is read-only'
      using errcode = '23514';
  end if;

  if new.completed_on is distinct from old.completed_on
    and not exists (
      select 1
      from (
        select
          wi.weighed_on,
          wi.weight_kg
        from public.weigh_ins as wi
        where wi.user_id = new.user_id
        order by wi.weighed_on desc
        limit 1
      ) as current_weigh_in
      where current_weigh_in.weighed_on = new.completed_on
        and current_weigh_in.weight_kg <= new.target_weight_kg
    )
  then
    raise exception 'goal completion requires a qualifying weigh-in'
      using errcode = '23514';
  end if;

  return new;
end;
$$;

create function private.evaluate_active_goal(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.goals
  set
    completed_on = current_weigh_in.weighed_on,
    is_active = false
  from (
    select
      wi.weighed_on,
      wi.weight_kg
    from public.weigh_ins as wi
    where wi.user_id = p_user_id
    order by wi.weighed_on desc
    limit 1
  ) as current_weigh_in
  where goals.user_id = p_user_id
    and goals.is_active = true
    and goals.completed_on is null
    and current_weigh_in.weight_kg <= goals.target_weight_kg;
end;
$$;

create function private.reevaluate_active_goal_after_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'DELETE' then
    perform private.evaluate_active_goal(old.user_id);
    return old;
  end if;

  perform private.evaluate_active_goal(new.user_id);
  return new;
end;
$$;

create trigger profiles_protect_record_identity
before update on public.profiles
for each row execute function private.protect_record_identity();

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function private.set_updated_at();

create trigger weigh_ins_protect_record_identity
before update on public.weigh_ins
for each row execute function private.protect_record_identity();

create trigger weigh_ins_set_updated_at
before update on public.weigh_ins
for each row execute function private.set_updated_at();

create trigger goals_enforce_lifecycle
before insert or update on public.goals
for each row execute function private.enforce_goal_lifecycle();

create trigger goals_protect_record_identity
before update on public.goals
for each row execute function private.protect_record_identity();

create trigger goals_set_updated_at
before update on public.goals
for each row execute function private.set_updated_at();

create trigger goals_validate_target
before insert or update on public.goals
for each row execute function private.validate_goal_target();

create trigger weigh_ins_reevaluate_active_goal
after insert or update or delete on public.weigh_ins
for each row execute function private.reevaluate_active_goal_after_change();

create trigger goals_reevaluate_active_goal
after insert or update on public.goals
for each row
when (new.completed_on is null)
execute function private.reevaluate_active_goal_after_change();

alter table public.profiles enable row level security;
alter table public.weigh_ins enable row level security;
alter table public.goals enable row level security;

create policy profiles_select_own
on public.profiles
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy profiles_insert_own
on public.profiles
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy profiles_update_own
on public.profiles
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy profiles_delete_own
on public.profiles
for delete
to authenticated
using ((select auth.uid()) = user_id);

create policy weigh_ins_select_own
on public.weigh_ins
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy weigh_ins_insert_own
on public.weigh_ins
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy weigh_ins_update_own
on public.weigh_ins
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy weigh_ins_delete_own
on public.weigh_ins
for delete
to authenticated
using ((select auth.uid()) = user_id);

create policy goals_select_own
on public.goals
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy goals_insert_own
on public.goals
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy goals_update_own
on public.goals
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy goals_delete_own
on public.goals
for delete
to authenticated
using ((select auth.uid()) = user_id);

revoke all on table public.profiles from anon;
revoke all on table public.weigh_ins from anon;
revoke all on table public.goals from anon;

grant select, insert, update, delete on table public.profiles to authenticated;
grant select, insert, update, delete on table public.weigh_ins to authenticated;
grant select, delete on table public.goals to authenticated;
grant insert (
  user_id,
  target_weight_kg,
  display_order,
  is_active
) on public.goals to authenticated;
grant update (
  target_weight_kg,
  display_order,
  is_active
) on public.goals to authenticated;

create function public.activate_goal(p_goal_id uuid)
returns public.goals
language plpgsql
security invoker
set search_path = ''
as $$
declare
  activated_goal public.goals%rowtype;
begin
  if (select auth.uid()) is null then
    raise exception 'authentication is required'
      using errcode = '42501';
  end if;

  if not exists (
    select 1
    from public.goals as g
    where g.id = p_goal_id
      and g.user_id = (select auth.uid())
      and g.completed_on is null
  ) then
    raise exception 'goal not found or cannot be activated'
      using errcode = 'P0002';
  end if;

  update public.goals
  set is_active = false
  where user_id = (select auth.uid())
    and is_active = true;

  update public.goals
  set is_active = true
  where id = p_goal_id
    and user_id = (select auth.uid())
    and completed_on is null;

  select *
  into activated_goal
  from public.goals
  where id = p_goal_id
    and user_id = (select auth.uid());

  return activated_goal;
end;
$$;

revoke all on function public.activate_goal(uuid) from public;
revoke all on function public.activate_goal(uuid) from anon;
grant execute on function public.activate_goal(uuid) to authenticated;

revoke all on function private.set_updated_at() from public;
revoke all on function private.protect_record_identity() from public;
revoke all on function private.validate_goal_target() from public;
revoke all on function private.enforce_goal_lifecycle() from public;
revoke all on function private.evaluate_active_goal(uuid) from public;
revoke all on function private.reevaluate_active_goal_after_change() from public;

commit;
