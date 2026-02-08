create table endurance_progress (
    id uuid not null primary key default gen_random_uuid(),
    project_id uuid not null,
    
    normal_count integer not null default 0
        check (normal_count >= 0),

    rescue_count integer not null default 0
        check (rescue_count >= 0),

    sabotage_count integer not null default 0
        check (sabotage_count >= 0),

    current_count integer not null default 0,
    
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),

    constraint fk_endurance_progress_project
        foreign key (project_id)
        references projects(id)
        on delete cascade,
      
    constraint unique_endurance_progress_project
        unique (project_id)
);

create index idx_endurance_progress_project
    on endurance_progress(project_id);
