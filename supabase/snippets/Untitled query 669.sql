DROP TYPE IF EXISTS update_endurance_action_input cascade;

-- 定義したカスタム型を一覧表示する
SELECT n.nspname as schema, t.typname as type_name
FROM pg_type t
LEFT JOIN pg_namespace n ON n.oid = t.typnamespace
WHERE n.nspname = 'public' 
  AND t.typtype = 'c' -- 'c' は composite type (複合型)
order by type_name;