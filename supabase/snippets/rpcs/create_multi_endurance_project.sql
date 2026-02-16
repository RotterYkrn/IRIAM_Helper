drop type if exists create_multi_endurance_setting_args cascade;
drop function if exists create_multi_endurance_project cascade;

create type create_multi_endurance_setting_args as (
    position integer,
    label text,
    target_count integer
);

create function create_multi_endurance_project(
    p_title text,
    p_settings create_multi_endurance_setting_args[]
)
returns uuid
language plpgsql
SET search_path = public
as $$
declare
    v_project_id uuid;
    v_setting create_endurance_action_args;
    v_setting_id uuid;
begin
    -- projects 作成
    insert into projects (
        id,
        title,
        type,
        status,
        created_at,
        updated_at
    )
    values (
        gen_random_uuid(),
        p_title,
        'multi_endurance',
        'scheduled',
        now(),
        now()
    )
    returning id into v_project_id;
    
    foreach v_setting in array p_settings
    loop
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
    end loop;

    return v_project_id;
end;
$$;