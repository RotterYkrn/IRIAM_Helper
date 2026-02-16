SELECT
    pc.conname AS constraint_name,
    pg_get_constraintdef(pc.oid) AS constraint_definition
FROM pg_constraint pc
JOIN pg_class pt ON pt.oid = pc.conrelid
WHERE pt.relname = 'projects'; -- ここに対象のテーブル名を入れる