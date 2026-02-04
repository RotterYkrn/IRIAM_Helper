create or replace function update_endurance_project(
    p_project_id uuid,
    p_title text,
    p_target_count integer
)
returns json
language plpgsql
SET search_path = public
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

    return json_build_object(
        'id', p_project_id,
        'title', p_title,
        'target_count', p_target_count
    );
end;
$$;
