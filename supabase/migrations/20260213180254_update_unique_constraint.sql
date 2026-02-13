-- 1. 古い制約を削除
alter table endurance_actions 
drop constraint unique_action_per_project;

-- 2. type を含めた新しい制約を追加
alter table endurance_actions 
add constraint unique_action_label_per_type_per_project 
unique (project_id, type, label);
