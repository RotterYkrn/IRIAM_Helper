drop view if exists endurance_project_view_new;

create view endurance_project_view_new as
select
    p.id,
    p.title,
    p.status,
    u.target_count,
    u.current_count,
    ac.normal_count,
    ac.rescue_count,
    ac.sabotage_count
from projects p
join endurance_units u on u.project_id = p.id
join endurance_action_counts ac on ac.project_id = p.id
where p.type = 'endurance';
