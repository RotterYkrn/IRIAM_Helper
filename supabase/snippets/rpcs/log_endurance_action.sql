create or replace function log_endurance_action(
    p_project_id uuid,
    p_action_type text,               -- 'normal' | 'rescue' | 'sabotage'
    p_action_id uuid default null -- rescue/sabotage の場合のみ必須
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
    if p_action_type = 'normal' then
        v_amount := 1;  -- 固定

    elsif p_action_type in ('rescue','sabotage') then
        -- 定義から amount を取得
        select amount
        into v_amount
        from endurance_actions
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
    insert into endurance_action_histories (
        project_id,
        action_id,
        action_type,
        amount,
        created_at
    )
    values (
        p_project_id,
        case 
            when p_action_type = 'normal' then null
            else p_action_id
        end,
        p_action_type,
        v_amount,
        now()
    );

    -----------------------------
    -- 4) progress を更新（あなたのロジック）
    -----------------------------
    update endurance_progress
    set
        current_count =
            case
                when p_action_type = 'normal'
                    then current_count + v_amount

                when p_action_type = 'rescue'
                    then current_count + v_amount

                when p_action_type = 'sabotage'
                    then current_count - v_amount
            end,

        normal_count =
            case when p_action_type = 'normal'
                then normal_count + v_amount
                else normal_count end,

        rescue_count =
            case when p_action_type = 'rescue'
                then rescue_count + v_amount
                else rescue_count end,

        sabotage_count =
            case when p_action_type = 'sabotage'
                then sabotage_count + v_amount
                else sabotage_count end,

        updated_at = now()

    where project_id = p_project_id;

    return p_project_id;
end;
$$;
