DROP function IF EXISTS create_enter_endurance_project cascade;

create function create_enter_endurance_project ()
returns uuid
language plpgsql
SET search_path = public
as $$
declare
    v_project_id uuid;
begin
    -- projects 作成
    insert into projects (
        title,
        type
    )
    values (
        '毎週日曜入室100人耐久',
        'enter-endurance'
    )
    returning id into v_project_id;

    return v_project_id;
end;
$$;

