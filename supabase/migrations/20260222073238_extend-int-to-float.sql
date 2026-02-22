alter table "public"."endurance_action_counts" drop constraint "endurance_action_counts_normal_count_check";

alter table "public"."endurance_action_counts" drop constraint "endurance_action_counts_rescue_count_check";

alter table "public"."endurance_action_counts" drop constraint "endurance_action_counts_sabotage_count_check";

alter table "public"."endurance_action_histories_new" drop constraint "endurance_action_histories_new_action_amount_check";

alter table "public"."endurance_actions_new" drop constraint "endurance_actions_new_amount_check";

alter table "public"."endurance_units" drop constraint "endurance_units_target_count_check";

drop function if exists "public"."create_endurance_project"(p_title text, p_target_count integer, p_rescue_actions public.create_endurance_action_args[], p_sabotage_actions public.create_endurance_action_args[]);

drop function if exists "public"."create_endurance_project_new"(p_title text, p_target_count integer, p_rescue_actions public.create_endurance_action_args[], p_sabotage_actions public.create_endurance_action_args[]);

drop function if exists "public"."log_endurance_action_history_new"(p_project_id uuid, p_unit_id uuid, p_action_history_type text, p_action_count integer, p_action_id uuid);

drop function if exists "public"."update_endurance_project"(p_project_id uuid, p_title text, p_target_count integer, p_rescue_actions public.update_endurance_action_args[], p_sabotage_actions public.update_endurance_action_args[]);

drop function if exists "public"."update_endurance_project_new"(p_project_id uuid, p_unit_id uuid, p_title text, p_target_count integer, p_rescue_actions public.update_endurance_action_args[], p_sabotage_actions public.update_endurance_action_args[]);

drop type "public"."create_endurance_action_args";

drop view if exists "public"."endurance_action_stats_view_new";

drop type "public"."endurance_action_stat_new";

drop view if exists "public"."endurance_project_view_new";

drop type "public"."update_endurance_action_args";

alter table "public"."endurance_action_counts" alter column "normal_count" set data type numeric(10,2) using "normal_count"::numeric(10,2);

alter table "public"."endurance_action_counts" alter column "rescue_count" set data type numeric(10,2) using "rescue_count"::numeric(10,2);

alter table "public"."endurance_action_counts" alter column "sabotage_count" set data type numeric(10,2) using "sabotage_count"::numeric(10,2);

alter table "public"."endurance_action_histories_new" alter column "action_amount" set data type numeric(10,2) using "action_amount"::numeric(10,2);

alter table "public"."endurance_actions_new" alter column "amount" set data type numeric(10,2) using "amount"::numeric(10,2);

alter table "public"."endurance_units" alter column "current_count" set data type numeric(10,2) using "current_count"::numeric(10,2);

alter table "public"."endurance_units" alter column "target_count" set data type numeric(10,2) using "target_count"::numeric(10,2);

alter table "public"."endurance_action_counts" add constraint "endurance_action_counts_normal_count_check" CHECK ((normal_count >= (0)::numeric)) not valid;

alter table "public"."endurance_action_counts" validate constraint "endurance_action_counts_normal_count_check";

alter table "public"."endurance_action_counts" add constraint "endurance_action_counts_rescue_count_check" CHECK ((rescue_count >= (0)::numeric)) not valid;

alter table "public"."endurance_action_counts" validate constraint "endurance_action_counts_rescue_count_check";

alter table "public"."endurance_action_counts" add constraint "endurance_action_counts_sabotage_count_check" CHECK ((sabotage_count >= (0)::numeric)) not valid;

alter table "public"."endurance_action_counts" validate constraint "endurance_action_counts_sabotage_count_check";

alter table "public"."endurance_action_histories_new" add constraint "endurance_action_histories_new_action_amount_check" CHECK ((action_amount > (0)::numeric)) not valid;

alter table "public"."endurance_action_histories_new" validate constraint "endurance_action_histories_new_action_amount_check";

alter table "public"."endurance_actions_new" add constraint "endurance_actions_new_amount_check" CHECK ((amount > (0)::numeric)) not valid;

alter table "public"."endurance_actions_new" validate constraint "endurance_actions_new_amount_check";

alter table "public"."endurance_units" add constraint "endurance_units_target_count_check" CHECK ((target_count > (0)::numeric)) not valid;

alter table "public"."endurance_units" validate constraint "endurance_units_target_count_check";

set check_function_bodies = off;

create type "public"."create_endurance_action_args" as ("position" integer, "label" text, "amount" numeric(10,2));

CREATE OR REPLACE FUNCTION public.create_endurance_project_new(p_title text, p_target_count numeric, p_rescue_actions public.create_endurance_action_args[], p_sabotage_actions public.create_endurance_action_args[])
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare
    v_project_id uuid;
    v_unit_id uuid;
    v_action create_endurance_action_args;
