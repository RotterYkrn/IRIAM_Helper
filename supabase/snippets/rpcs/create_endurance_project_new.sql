DROP function IF EXISTS create_endurance_project_new cascade;
-- DROP TYPE IF EXISTS create_endurance_action_args cascade;

-- create type create_endurance_action_args as (
--     position integer,
--     label text,
--     amount integer
-- );

create function create_endurance_project_new(
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
    v_unit_id uuid;
    v_action create_endurance_action_args;
begin
    -- projects 作成
    insert into projects (
        title,
        type,
        status
    )
    values (
        p_title,
        'endurance',
        'scheduled'
    )
    returning id into v_project_id;

    -- endurance_settings
    insert into endurance_units (
        project_id,
        label,
        target_count
    )
    values (
        v_project_id,
        '不使用',
        p_target_count
    )
    returning id into v_unit_id;

    -- endurance_action_counts
    insert into endurance_action_counts (
        project_id,
        unit_id
    )
    values (
        v_project_id,
        v_unit_id
    );

    -- 救済
    foreach v_action in array p_rescue_actions
    loop
        insert into endurance_actions_new (
            project_id,
            unit_id,
            type,
            position,
            label,
            amount
        )
        values (
            v_project_id,
            v_unit_id,
            'rescue',
            v_action.position,
            v_action.label,
            v_action.amount
        );
    end loop;

    -- 妨害
    foreach v_action in array p_sabotage_actions
    loop
        insert into endurance_actions_new (
            project_id,
            unit_id,
            type,
            position,
            label,
            amount
        )
        values (
            v_project_id,
            v_unit_id,
            'sabotage',
            v_action.position,
            v_action.label,
            v_action.amount
        );
    end loop;

    return v_project_id;
end;
$$;

