DROP function if exists delete_project;

create function delete_project(
    p_project_id uuid
)
returns uuid
language plpgsql
SET search_path = public
as $$
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

    return p_project_id;
end;
$$;
