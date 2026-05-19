drop function if exists duplicate_multi_endurance_project cascade;

create function duplicate_multi_endurance_project(
    p_project_id uuid
)
returns multi_endurance_project_dto
language plpgsql
set search_path = public
as $$
declare
    v_new_project_id uuid;
    v_result_row multi_endurance_project_dto;
begin
    -- ① project複製
    insert into projects (title, type, status)
    select
        title || '（コピー）',
        type,
        'scheduled'
    from projects
    where id = p_project_id
    returning id into v_new_project_id;

    -- ② endurance_units複製
    insert into endurance_units (
        project_id,
        label,
        target_count
    )
    select
        v_new_project_id,
        label,
        target_count
    from endurance_units
    where project_id = p_project_id;

    SELECT * INTO v_result_row 
    FROM multi_endurance_project_dto 
    WHERE id = v_new_project_id 
    LIMIT 1;

    return v_result_row;
end;
$$;
