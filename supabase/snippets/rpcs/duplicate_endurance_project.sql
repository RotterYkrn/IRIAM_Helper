drop function if exists duplicate_endurance_project cascade;

create function duplicate_endurance_project(
    p_project_id uuid
)
returns uuid
language plpgsql
set search_path = public
as $$
declare
    v_new_project_id uuid;
    v_new_unit_id uuid;
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
    where project_id = p_project_id
    returning id into v_new_unit_id;

    -- endurance_action_counts作成
    insert into endurance_action_counts (
        project_id,
        unit_id
    )
    values (
        v_new_project_id,
        v_new_unit_id
    );

    -- ③ endurance_actions複製
    insert into endurance_actions_new (
        project_id,
        unit_id,
        type,
        position,
        label,
        amount
    )
    select
        v_new_project_id,
        v_new_unit_id,
        type,
        position,
        label,
        amount
    from endurance_actions_new
    where project_id = p_project_id;

    return v_new_project_id;
end;
$$;
