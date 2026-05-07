drop function if exists archive_enter_unit cascade;

create function archive_enter_unit(
    p_unit_id uuid
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
        raise exception 'enter unit not found';
    end if;

    -- draft / scheduled 以外は拒否
    if v_status <> 'ready' then
        raise exception 'enter unit cannot be archive';
    end if;

    update enter_units
    set 
        status = 'archiving'
    where id = p_unit_id;

    return p_unit_id;
end;
$$;
