insert into endurance_units (
  project_id,
  label,
  target_count,
  current_count,
  created_at,
  updated_at
)
select
  p.id,
  '不使用',
  es.target_count,
  ep.current_count,
  es.created_at,
  ep.updated_at
from projects p
join endurance_settings es on es.project_id = p.id
join endurance_progress ep on ep.project_id = p.id;