begin
    -- projects 作成
    insert into projects (
        title,
        type,
        status
    )
    values (
        p_title,
        'endurance',
        'scheduled'
    )
    returning id into v_project_id;

    -- endurance_settings
    insert into endurance_units (
        project_id,
        label,
        target_count
    )
    values (
        v_project_id,
        '不使用',
        p_target_count
    )
    returning id into v_unit_id;

    -- endurance_action_counts
    insert into endurance_action_counts (
        project_id,
        unit_id
    )
    values (
        v_project_id,
        v_unit_id
    );

    -- 救済
    foreach v_action in array p_rescue_actions
    loop
        insert into endurance_actions_new (
            project_id,
            unit_id,
            type,
            position,
            label,
            amount
        )
        values (
            v_project_id,
            v_unit_id,
            'rescue',
            v_action.position,
            v_action.label,
            v_action.amount
        );
    end loop;

    -- 妨害
    foreach v_action in array p_sabotage_actions
    loop
        insert into endurance_actions_new (
            project_id,
            unit_id,
            type,
            position,
            label,
            amount
        )
        values (
            v_project_id,
            v_unit_id,
            'sabotage',
            v_action.position,
            v_action.label,
            v_action.amount
        );
    end loop;

    return v_project_id;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.log_endurance_action_history_new(p_project_id uuid, p_unit_id uuid, p_action_history_type text, p_action_count numeric, p_action_id uuid DEFAULT NULL::uuid)
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare
    v_status text;
    v_amount numeric(10, 2);
begin
    -----------------------------
    -- 1) 企画の状態チェック
    -----------------------------
    select status
    into v_status
    from projects
    where id = p_project_id;

    if v_status is null then
        raise exception 'project not found';
    end if;

    if v_status <> 'active' then
        raise exception 'project is not active';
    end if;

    -----------------------------
    -- 2) amount の決定（分岐）
    -----------------------------
    if p_action_history_type = 'normal' then
        v_amount := 1;  -- 固定

    elsif p_action_history_type in ('rescue','sabotage') then
        -- 定義から amount を取得
        select amount
        into v_amount
        from endurance_actions_new
        where id = p_action_id;

        if v_amount is null then
            raise exception 'invalid action_id';
        end if;

    else
        raise exception 'invalid action_type';
    end if;

    -----------------------------
    -- 3) 履歴に記録（★最重要）
    -----------------------------
    insert into endurance_action_histories_new (
        project_id,
        unit_id,
        action_id,
        action_type,
        action_amount,
        action_count,
        created_at
    )
    values (
        p_project_id,
        p_unit_id,
        case 
            when p_action_history_type = 'normal' then null
            else p_action_id
        end,
        p_action_history_type,
        v_amount,
        p_action_count,
        now()
    );

    -----------------------------
    -- 4) action_count を更新
    -----------------------------
    if p_action_id is not null then
        update endurance_actions_new
        set
            count = count + p_action_count,
            updated_at = now()
        where id = p_action_id;
    end if;

    -----------------------------
    -- 4) count を更新
    -----------------------------
    update endurance_units
    set
        current_count =
            case
                when p_action_history_type = 'normal'
                    then current_count + v_amount * p_action_count

                when p_action_history_type = 'rescue'
                    then current_count + v_amount * p_action_count

                when p_action_history_type = 'sabotage'
                    then current_count - v_amount * p_action_count
            end,

        updated_at = now()

    where id = p_unit_id;

    update endurance_action_counts
    set
        normal_count =
            case when p_action_history_type = 'normal'
                then normal_count + v_amount * p_action_count
                else normal_count end,

        rescue_count =
            case when p_action_history_type = 'rescue'
                then rescue_count + v_amount * p_action_count
                else rescue_count end,

        sabotage_count =
            case when p_action_history_type = 'sabotage'
                then sabotage_count + v_amount * p_action_count
                else sabotage_count end,

        updated_at = now()

    where unit_id = p_unit_id;

    return p_project_id;
end;
$function$
;

create type "public"."update_endurance_action_args" as ("id" uuid, "position" integer, "label" text, "amount" numeric(10,2));

CREATE OR REPLACE FUNCTION public.update_endurance_project_new(p_project_id uuid, p_unit_id uuid, p_title text, p_target_count numeric, p_rescue_actions public.update_endurance_action_args[], p_sabotage_actions public.update_endurance_action_args[])
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare
    v_action update_endurance_action_args;
