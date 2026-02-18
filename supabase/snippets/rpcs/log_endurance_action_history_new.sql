DROP function if exists log_endurance_action_history_new cascade;

create function log_endurance_action_history_new(
    p_project_id uuid,
    p_unit_id uuid,
    p_action_history_type text,
    p_action_count integer,
    p_action_id uuid default null
)
returns uuid
language plpgsql
set search_path = public
as $$
declare
    v_status text;
    v_amount integer;
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
    -- 2) amount の決定（分岐）
    -----------------------------
    if p_action_history_type = 'normal' then
        v_amount := 1;  -- 固定

    elsif p_action_history_type in ('rescue','sabotage') then
        -- 定義から amount を取得
        select amount
        into v_amount
        from endurance_actions_new
        where id = p_action_id;

        if v_amount is null then
            raise exception 'invalid action_id';
        end if;

    else
        raise exception 'invalid action_type';
    end if;

    -----------------------------
    -- 3) 履歴に記録（★最重要）
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
        case 
            when p_action_history_type = 'normal' then null
            else p_action_id
        end,
        p_action_history_type,
        v_amount,
        p_action_count,
        now()
    );

    -----------------------------
    -- 4) action_count を更新
    -----------------------------
    if p_action_id != null then
        update endurance_actions
        set
            count = p_action_count,
            updated_at = now()
        where id = p_action_id;
    end if;

    -----------------------------
    -- 4) count を更新
    -----------------------------
    update endurance_units
    set
        current_count =
            case
                when p_action_history_type = 'normal'
                    then current_count + v_amount * action_count

                when p_action_history_type = 'rescue'
                    then current_count + v_amount * action_count

                when p_action_history_type = 'sabotage'
                    then current_count - v_amount * action_count
            end,

        updated_at = now()

    where id = p_unit_id;

    update endurance_action_counts
    set
        normal_count =
            case when p_action_history_type = 'normal'
                then normal_count + v_amount * action_count
                else normal_count end,

        rescue_count =
            case when p_action_history_type = 'rescue'
                then rescue_count + v_amount * action_count
                else rescue_count end,

        sabotage_count =
            case when p_action_history_type = 'sabotage'
                then sabotage_count + v_amount * action_count
                else sabotage_count end,

        updated_at = now()

    where unit_id = p_unit_id;

    return p_project_id;
end;
$$;
