create or replace function create_endurance_project(
  p_title text,
  p_target_count integer
)
returns uuid
language plpgsql
as $$
declare
  v_project_id uuid;
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
    'endurance',
    'scheduled',
    now(),
    now()
  )
  returning id into v_project_id;

  -- endurance_settings
  insert into endurance_settings (
    id,
    project_id,
    target_count,
    increment_per_action,
    created_at,
    updated_at
  )
  values (
    gen_random_uuid(),
    v_project_id,
    p_target_count,
    1,
    now(),
    now()
  );

  -- endurance_progress
  insert into endurance_progress (
    id,
    project_id,
    current_count,
    created_at,
    updated_at
  )
  values (
    gen_random_uuid(),
    v_project_id,
    0,
    now(),
    now()
  );

  return v_project_id;
end;
$$;
