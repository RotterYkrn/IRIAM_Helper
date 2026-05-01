DROP function if exists log_enter cascade;

create function log_enter(
    p_project_id uuid,
    p_unit_id uuid,
    p_user_name text,
    p_entered_at timestamp with time zone
)
returns uuid
language plpgsql
set search_path = public
as $$
declare
    v_status text;
begin
    -----------------------------
    -- 1) 企画の状態チェック
    -----------------------------
    select status
    into v_status
    from projects
    where id = p_project_id;

    if v_status is null then
        raise exception 'project not found';
    end if;

    if v_status <> 'active' then
        raise exception 'project is not active';
    end if;

    update enter_units
    set
        enter_count = enter_count + 1,
        updated_at = now()
    where
        id = p_unit_id;

    -----------------------------
    -- 履歴に記録（★最重要）
    -----------------------------
    insert into enter_logs (
        project_id,
        unit_id,
        user_name,
        entered_at
    )
    values (
        p_project_id,
        p_unit_id,
        p_user_name,
        p_entered_at
    );

    return p_unit_id;
end;
$$;
