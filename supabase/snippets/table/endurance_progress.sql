create table endurance_progress (
  id uuid not null primary key default gen_random_uuid(),
  project_id uuid not null,

  current_count integer not null default 0
    check (current_count >= 0),
  
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),

  constraint fk_endurance_progress_project
    foreign key (project_id)
    references projects(id)
    on delete cascade
);
