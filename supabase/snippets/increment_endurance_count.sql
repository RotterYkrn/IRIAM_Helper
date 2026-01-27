create or replace function increment_endurance_count(
  p_project_id uuid,
  p_increment integer default 1
)
returns void
language plpgsql
as $$
declare
  v_status text;
begin
  -- プロジェクトの status を取得
  select status
  into v_status
  from projects
  where id = p_project_id;

  if v_status is null then
    raise exception 'project not found';
  end if;

  -- active 以外は拒否
  if v_status <> 'active' then
    raise exception 'project is not active';
  end if;

  update endurance_progress
  set current_count = least(
    current_count + p_increment,
    (select target_count
     from endurance_settings
     where project_id = p_project_id)
  )
  where project_id = p_project_id;
end;
$$;
