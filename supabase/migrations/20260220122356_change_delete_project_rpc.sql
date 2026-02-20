set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.delete_project(p_project_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare
    v_status text;
begin
    -- status 取得
    select status
    into v_status
    from projects
    where id = p_project_id;

    if v_status is null then
        raise exception 'project not found';
    end if;

    -- scheduled, finished のみ削除可
    if v_status = 'active' then
        raise exception 'only scheduled projects can be deleted';
    end if;

    -- 削除（CASCADE で子も消える）
    delete from projects
    where id = p_project_id;
end;
$function$
;


