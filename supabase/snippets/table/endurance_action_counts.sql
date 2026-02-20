drop table if exists endurance_action_counts;

create table endurance_action_counts (
    id uuid not null primary key default gen_random_uuid(),
    project_id uuid not null,
    unit_id uuid not null,
    
    normal_count integer not null default 0
        check (normal_count >= 0),

    rescue_count integer not null default 0
        check (rescue_count >= 0),

    sabotage_count integer not null default 0
        check (sabotage_count >= 0),
    
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),

    constraint fk_endurance_action_counts_project
        foreign key (project_id)
        references projects(id)
        on delete cascade,

    constraint fk_endurance_action_counts_unit
        foreign key (unit_id)
        references endurance_units(id)
        on delete cascade,
      
    constraint unique_endurance_action_count_unit
        unique (unit_id)
);

create index idx_endurance_action_count_unit
    on endurance_action_counts(unit_id);
