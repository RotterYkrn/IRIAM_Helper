DROP function if exists archive_enter_logs cascade;
DROP type if exists archive_log_args cascade;

create type archive_log_args as (
    user_number integer,
    user_name text
);

create function archive_enter_logs(
    p_unit_id uuid,
    p_enter_count integer,
    p_started_at timestamp with time zone,
    p_completed_at timestamp with time zone,
    p_logs archive_log_args[]
)
returns uuid
language plpgsql
set search_path = public
as $$
declare
    v_status text;
    v_log archive_log_args;
begin
    -----------------------------
    -- 1) 企画の状態チェック
    -----------------------------
    select status
    into v_status
    from enter_units
    where id = p_unit_id;

    if v_status is null then
        raise exception 'enter unit not found';
    end if;

    if v_status <> 'archiving' then
        raise exception 'enter unit is not archiving';
    end if;

    update enter_units
    set
        status = 'finished',
        enter_count = p_enter_count,
        started_at = p_started_at,
        completed_at = p_completed_at,
        updated_at = now()
    where
        id = p_unit_id;

    -----------------------------
    -- 履歴に記録（★最重要）
    -----------------------------
    foreach v_log in array p_logs
    loop
        insert into enter_logs (
            unit_id,
            user_number,
            user_name,
            entered_at
        )
        values (
            p_unit_id,
            v_log.user_number,
            v_log.user_name,
            p_completed_at
        );
    end loop;

    return p_unit_id;
end;
$$;
