drop table if exists endurance_actions_new;

create table endurance_actions_new (
    id uuid primary key default gen_random_uuid(),
    project_id uuid not null,
    unit_id uuid not null,

    type text not null
        check (type in ('rescue','sabotage')),

    position integer not null check (position >= 0),

    label text not null check(length(trim(label)) > 0),

    amount integer not null check(amount > 0),

    count integer not null default 0 check(count >= 0),

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    constraint fk_action_project
        foreign key (project_id)
        references projects(id)
        on delete cascade,

    constraint fk_action_unit
        foreign key (unit_id)
        references endurance_units(id)
        on delete cascade,

    constraint unique_action_per_unit
        unique (unit_id)
);

create index idx_endurance_unit
    on endurance_actions_new(unit_id);
