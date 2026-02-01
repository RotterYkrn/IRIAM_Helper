create or replace function update_updated_at_column()
returns trigger
SET search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;
