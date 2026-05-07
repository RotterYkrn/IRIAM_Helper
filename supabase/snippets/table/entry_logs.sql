drop table if exists enter_logs cascade;

create table enter_logs (
    id uuid not null primary key default gen_random_uuid(),
    unit_id uuid not null,

    user_number integer not null,

    user_name text not null,

    entered_at timestamp with time zone not null default now(),

    unique (unit_id, user_number),
    unique (unit_id, user_name),

    constraint fk_enter_log_unit
        foreign key (unit_id)
        references enter_units(id)
        on delete cascade
);

create index idx_enter_log_unit
    on enter_logs(unit_id);
