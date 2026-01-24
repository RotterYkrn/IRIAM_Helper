create or replace function now()
returns timestamptz as $$
  select now();
$$ language sql;
