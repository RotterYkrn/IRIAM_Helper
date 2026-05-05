drop function if exists activate_enter_unit cascade;

create function activate_enter_unit(
    p_unit_id uuid,
    p_started_at timestamp with time zone
)
returns uuid
language plpgsql
SET search_path = public
as $$
declare
    v_status text;
begin
    select status
    into v_status
    from enter_units
    where id = p_unit_id;

    if v_status is null then
        raise exception 'project not found';
    end if;

    -- draft / scheduled 以外は拒否
    if v_status <> 'scheduled' then
        raise exception 'project cannot be activate';
    end if;

    update enter_units
    set 
        status = 'active',
        started_at = p_started_at
    where id = p_unit_id;

    return p_unit_id;
end;
$$;
