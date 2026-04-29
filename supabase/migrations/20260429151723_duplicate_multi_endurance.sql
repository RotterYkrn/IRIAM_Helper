set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.duplicate_multi_endurance_project(p_project_id uuid)
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare
    v_new_project_id uuid;
begin
    -- ① project複製
    insert into projects (title, type, status)
    select
        title || '（コピー）',
        type,
        'scheduled'
    from projects
    where id = p_project_id
    returning id into v_new_project_id;

    -- ② endurance_units複製
    insert into endurance_units (
        project_id,
        label,
        target_count
    )
    select
        v_new_project_id,
        label,
        target_count
    from endurance_units
    where project_id = p_project_id;

    return v_new_project_id;
end;
$function$
;


