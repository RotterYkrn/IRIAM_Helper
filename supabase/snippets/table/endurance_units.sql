drop table if exists endurance_units cascade;

create table endurance_units (
    id uuid not null primary key default gen_random_uuid(),
    project_id uuid not null,

    label text not null check(length(trim(label)) > 0),

    target_count integer not null check (target_count > 0),

    current_count integer not null default 0,

    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),

    constraint fk_endurance_unit_project
        foreign key (project_id)
        references projects(id)
        on delete cascade
);

create index idx_endurance_unit_project
    on endurance_units(project_id);
