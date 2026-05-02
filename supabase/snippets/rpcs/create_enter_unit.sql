DROP function IF EXISTS create_enter_unit cascade;

create function create_enter_unit (
    p_project_id uuid,
    p_event_date timestamp with time zone
)
returns uuid
language plpgsql
SET search_path = public
as $$
declare
    v_unit_id uuid;
begin
    -- enter_units
    insert into enter_units (
        project_id,
        event_date
    )
    values (
        p_project_id,
        p_event_date
    )
    returning id into v_unit_id;

    return v_unit_id;
end;
$$;

