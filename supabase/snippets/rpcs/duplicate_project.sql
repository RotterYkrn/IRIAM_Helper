drop function if exists duplicate_project cascade;

create function duplicate_project(
    p_project_id uuid
)
returns uuid
language plpgsql
set search_path = public
as $$
declare
    v_new_project_id uuid;
begin
    -- ① project複製
    insert into projects (id, title, type, status, created_at, updated_at)
    select
        gen_random_uuid(),
        title || '（コピー）',
        type,
        'scheduled',
        now(),
        now()
    from projects
    where id = p_project_id
    returning id into v_new_project_id;

    -- ② endurance_settings複製
    insert into endurance_settings (
        id,
        project_id,
        target_count,
        created_at,
        updated_at
    )
    select
        gen_random_uuid(),
        v_new_project_id,
        target_count,
        now(),
        now()
    from endurance_settings
    where project_id = p_project_id;

    -- endurance_progress
    insert into endurance_progress (
        id,
        project_id,
        current_count,
        normal_count, rescue_count, sabotage_count,
        created_at,
        updated_at
    )
    values (
        gen_random_uuid(),
        v_new_project_id,
        0,
        0, 0, 0,
        now(),
        now()
    );

    -- ③ endurance_actions複製
    insert into endurance_actions (
        id,
        project_id,
        type,
        label,
        amount,
        position,
        created_at,
        updated_at
    )
    select
        gen_random_uuid(),
        v_new_project_id,
        type,
        label,
        amount,
        position,
        now(),
        now()
    from endurance_actions
    where project_id = p_project_id;

    return v_new_project_id;
end;
$$;
