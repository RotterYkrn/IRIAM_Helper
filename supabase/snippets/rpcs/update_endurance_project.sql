DROP TYPE IF EXISTS update_endurance_action_args cascade;
DROP TYPE IF EXISTS update_endurance_project_result cascade;

create type update_endurance_action_args as (
    id uuid,        -- ★ 重要（更新/削除判定に使う）
    label text,
    amount integer
);

create type update_endurance_project_result as (
  id uuid,
  title text,
  target_count integer,
  rescue_actions endurance_action_stat[],
  sabotage_actions endurance_action_stat[]
);

create or replace function update_endurance_project(
    p_project_id uuid,
    p_title text,
    p_target_count integer,
    p_rescue_actions update_endurance_action_args[] default array[]::update_endurance_action_args[],
    p_sabotage_actions update_endurance_action_args[] default array[]::update_endurance_action_args[]
)
returns update_endurance_project_result
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

    -- endurance_settings
    update endurance_settings
    set target_count = p_target_count
    where project_id = p_project_id;

    -----------------------------
    -- 3) ★ 既存の救済/妨害を「まず削除」
    --    （フロントに無いものは消える）
    -----------------------------
    delete from endurance_actions
    where project_id = p_project_id
        and id not in (
            select (v->>'id')::uuid
            from unnest(p_rescue_actions || p_sabotage_actions) as v
            where (v->>'id')::uuid is not null
        );

    -----------------------------
    -- 4) 救済を UPSERT（更新 or 追加）
    -----------------------------
    foreach v_action in array p_rescue_actions
    loop
        if v_action.id is null then
            -- 新規作成
            insert into endurance_actions (
                id, project_id, type, label, amount, created_at
            )
            values (
                gen_random_uuid(),
                p_project_id,
                'rescue',
                v_action.label,
                v_action.amount,
                now()
            );
        else
            -- 更新
            update endurance_actions
            set 
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
            insert into endurance_actions (
                id, project_id, type, label, amount, created_at
            )
            values (
                gen_random_uuid(),
                p_project_id,
                'sabotage',
                v_action.label,
                v_action.amount,
                now()
            );
        else
            update endurance_actions
            set 
                label = v_action.label,
                amount = v_action.amount,
                updated_at = now()
            where id = v_action.id
                and project_id = p_project_id;
        end if;
    end loop;

    --------------------------------
    -- ★ 返り値：ビューそのまま利用
    --------------------------------
    return (
        select json_build_object(
            'id', p_project_id,
            'title', p_title,
            'target_count', p_target_count,
            'rescue_actions', v.rescue_actions,
            'sabotage_actions', v.sabotage_actions
        )
        from endurance_action_stats_view v
        where v.project_id = p_project_id
    );

end;
$$;
