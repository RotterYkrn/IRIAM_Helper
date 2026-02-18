insert into endurance_actions_new (
  project_id,
  unit_id,
  type,
  position,
  label,
  amount,
  count,
  created_at,
  updated_at
)
select
  p.id,
  eu.id,
  ea.type,
  ea.position,
  ea.label,
  ea.amount,
  COALESCE(SUM(
    CASE 
      WHEN eh.is_reversal = true THEN -1 
      ELSE 1 
    END
  ), 0),
  ea.created_at,
  ea.updated_at
from projects p
join endurance_units eu on eu.project_id = p.id
join endurance_actions ea on ea.project_id = p.id
join endurance_action_histories eh on eh.action_id = ea.id
group by
  p.id,
  eu.id,
  ea.type,
  ea.position,
  ea.label,
  ea.amount,
  ea.created_at,
  ea.updated_at;
  