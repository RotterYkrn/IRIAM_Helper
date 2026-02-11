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
    a.project_id,

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
    ) filter (where a.type = 'rescue')
    as rescue_actions,

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
    ) filter (where a.type = 'sabotage')
    as sabotage_actions

from endurance_actions a
group by a.project_id;
