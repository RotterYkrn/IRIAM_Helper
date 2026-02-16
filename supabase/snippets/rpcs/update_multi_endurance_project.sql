drop type if exists update_multi_endurance_setting_args cascade;
drop function if exists update_multi_endurance_project cascade;

create type update_multi_endurance_setting_args as (
    id uuid,
    position integer,
    label text,
    target_count integer
);

create function update_multi_endurance_project(
    p_project_id uuid,
    p_title text,
    p_settings update_multi_endurance_setting_args[]
)
returns uuid
language plpgsql
SET search_path = public
as $$
declare
    v_setting update_endurance_action_args;
    v_setting_id uuid;
begin
    -- projects
    update projects
    set title = p_title
    where id = p_project_id;

    -- multi_endurance
    delete from multi_endurance_settings
    where project_id = p_project_id
        and id not in (
            select (s.id)::uuid
            from p_settings as s
            where (s.id)::uuid is not null
        );
    
    foreach v_setting in array p_settings
    loop
        if v_setting.id is null then
            -- multi_endurance_settings
            insert into multi_endurance_settings (
                id,
                project_id,
                position,
                label,
                target_count,
                created_at,
                updated_at
            )
            values (
                gen_random_uuid(),
                v_project_id,
                v_setting.position,
                v_setting.label,
                v_setting.target_count,
                now(),
                now()
            )
            returning id into v_setting_id;

            -- multi_endurance_progress
            insert into multi_endurance_progress (
                id,
                setting_id,
                current_count,
                created_at,
                updated_at
            )
            values (
                gen_random_uuid(),
                v_setting_id,
                0,
                now(),
                now()
            );
        else
            -- 更新
            update multi_endurance_settings
            set 
                position = v_setting.position,
                label = v_setting.label,
                amount = v_setting.amount,
                updated_at = now()
            where id = v_setting.id
                and project_id = p_project_id;
        end if;
    end loop;

    return p_project_id;
end;
$$;