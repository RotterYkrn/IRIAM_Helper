create view endurance_project_view as
select
  p.id,
  p.title,
  p.status,
  s.target_count,
  pr.current_count
from projects p
join endurance_settings s on s.project_id = p.id
join endurance_progress pr on pr.project_id = p.id;