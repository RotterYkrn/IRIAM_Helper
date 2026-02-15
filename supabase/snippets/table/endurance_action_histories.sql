create table endurance_action_histories (
    id uuid primary key default gen_random_uuid(),
    project_id uuid not null,
    action_id uuid null,

    action_type text not null
        check (action_type in ('normal','rescue','sabotage')),

    action_amount integer not null check (action_amount > 0),

    is_reversal boolean not null default false,

    created_at timestamptz not null default now(),

    constraint fk_endurance_histories_project
        foreign key (project_id)
        references projects(id)
        on delete cascade,

    constraint fk_endurance_histories_actions
        foreign key (action_id)
        references endurance_actions(id)
        on delete set null
);

create index idx_endurance_histories_project_created
    on endurance_action_histories (project_id, created_at desc);

create index idx_endurance_histories_actions
    on endurance_action_histories (action_id);
