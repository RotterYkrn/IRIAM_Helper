create or replace function update_endurance_project(
    p_project_id uuid,
    p_title text,
    p_target_count integer
)
returns void
language plpgsql
as $$
begin
    -- projects
    update projects
    set title = p_title
    where id = p_project_id;

    -- endurance_settings
    update endurance_settings
    set target_count = p_target_count
    where project_id = p_project_id;
end;
$$;
