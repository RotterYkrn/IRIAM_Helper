DROP function IF EXISTS create_gift_category_endurance_project cascade;
DROP TYPE IF EXISTS create_gift_category_unit_args cascade;

create type create_gift_category_unit_args as (
    position integer,
    gift_id text
);

create function create_gift_category_endurance_project (
    p_title text,
    p_target_count integer,
    p_units create_gift_category_unit_args[]
)
returns gift_category_endurance_project_dto
language plpgsql
SET search_path = public
as $$
declare
    v_project_id uuid;
    v_unit create_gift_category_unit_args;
    v_result_row gift_category_endurance_project_dto;
begin
    -- projects 作成
    insert into projects (
        title,
        type,
        status
    )
    values (
        p_title,
        'gift-category-endurance',
        'scheduled'
    )
    returning id into v_project_id;
    
    -- endurance_units
    foreach v_unit in array p_units
    loop
        insert into endurance_units (
            project_id,
            position,
            label,
            target_count
        )
        values (
            v_project_id,
            v_unit.position,
            v_unit.gift_id,
            p_target_count
        );
    end loop;

    SELECT * INTO v_result_row 
    FROM gift_category_endurance_project_dto 
    WHERE id = v_project_id 
    LIMIT 1;

    return v_result_row;
end;
$$;

