DROP function if exists log_multi_endurance_action_history cascade;

create function log_multi_endurance_action_history(
    p_project_id uuid,
    p_unit_id uuid,
    p_action_count integer
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

    -----------------------------
    -- 履歴に記録（★最重要）
    -----------------------------
    insert into endurance_action_histories_new (
        project_id,
        unit_id,
        action_id,
        action_type,
        action_amount,
        action_count,
        created_at
    )
    values (
        p_project_id,
        p_unit_id,
        null,
        'normal',
        1,
        p_action_count,
        now()
    );

    -----------------------------
    -- 4) count を更新
    -----------------------------
    update endurance_units
    set
        current_count = current_count + p_action_count,
        updated_at = now()
    where id = p_unit_id;

    return p_unit_id;
end;
$$;
