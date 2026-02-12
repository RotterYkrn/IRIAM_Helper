create view endurance_project_view as
select
    p.id,
    p.title,
    p.status,
    ps.target_count,
    pr.current_count,
    pr.normal_count,
    pr.rescue_count,
    pr.sabotage_count
from projects p
join endurance_settings ps on ps.project_id = p.id
join endurance_progress pr on pr.project_id = p.id
where p.type = 'endurance';
