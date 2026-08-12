DROP function IF EXISTS update_gift_category_endurance_project cascade;
DROP TYPE IF EXISTS update_gift_category_unit_args cascade;

create type update_gift_category_unit_args as (
    position integer,
    gift_id text
);

create function update_gift_category_endurance_project (
    p_project_id uuid,
    p_title text,
    p_target_count integer,
    p_units update_gift_category_unit_args[]
)
returns gift_category_endurance_project_dto
language plpgsql
SET search_path = public
as $$
declare
    v_unit update_gift_category_unit_args;
    v_result_row gift_category_endurance_project_dto;
begin
    -- projects
    update projects
    set title = p_title
    where id = p_project_id;

    -- endurance_units
    delete from endurance_units
    where project_id = p_project_id;
    
    foreach v_unit in array p_units
    loop
        insert into endurance_units (
            project_id,
            position,
            label,
            target_count
        )
        values (
            p_project_id,
            v_unit.position,
            v_unit.gift_id,
            p_target_count
        );
    end loop;

    SELECT * INTO v_result_row 
    FROM gift_category_endurance_project_dto 
    WHERE id = p_project_id 
    LIMIT 1;

    return v_result_row;
end;
$$;

