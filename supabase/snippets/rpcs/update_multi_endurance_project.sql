DROP function IF EXISTS update_multi_endurance_project cascade;
DROP TYPE IF EXISTS update_unit_args cascade;

create type update_unit_args as (
    id uuid,
    position integer,
    label text,
    target_count numeric(10, 2)
);

create function update_multi_endurance_project (
    p_project_id uuid,
    p_title text,
    p_units update_unit_args[]
)
returns uuid
language plpgsql
SET search_path = public
as $$
declare
    v_unit update_unit_args;
begin
    -- projects
    update projects
    set title = p_title
    where id = p_project_id;
    
    -- endurance_units
    foreach v_unit in array p_units
    loop
        insert into endurance_units (
            project_id,
            label,
            target_count
        )
        values (
            p_project_id,
            v_unit.label,
            v_unit.target_count
        );
    end loop;
    
    -----------------------------
    -- 3) ★ 既存のユニットを「まず削除」
    --    （フロントに無いものは消える）
    -----------------------------
    delete from endurance_units
    where project_id = p_project_id
        and id not in (
            select (v.id)::uuid
            from unnest(p_units) as v
            where (v.id)::uuid is not null
        );

    -----------------------------
    -- 4) 救済を UPSERT（更新 or 追加）
    -----------------------------
    foreach v_unit in array p_units
    loop
        if v_unit.id is null then
            -- 新規作成
            insert into endurance_units (
                project_id,
                position,
                label,
                target_count
            )
            values (
                p_project_id,
                v_unit.position,
                v_unit.label,
                v_unit.target_count
            );
        else
            -- 更新
            update endurance_units
            set 
                position = v_unit.position,
                label = v_unit.label,
                target_count = v_unit.target_count,
                updated_at = now()
            where id = v_unit.id
                and project_id = p_project_id;
        end if;
    end loop;

    return p_project_id;
end;
$$;

