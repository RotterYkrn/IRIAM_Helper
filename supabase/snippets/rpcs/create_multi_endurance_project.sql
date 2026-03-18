DROP function IF EXISTS create_multi_endurance_project cascade;
DROP TYPE IF EXISTS create_unit_args cascade;

create type create_unit_args as (
    label text,
    target_count numeric(10, 2)
);

create function create_multi_endurance_project (
    p_title text,
    p_units create_unit_args[]
)
returns uuid
language plpgsql
SET search_path = public
as $$
declare
    v_project_id uuid;
    v_unit create_unit_args;
begin
    -- projects 作成
    insert into projects (
        title,
        type,
        status
    )
    values (
        p_title,
        'multi-endurance',
        'scheduled'
    )
    returning id into v_project_id;
    
    -- endurance_units
    foreach v_unit in array p_units
    loop
        insert into endurance_units (
            project_id,
            label,
            target_count
        )
        values (
            v_project_id,
            v_unit.label,
            v_unit.target_count
        );
    end loop;

    return v_project_id;
end;
$$;