begin
    -- projects
    update projects
    set title = p_title
    where id = p_project_id;

    -- endurance_units
    update endurance_units
    set target_count = p_target_count
    where id = p_unit_id;

    -----------------------------
    -- 3) ★ 既存の救済/妨害を「まず削除」
    --    （フロントに無いものは消える）
    -----------------------------
    delete from endurance_actions_new
    where project_id = p_project_id
        and id not in (
            select (v.id)::uuid
            from unnest(p_rescue_actions || p_sabotage_actions) as v
            where (v.id)::uuid is not null
        );

    -----------------------------
    -- 4) 救済を UPSERT（更新 or 追加）
    -----------------------------
    foreach v_action in array p_rescue_actions
    loop
        if v_action.id is null then
            -- 新規作成
            insert into endurance_actions_new (
                project_id, unit_id, type, position, label, amount
            )
            values (
                p_project_id,
                p_unit_id,
                'rescue',
                v_action.position,
                v_action.label,
                v_action.amount
            );
        else
            -- 更新
            update endurance_actions_new
            set 
                position = v_action.position,
                label = v_action.label,
                amount = v_action.amount,
                updated_at = now()
            where id = v_action.id
                and project_id = p_project_id;
        end if;
    end loop;

    -----------------------------
    -- 5) 妨害も同様に UPSERT
    -----------------------------
    foreach v_action in array p_sabotage_actions
    loop
        if v_action.id is null then
            insert into endurance_actions_new (
                project_id, unit_id, type, position, label, amount
            )
            values (
                p_project_id,
                p_unit_id,
                'sabotage',
                v_action.position,
                v_action.label,
                v_action.amount
            );
        else
            update endurance_actions_new
            set 
                position = v_action.position,
                label = v_action.label,
                amount = v_action.amount,
                updated_at = now()
            where id = v_action.id
                and project_id = p_project_id;
        end if;
    end loop;

    return p_project_id;
end;
$function$
;

create type "public"."endurance_action_stat_new" as ("id" uuid, "type" text, "position" integer, "label" text, "amount" numeric(10,2), "count" integer);

create or replace view "public"."endurance_action_stats_view_new" as  SELECT p.id AS project_id,
    COALESCE(array_agg(ROW(a.id, a.type, a."position", a.label, a.amount, a.count)::public.endurance_action_stat_new ORDER BY a."position") FILTER (WHERE (a.type = 'rescue'::text)), '{}'::public.endurance_action_stat_new[]) AS rescue_actions,
    COALESCE(array_agg(ROW(a.id, a.type, a."position", a.label, a.amount, a.count)::public.endurance_action_stat_new ORDER BY a."position") FILTER (WHERE (a.type = 'sabotage'::text)), '{}'::public.endurance_action_stat_new[]) AS sabotage_actions
   FROM (public.projects p
     LEFT JOIN public.endurance_actions_new a ON ((a.project_id = p.id)))
  GROUP BY p.id;


create or replace view "public"."endurance_project_view_new" as  SELECT p.id,
    p.title,
    p.status,
    u.id AS unit_id,
    u.target_count,
    u.current_count,
    ac.normal_count,
    ac.rescue_count,
    ac.sabotage_count
   FROM ((public.projects p
     JOIN public.endurance_units u ON ((u.project_id = p.id)))
     JOIN public.endurance_action_counts ac ON ((ac.project_id = p.id)))
  WHERE (p.type = 'endurance'::text);


grant delete on table "public"."endurance_action_counts" to "postgres";

grant insert on table "public"."endurance_action_counts" to "postgres";

grant references on table "public"."endurance_action_counts" to "postgres";

grant select on table "public"."endurance_action_counts" to "postgres";

grant trigger on table "public"."endurance_action_counts" to "postgres";

grant truncate on table "public"."endurance_action_counts" to "postgres";

grant update on table "public"."endurance_action_counts" to "postgres";

grant delete on table "public"."endurance_action_histories_new" to "postgres";

grant insert on table "public"."endurance_action_histories_new" to "postgres";

grant references on table "public"."endurance_action_histories_new" to "postgres";

grant select on table "public"."endurance_action_histories_new" to "postgres";

grant trigger on table "public"."endurance_action_histories_new" to "postgres";

grant truncate on table "public"."endurance_action_histories_new" to "postgres";

grant update on table "public"."endurance_action_histories_new" to "postgres";

grant delete on table "public"."endurance_actions_new" to "postgres";

grant insert on table "public"."endurance_actions_new" to "postgres";

grant references on table "public"."endurance_actions_new" to "postgres";

grant select on table "public"."endurance_actions_new" to "postgres";

grant trigger on table "public"."endurance_actions_new" to "postgres";

grant truncate on table "public"."endurance_actions_new" to "postgres";

grant update on table "public"."endurance_actions_new" to "postgres";

grant delete on table "public"."endurance_units" to "postgres";

grant insert on table "public"."endurance_units" to "postgres";

grant references on table "public"."endurance_units" to "postgres";

grant select on table "public"."endurance_units" to "postgres";

grant trigger on table "public"."endurance_units" to "postgres";

grant truncate on table "public"."endurance_units" to "postgres";

grant update on table "public"."endurance_units" to "postgres";


