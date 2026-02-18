DROP view IF EXISTS endurance_action_stats_view_new;
DROP TYPE IF EXISTS endurance_action_stat_new cascade;

create type endurance_action_stat_new as (
    id uuid,
    type text,
    position integer,
    label text,
    amount integer,
    count integer,
    action_times integer
);

create view endurance_action_stats_view_new as
select
    p.id as project_id,

    coalesce(
        array_agg(
            row(
                a.id,
                a.type,
                a.position,
                a.label,
                a.amount,
                a.count
            )::endurance_action_stat
            order by a.position ASC
        ) filter (where a.type = 'rescue'),
        '{}'::endurance_action_stat[]
    ) as rescue_actions,

    coalesce(
        array_agg(
            row(
                a.id,
                a.type,
                a.position,
                a.label,
                a.amount,
                a.count
            )::endurance_action_stat
            order by a.position ASC
        ) filter (where a.type = 'sabotage'),
        '{}'::endurance_action_stat[]
    ) as sabotage_actions

from projects p
left join endurance_actions_new a on a.project_id = p.id
group by p.id;
