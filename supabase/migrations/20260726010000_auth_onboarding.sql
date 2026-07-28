begin;

revoke insert on table public.profiles from authenticated;
drop policy profiles_insert_own on public.profiles;

create function public.complete_onboarding(
  p_name text,
  p_height_cm numeric,
  p_initial_weight_kg numeric,
  p_target_weight_kg numeric
)
returns public.profiles
language plpgsql
security definer
set search_path = ''
as $$
declare
  authenticated_user_id uuid := (select auth.uid());
  authenticated_email text;
  created_profile public.profiles%rowtype;
begin
  if authenticated_user_id is null then
    raise exception 'authentication is required'
      using errcode = '42501';
  end if;

  select u.email
  into authenticated_email
  from auth.users as u
  where u.id = authenticated_user_id;

  if authenticated_email is null or btrim(authenticated_email) = '' then
    raise exception 'the authenticated user must have an email'
      using errcode = '23514';
  end if;

  if p_name is null or btrim(p_name) = '' then
    raise exception 'name is required'
      using errcode = '23514';
  end if;

  if exists (
    select 1
    from public.profiles as p
    where p.user_id = authenticated_user_id
  ) then
    raise exception 'onboarding has already been completed'
      using errcode = '23505';
  end if;

  insert into public.profiles (
    user_id,
    name,
    email,
    height_cm,
    initial_weight_kg,
    theme_preference
  )
  values (
    authenticated_user_id,
    btrim(p_name),
    lower(btrim(authenticated_email)),
    p_height_cm,
    p_initial_weight_kg,
    'dark'
  )
  returning * into created_profile;

  insert into public.goals (
    user_id,
    target_weight_kg,
    display_order,
    is_active
  )
  values (
    authenticated_user_id,
    p_target_weight_kg,
    0,
    true
  );

  return created_profile;
end;
$$;

revoke all on function public.complete_onboarding(
  text,
  numeric,
  numeric,
  numeric
) from public;
revoke all on function public.complete_onboarding(
  text,
  numeric,
  numeric,
  numeric
) from anon;
grant execute on function public.complete_onboarding(
  text,
  numeric,
  numeric,
  numeric
) to authenticated;

commit;
