-- ============================
-- テストデータ完全リセット
-- ============================

-- 1. 子テーブルから削除
delete from endurance_progress;
delete from endurance_settings;

-- 2. 親テーブル削除
delete from projects;

-- ============================
-- テスト用プロジェクト作成
-- ============================

-- プロジェクト
insert into projects (
  id,
  title,
  type,
  status,
  created_at,
  updated_at
) values (
  gen_random_uuid(),
  '【テスト】耐久配信企画',
  'endurance',
  'scheduled',
  now(),
  now()
);

-- ============================
-- 設定 & 進捗を作成
-- ============================

-- settings
insert into endurance_settings (
  id,
  project_id,
  target_count,
  created_at,
  updated_at
)
select
  gen_random_uuid(),
  p.id,
  100,
  now(),
  now()
from projects p
limit 1;

-- progress
insert into endurance_progress (
  id,
  project_id,
  current_count,
  created_at,
  updated_at
)
select
  gen_random_uuid(),
  p.id,
  0,
  now(),
  now()
from projects p
limit 1;
