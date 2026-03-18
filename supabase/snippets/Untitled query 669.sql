BEGIN; -- トランザクション開始

-- 1. 古いチェック制約を削除
ALTER TABLE projects 
DROP CONSTRAINT projects_type_check;

-- 2. 新しい選択肢 ('multi-endurance' など) を含めた制約を追加
ALTER TABLE projects 
ADD CONSTRAINT projects_type_check 
CHECK (type IN ('endurance', 'multi-endurance', 'panel_open'));

COMMIT; -- 確定