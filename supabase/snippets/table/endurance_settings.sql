create table endurance_settings (
    id uuid not null primary key default gen_random_uuid(),
    project_id uuid not null,

    target_count integer not null check (target_count > 0),

    rescue_enabled boolean not null default false,
    sabotage_enabled boolean not null default false,

    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),

    constraint fk_endurance_settings_project
        foreign key (project_id)
        references projects(id)
        on delete cascade,

    constraint unique_endurance_settings_project
        unique (project_id)
);

create index idx_endurance_settings_project
    on endurance_settings(project_id);
