begin;

-- Supabase projects may grant table-wide privileges to API roles by default.
-- Remove them before restoring only the operations used by the application,
-- so the column-level restrictions on goals cannot be bypassed.
revoke all on table public.profiles from anon, authenticated;
revoke all on table public.weigh_ins from anon, authenticated;
revoke all on table public.goals from anon, authenticated;

grant select, update, delete on table public.profiles to authenticated;
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

commit;
