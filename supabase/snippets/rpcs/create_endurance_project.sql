DROP function IF EXISTS create_endurance_project cascade;
DROP TYPE IF EXISTS create_endurance_action_args cascade;

create type create_endurance_action_args as (
    position integer,
    label text,
    amount integer
);

create function create_endurance_project(
    p_title text,
    p_target_count integer,
    p_rescue_actions create_endurance_action_args[],
    p_sabotage_actions create_endurance_action_args[]
)
returns uuid
language plpgsql
SET search_path = public
as $$
declare
    v_project_id uuid;
    v_action create_endurance_action_args;
begin
    -- projects 作成
    insert into projects (
        id,
        title,
        type,
        status,
        created_at,
        updated_at
    )
    values (
        gen_random_uuid(),
        p_title,
        'endurance',
        'scheduled',
        now(),
        now()
    )
    returning id into v_project_id;

    -- endurance_settings
    insert into endurance_settings (
        id,
        project_id,
        target_count,
        created_at,
        updated_at
    )
    values (
        gen_random_uuid(),
        v_project_id,
        p_target_count,
        now(),
        now()
    );

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
        v_project_id,
        0,
        0, 0, 0,
        now(),
        now()
    );

    -- 救済
    foreach v_action in array p_rescue_actions
    loop
        insert into endurance_actions (
            id, project_id, type, position, label, amount, created_at
        )
        values (
            gen_random_uuid(),
            v_project_id,
            'rescue',
            v_action.position,
            v_action.label,
            v_action.amount,
            now()
        );
    end loop;

    -- 妨害
    foreach v_action in array p_sabotage_actions
    loop
        insert into endurance_actions (
            id, project_id, type, position, label, amount, created_at
        )
        values (
            gen_random_uuid(),
            v_project_id,
            'sabotage',
            v_action.position,
            v_action.label,
            v_action.amount,
            now()
        );
    end loop;

    return v_project_id;
end;
$$;

