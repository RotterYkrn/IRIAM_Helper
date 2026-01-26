create table endurance_settings (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null,

  target_count integer not null check (target_count > 0),
  
  increment_per_action integer not null default 1 check (increment_per_action > 0),

  created_at timestamp with time zone default now(),
  constraint fk_endurance_settings_project
    foreign key (project_id)
    references projects(id)
    on delete cascade
);
