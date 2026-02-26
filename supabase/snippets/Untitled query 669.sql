
insert into endurance_units (
    project_id,
    label,
    target_count
)
select
    'e61f2f88-fa0a-4d07-929c-b55f37eeaea2',
    label,
    target_count
from endurance_units
where project_id = '6245de45-4897-4ffd-984a-81e535329bbd';