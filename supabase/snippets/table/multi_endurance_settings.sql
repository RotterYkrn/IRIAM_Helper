create table multi_endurance_settings (
    id uuid primary key default gen_random_uuid(),
    project_id uuid not null,

    label text not null check (length(trim(label)) > 0),
    
    target_count integer not null check (target_count > 0),

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    constraint fk_multi_endurance_setting_project
        foreign key (project_id)
        references projects(id)
        on delete cascade
);

create index idx_multi_endurance_setting_project
    on multi_endurance_settings(project_id);
