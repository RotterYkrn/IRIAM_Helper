create table multi_endurance_progress (
    id uuid primary key default gen_random_uuid(),
    setting_id uuid not null,

    current_count integer not null default 0
        check (current_count >= 0),

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    constraint fk_multi_endurance_progress_setting
        foreign key (setting_id)
        references multi_endurance_settings(id)
        on delete cascade,

    constraint unique_progress_per_setting
        unique (setting_id)
);

create index idx_endurance_progress_setting
    on multi_endurance_progress(setting_id);
