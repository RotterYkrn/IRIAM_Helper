ALTER TABLE endurance_units 
  -- ① 古い制約（0より大きい）を削除
  DROP CONSTRAINT endurance_units_target_count_check,
  
  -- ② 新しい制約（0以上）を追加
  ADD CONSTRAINT endurance_units_target_count_check CHECK (target_count >= 0);