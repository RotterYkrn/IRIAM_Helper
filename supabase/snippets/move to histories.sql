insert into endurance_action_histories_new (
  project_id,
  unit_id,
  action_id,
  action_type,
  action_amount,
  action_count,
  created_at
)
select
  p.id,
  eu.id,
  eh.action_id,
  eh.action_type,
  eh.action_amount,
  CASE 
    WHEN eh.is_reversal = true THEN -1 
    ELSE 1 
  END,
  eh.created_at
from projects p
join endurance_units eu on eu.project_id = p.id
join endurance_action_histories eh on eh.project_id = p.id;
