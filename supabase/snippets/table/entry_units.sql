drop table if exists enter_units cascade;

create table enter_units (
    id uuid not null primary key default gen_random_uuid(),
    project_id uuid not null,
    
    status text not null default 'scheduled'
        check (status in ('scheduled','active','finished')),

    event_date date unique not null,

    started_at timestamp with time zone,
    completed_at timestamp with time zone,

    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),

    constraint fk_enter_unit_project
        foreign key (project_id)
        references projects(id)
        on delete cascade
);

create index idx_enter_unit_project
    on enter_units(project_id);
create index idx_enter_unit_date
    on enter_units(event_date);
