DROP function if exists update_endurance_project_new cascade;
DROP TYPE IF EXISTS update_endurance_action_args cascade;

create type update_endurance_action_args as (
    id uuid,
    position integer,
    label text,
    amount integer
);

create function update_endurance_project_new(
    p_project_id uuid,
    p_unit_id uuid,
    p_title text,
    p_target_count integer,
    p_rescue_actions update_endurance_action_args[],
    p_sabotage_actions update_endurance_action_args[]
)
returns uuid
language plpgsql
SET search_path = public
as $$
declare
    v_action update_endurance_action_args;
begin
    -- projects
    update projects
    set title = p_title
    where id = p_project_id;

    -- endurance_units
    update endurance_units
    set target_count = p_target_count
    where id = p_unit_id;

    -----------------------------
    -- 3) ★ 既存の救済/妨害を「まず削除」
    --    （フロントに無いものは消える）
    -----------------------------
    delete from endurance_actions_new
    where project_id = p_project_id
        and id not in (
            select (v.id)::uuid
            from unnest(p_rescue_actions || p_sabotage_actions) as v
            where (v.id)::uuid is not null
        );

    -----------------------------
    -- 4) 救済を UPSERT（更新 or 追加）
    -----------------------------
    foreach v_action in array p_rescue_actions
    loop
        if v_action.id is null then
            -- 新規作成
            insert into endurance_actions_new (
                project_id, unit_id, type, position, label, amount
            )
            values (
                p_project_id,
                p_unit_id,
                'rescue',
                v_action.position,
                v_action.label,
                v_action.amount
            );
        else
            -- 更新
            update endurance_actions_new
            set 
                position = v_action.position,
                label = v_action.label,
                amount = v_action.amount,
                updated_at = now()
            where id = v_action.id
                and project_id = p_project_id;
        end if;
    end loop;

    -----------------------------
    -- 5) 妨害も同様に UPSERT
    -----------------------------
    foreach v_action in array p_sabotage_actions
    loop
        if v_action.id is null then
            insert into endurance_actions_new (
                project_id, unit_id, type, position, label, amount
            )
            values (
                p_project_id,
                p_unit_id,
                'sabotage',
                v_action.position,
                v_action.label,
                v_action.amount
            );
        else
            update endurance_actions_new
            set 
                position = v_action.position,
                label = v_action.label,
                amount = v_action.amount,
                updated_at = now()
            where id = v_action.id
                and project_id = p_project_id;
        end if;
    end loop;

    return p_project_id;
end;
$$;
