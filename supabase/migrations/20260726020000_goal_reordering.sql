begin;

create function public.move_pending_goal(
  p_goal_id uuid,
  p_direction text
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  selected_goal public.goals%rowtype;
  adjacent_goal public.goals%rowtype;
begin
  if (select auth.uid()) is null then
    raise exception 'authentication is required'
      using errcode = '42501';
  end if;

  if p_direction not in ('up', 'down') then
    raise exception 'direction must be up or down'
      using errcode = '22023';
  end if;

  select *
    into selected_goal
    from public.goals as g
    where g.id = p_goal_id
      and g.user_id = (select auth.uid())
      and g.completed_on is null
      and g.is_active = false;

  if not found then
    raise exception 'pending goal not found'
      using errcode = 'P0002';
  end if;

  if p_direction = 'up' then
    select *
      into adjacent_goal
      from public.goals as g
      where g.user_id = (select auth.uid())
        and g.completed_on is null
        and g.is_active = false
        and g.display_order < selected_goal.display_order
      order by g.display_order desc, g.created_at desc
      limit 1;
  else
    select *
      into adjacent_goal
      from public.goals as g
      where g.user_id = (select auth.uid())
        and g.completed_on is null
        and g.is_active = false
        and g.display_order > selected_goal.display_order
      order by g.display_order asc, g.created_at asc
      limit 1;
  end if;

  if adjacent_goal.id is null then
    return;
  end if;

  update public.goals
  set display_order = case
    when id = selected_goal.id then adjacent_goal.display_order
    else selected_goal.display_order
  end
  where user_id = (select auth.uid())
    and id in (selected_goal.id, adjacent_goal.id)
    and completed_on is null
    and is_active = false;
end;
$$;

revoke all on function public.move_pending_goal(uuid, text) from public;
revoke all on function public.move_pending_goal(uuid, text) from anon;
grant execute on function public.move_pending_goal(uuid, text)
  to authenticated;

commit;
