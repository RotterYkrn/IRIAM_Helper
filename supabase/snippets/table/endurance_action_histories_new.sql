drop table if exists endurance_action_histories_new cascade;

create table endurance_action_histories_new (
    id uuid primary key default gen_random_uuid(),
    project_id uuid not null,
    unit_id uuid not null,
    action_id uuid null,

    action_type text not null
        check (action_type in ('normal','rescue','sabotage')),

    action_amount integer not null check (action_amount > 0),

    action_count integer not null,

    created_at timestamptz not null default now(),

    constraint fk_endurance_histories_project
        foreign key (project_id)
        references projects(id)
        on delete cascade,

    constraint fk_endurance_histories_unit
        foreign key (unit_id)
        references endurance_units(id)
        on delete cascade,

    constraint fk_endurance_histories_actions
        foreign key (action_id)
        references endurance_actions(id)
        on delete set null
);

create index idx_endurance_histories_project
    on endurance_action_histories_new (project_id);

create index idx_endurance_histories_unit
    on endurance_action_histories_new (unit_id);

create index idx_endurance_histories_actions_new
    on endurance_action_histories_new (action_id);
