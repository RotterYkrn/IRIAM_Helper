DROP view IF EXISTS multi_endurance_project_view;
DROP TYPE IF EXISTS multi_endurance_stat cascade;

create type multi_endurance_stat as (
    id uuid,
    position integer,
    label text,
    target_count integer,
    current_count integer
);

create view multi_endurance_project_view as
select
    p.id,
    p.status,
    p.title,

    coalesce(
        array_agg(
            row(
                ms.id,
                ms.position,
                ms.label,
                ms.target_count,
                mp.current_count
            )::multi_endurance_stat
            order by ms.position ASC
        ) filter (where ms.id is not null),
        '{}'::multi_endurance_stat[]
    ) as endurance_stats

from projects p
left join multi_endurance_settings ms on ms.project_id = p.id
left join multi_endurance_progress mp on mp.setting_id = ms.id
group by p.id, p.status, p.title;
