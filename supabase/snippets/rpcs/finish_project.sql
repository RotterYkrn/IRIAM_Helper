create or replace function finish_project(
  p_project_id uuid
)
returns void
language plpgsql
as $$
declare
  v_status text;
begin
  select status
  into v_status
  from projects
  where id = p_project_id;

  if v_status is null then
    raise exception 'project not found';
  end if;

  -- active のときだけ終了できる
  if v_status <> 'active' then
    raise exception 'project is not active';
  end if;

  update projects
  set status = 'finished',
      updated_at = now()
  where id = p_project_id;
end;
$$;
