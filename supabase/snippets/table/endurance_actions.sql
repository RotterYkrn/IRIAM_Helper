create table endurance_actions (
    id uuid primary key default gen_random_uuid(),
    project_id uuid not null,

    type text not null
        check (type in ('rescue','sabotage')),

    position integer not null,

    label text not null,

    amount integer not null check (amount > 0),

    created_at timestamptz not null default now(),

    constraint fk_action_project
        foreign key (project_id)
        references projects(id)
        on delete cascade,

    constraint unique_action_per_project
        unique (project_id, label)
);

create index idx_endurance_actions_project_type_position
    on endurance_actions (project_id, type, position);
