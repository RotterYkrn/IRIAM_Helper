drop function if exists finish_enter_unit cascade;

create function finish_enter_unit(
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
        raise exception 'project not found';
    end if;

    -- draft / scheduled 以外は拒否
    if v_status <> 'active' then
        raise exception 'project cannot be finish';
    end if;

    update enter_units
    set status = 'finished'
    where id = p_unit_id;

    return p_unit_id;
end;
$$;
