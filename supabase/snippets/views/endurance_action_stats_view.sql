DROP view IF EXISTS endurance_action_stats_view;
DROP TYPE IF EXISTS endurance_action_stat cascade;

create type endurance_action_stat as (
    id uuid,
    type text,
    position integer,
    label text,
    amount integer,
    action_times integer
);

create or replace view endurance_action_stats_view as
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
                (
                    select count(*)
                    from endurance_action_histories h
                    where h.action_id = a.id
                )
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
                (
                    select count(*)
                    from endurance_action_histories h
                    where h.action_id = a.id
                )
            )::endurance_action_stat
            order by a.position ASC
        ) filter (where a.type = 'sabotage'),
        '{}'::endurance_action_stat[]
    ) as sabotage_actions

from projects p
left join endurance_actions a on a.project_id = p.id
group by p.id;
