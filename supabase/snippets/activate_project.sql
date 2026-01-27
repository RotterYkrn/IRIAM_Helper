create or replace function activate_project(
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

  -- draft / scheduled 以外は拒否
  if v_status <> 'scheduled' then
    raise exception 'project cannot be activated';
  end if;

  update projects
  set status = 'active'
  where id = p_project_id;
end;
$$;
