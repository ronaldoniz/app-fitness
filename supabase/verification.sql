-- Consultas somente leitura para validar a instalação das migrations.
-- Execute no SQL Editor do Supabase local ou hospedado.

-- Tabelas expostas e RLS.
select
  c.relname as table_name,
  c.relrowsecurity as rls_enabled,
  c.relforcerowsecurity as rls_forced
from pg_catalog.pg_class as c
join pg_catalog.pg_namespace as n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relkind = 'r'
  and c.relname in ('profiles', 'weigh_ins', 'goals')
order by c.relname;

-- Constraints de integridade.
select
  c.relname as table_name,
  con.conname as constraint_name,
  pg_catalog.pg_get_constraintdef(con.oid, true) as definition
from pg_catalog.pg_constraint as con
join pg_catalog.pg_class as c on c.oid = con.conrelid
join pg_catalog.pg_namespace as n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname in ('profiles', 'weigh_ins', 'goals')
order by c.relname, con.conname;

-- Índices, incluindo a unicidade parcial da meta ativa.
select
  tablename as table_name,
  indexname as index_name,
  indexdef as definition
from pg_catalog.pg_indexes
where schemaname = 'public'
  and tablename in ('profiles', 'weigh_ins', 'goals')
order by tablename, indexname;

-- Triggers de identidade, atualização e ciclo de vida das metas.
select
  c.relname as table_name,
  t.tgname as trigger_name,
  pg_catalog.pg_get_triggerdef(t.oid, true) as definition
from pg_catalog.pg_trigger as t
join pg_catalog.pg_class as c on c.oid = t.tgrelid
join pg_catalog.pg_namespace as n on n.oid = c.relnamespace
where not t.tgisinternal
  and n.nspname = 'public'
  and c.relname in ('profiles', 'weigh_ins', 'goals')
order by c.relname, t.tgname;

-- Funções da aplicação e exposição aos papéis da API.
select
  n.nspname as schema_name,
  p.proname as function_name,
  p.prosecdef as security_definer,
  pg_catalog.pg_get_function_identity_arguments(p.oid) as arguments,
  pg_catalog.has_function_privilege('anon', p.oid, 'execute')
    as anon_can_execute,
  pg_catalog.has_function_privilege('authenticated', p.oid, 'execute')
    as authenticated_can_execute
from pg_catalog.pg_proc as p
join pg_catalog.pg_namespace as n on n.oid = p.pronamespace
where (n.nspname, p.proname) in (
  ('public', 'activate_goal'),
  ('public', 'complete_onboarding'),
  ('public', 'delete_own_account'),
  ('public', 'move_pending_goal'),
  ('private', 'enforce_goal_lifecycle'),
  ('private', 'evaluate_active_goal'),
  ('private', 'protect_record_identity'),
  ('private', 'reevaluate_active_goal_after_change'),
  ('private', 'set_updated_at'),
  ('private', 'validate_goal_target')
)
order by n.nspname, p.proname;

-- Políticas RLS.
select
  schemaname,
  tablename,
  policyname,
  roles,
  cmd,
  qual,
  with_check
from pg_catalog.pg_policies
where schemaname = 'public'
  and tablename in ('profiles', 'weigh_ins', 'goals')
order by tablename, policyname;

-- Privilégios amplos de tabela. O papel anon não deve aparecer.
select
  grantee,
  table_name,
  privilege_type
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name in ('profiles', 'weigh_ins', 'goals')
  and grantee in ('anon', 'authenticated')
order by grantee, table_name, privilege_type;

-- Privilégios por coluna, usados para proteger o ciclo de vida das metas.
select
  grantee,
  table_name,
  column_name,
  privilege_type
from information_schema.role_column_grants
where table_schema = 'public'
  and table_name in ('profiles', 'weigh_ins', 'goals')
  and grantee in ('anon', 'authenticated')
order by grantee, table_name, privilege_type, column_name;
