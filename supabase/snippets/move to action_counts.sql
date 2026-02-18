insert into endurance_action_counts (
  project_id,
  unit_id,
  normal_count,
  rescue_count,
  sabotage_count,
  created_at,
  updated_at
)
select
  p.id,
  eu.id,
  ep.normal_count,
  ep.rescue_count,
  ep.sabotage_count,
  ep.created_at,
  ep.updated_at
from projects p
join endurance_units eu on eu.project_id = p.id
join endurance_progress ep on ep.project_id = p.id;