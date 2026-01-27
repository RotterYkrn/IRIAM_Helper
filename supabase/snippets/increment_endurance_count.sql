create or replace function increment_endurance_count(
  p_project_id uuid,
  p_increment integer default 1
)
returns void
language plpgsql
as $$
begin
  update endurance_progress
  set current_count = current_count + p_increment
  where project_id = p_project_id;
end;
$$;
