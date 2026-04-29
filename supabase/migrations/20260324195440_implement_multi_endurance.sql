revoke delete on table "public"."endurance_settings" from "anon";

revoke insert on table "public"."endurance_settings" from "anon";

revoke references on table "public"."endurance_settings" from "anon";

revoke select on table "public"."endurance_settings" from "anon";

revoke trigger on table "public"."endurance_settings" from "anon";

revoke truncate on table "public"."endurance_settings" from "anon";

revoke update on table "public"."endurance_settings" from "anon";

revoke delete on table "public"."endurance_settings" from "authenticated";

revoke insert on table "public"."endurance_settings" from "authenticated";

revoke references on table "public"."endurance_settings" from "authenticated";

revoke select on table "public"."endurance_settings" from "authenticated";

revoke trigger on table "public"."endurance_settings" from "authenticated";

revoke truncate on table "public"."endurance_settings" from "authenticated";

revoke update on table "public"."endurance_settings" from "authenticated";

revoke delete on table "public"."endurance_settings" from "service_role";

revoke insert on table "public"."endurance_settings" from "service_role";

revoke references on table "public"."endurance_settings" from "service_role";

revoke select on table "public"."endurance_settings" from "service_role";

revoke trigger on table "public"."endurance_settings" from "service_role";

revoke truncate on table "public"."endurance_settings" from "service_role";

revoke update on table "public"."endurance_settings" from "service_role";

alter table "public"."endurance_settings" drop constraint "endurance_settings_target_count_check";

alter table "public"."endurance_settings" drop constraint "fk_endurance_settings_project";

alter table "public"."endurance_settings" drop constraint "unique_endurance_settings_project";

alter table "public"."projects" drop constraint "projects_type_check";

alter table "public"."endurance_settings" drop constraint "endurance_settings_pkey";

drop index if exists "public"."endurance_settings_pkey";

drop index if exists "public"."idx_endurance_settings_project";

drop index if exists "public"."unique_endurance_settings_project";

drop table "public"."endurance_settings";

alter table "public"."endurance_units" add column "position" integer not null default 0;

alter table "public"."endurance_units" add constraint "endurance_units_position_check" CHECK (("position" >= 0)) not valid;

alter table "public"."endurance_units" validate constraint "endurance_units_position_check";

alter table "public"."projects" add constraint "projects_type_check" CHECK ((type = ANY (ARRAY['endurance'::text, 'multi-endurance'::text, 'panel_open'::text]))) not valid;

alter table "public"."projects" validate constraint "projects_type_check";

set check_function_bodies = off;

create type "public"."create_unit_args" as ("position" integer, "label" text, "target_count" numeric(10,2));

CREATE OR REPLACE FUNCTION public.create_multi_endurance_project(p_title text, p_units public.create_unit_args[])
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare
    v_project_id uuid;
    v_unit create_unit_args;
begin
    -- projects 作成
    insert into projects (
        title,
        type,
        status
    )
    values (
        p_title,
        'multi-endurance',
        'scheduled'
    )
    returning id into v_project_id;
    
    -- endurance_units
    foreach v_unit in array p_units
    loop
        insert into endurance_units (
            project_id,
            position,
            label,
            target_count
        )
        values (
            v_project_id,
            v_unit.position,
            v_unit.label,
            v_unit.target_count
        );
    end loop;

    return v_project_id;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.log_multi_endurance_action_history(p_project_id uuid, p_unit_id uuid, p_action_count integer)
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare
    v_status text;
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
    -- 履歴に記録（★最重要）
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
        null,
        'normal',
        1,
        p_action_count,
        now()
    );

    -----------------------------
    -- 4) count を更新
    -----------------------------
    update endurance_units
    set
        current_count = current_count + p_action_count,
        updated_at = now()
    where id = p_unit_id;

    return p_unit_id;
end;
$function$
;

create type "public"."update_unit_args" as ("id" uuid, "position" integer, "label" text, "target_count" numeric(10,2));

CREATE OR REPLACE FUNCTION public.update_multi_endurance_project(p_project_id uuid, p_title text, p_units public.update_unit_args[])
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare
    v_unit update_unit_args;
begin
    -- projects
    update projects
    set title = p_title
    where id = p_project_id;
    
    -- endurance_units
    foreach v_unit in array p_units
    loop
        insert into endurance_units (
            project_id,
            label,
            target_count
        )
        values (
            p_project_id,
            v_unit.label,
            v_unit.target_count
        );
    end loop;
    
    -----------------------------
    -- 3) ★ 既存のユニットを「まず削除」
    --    （フロントに無いものは消える）
    -----------------------------
    delete from endurance_units
    where project_id = p_project_id
        and id not in (
            select (v.id)::uuid
            from unnest(p_units) as v
            where (v.id)::uuid is not null
        );

    -----------------------------
    -- 4) 救済を UPSERT（更新 or 追加）
    -----------------------------
    foreach v_unit in array p_units
    loop
        if v_unit.id is null then
            -- 新規作成
            insert into endurance_units (
                project_id,
                position,
                label,
                target_count
            )
            values (
                p_project_id,
                v_unit.position,
                v_unit.label,
                v_unit.target_count
            );
        else
            -- 更新
            update endurance_units
            set 
                position = v_unit.position,
                label = v_unit.label,
                target_count = v_unit.target_count,
                updated_at = now()
            where id = v_unit.id
                and project_id = p_project_id;
        end if;
    end loop;

    return p_project_id;
end;
$function$
;

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


