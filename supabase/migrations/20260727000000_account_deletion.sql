begin;

create function public.delete_own_account()
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  authenticated_user_id uuid := (select auth.uid());
begin
  if authenticated_user_id is null then
    raise exception 'authentication is required'
      using errcode = '42501';
  end if;

  delete from public.goals
  where user_id = authenticated_user_id;

  delete from public.weigh_ins
  where user_id = authenticated_user_id;

  delete from public.profiles
  where user_id = authenticated_user_id;

  delete from auth.users
  where id = authenticated_user_id;

  if not found then
    raise exception 'authenticated user not found'
      using errcode = 'P0002';
  end if;

  return true;
end;
$$;

revoke all on function public.delete_own_account() from public;
revoke all on function public.delete_own_account() from anon;
grant execute on function public.delete_own_account() to authenticated;

commit;
