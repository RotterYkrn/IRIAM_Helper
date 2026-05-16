DROP function IF EXISTS create_endurance_project_new cascade;
DROP TYPE IF EXISTS create_endurance_action_args cascade;

create type create_endurance_action_args as (
    position integer,
    label text,
    amount numeric(10, 2)
);

create function create_endurance_project_new(
    p_title text,
    p_target_count numeric(10, 2),
    p_rescue_actions create_endurance_action_args[],
    p_sabotage_actions create_endurance_action_args[]
)
returns endurance_project_dto
language plpgsql
SET search_path = public
as $$
declare
    v_project_id uuid;
    v_unit_id uuid;
    v_action create_endurance_action_args;
    v_result_row endurance_project_dto;
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

    insert into endurance_actions_new (project_id, unit_id, type, position, label, amount)
    select v_project_id, v_unit_id, 'rescue', unnest.position, unnest.label, unnest.amount
    from unnest(p_rescue_actions) as unnest;

    insert into endurance_actions_new (project_id, unit_id, type, position, label, amount)
    select v_project_id, v_unit_id, 'sabotage', unnest.position, unnest.label, unnest.amount
    from unnest(p_sabotage_actions) as unnest;
    
    SELECT * INTO v_result_row 
    FROM endurance_project_dto 
    WHERE id = v_project_id 
    LIMIT 1;

    RETURN v_result_row;
end;
$$;

