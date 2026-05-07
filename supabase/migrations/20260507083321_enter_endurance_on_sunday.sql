alter table "public"."projects" drop constraint "projects_type_check";


  create table "public"."enter_logs" (
    "id" uuid not null default gen_random_uuid(),
    "unit_id" uuid not null,
    "user_number" integer not null,
    "user_name" text not null,
    "entered_at" timestamp with time zone not null default now()
      );



  create table "public"."enter_units" (
    "id" uuid not null default gen_random_uuid(),
    "project_id" uuid not null,
    "status" text not null default 'ready'::text,
    "event_date" timestamp with time zone not null,
    "enter_count" integer not null default 0,
    "started_at" timestamp with time zone,
    "completed_at" timestamp with time zone,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


CREATE UNIQUE INDEX enter_logs_pkey ON public.enter_logs USING btree (id);

CREATE UNIQUE INDEX enter_logs_unit_id_user_name_key ON public.enter_logs USING btree (unit_id, user_name);

CREATE UNIQUE INDEX enter_logs_unit_id_user_number_key ON public.enter_logs USING btree (unit_id, user_number);

CREATE UNIQUE INDEX enter_units_event_date_key ON public.enter_units USING btree (event_date);

CREATE UNIQUE INDEX enter_units_pkey ON public.enter_units USING btree (id);

CREATE INDEX idx_enter_log_unit ON public.enter_logs USING btree (unit_id);

CREATE INDEX idx_enter_unit_date ON public.enter_units USING btree (event_date);

CREATE INDEX idx_enter_unit_project ON public.enter_units USING btree (project_id);

alter table "public"."enter_logs" add constraint "enter_logs_pkey" PRIMARY KEY using index "enter_logs_pkey";

alter table "public"."enter_units" add constraint "enter_units_pkey" PRIMARY KEY using index "enter_units_pkey";

alter table "public"."enter_logs" add constraint "enter_logs_unit_id_user_name_key" UNIQUE using index "enter_logs_unit_id_user_name_key";

alter table "public"."enter_logs" add constraint "enter_logs_unit_id_user_number_key" UNIQUE using index "enter_logs_unit_id_user_number_key";

alter table "public"."enter_logs" add constraint "fk_enter_log_unit" FOREIGN KEY (unit_id) REFERENCES public.enter_units(id) ON DELETE CASCADE not valid;

alter table "public"."enter_logs" validate constraint "fk_enter_log_unit";

alter table "public"."enter_units" add constraint "enter_units_enter_count_check" CHECK ((enter_count >= 0)) not valid;

alter table "public"."enter_units" validate constraint "enter_units_enter_count_check";

alter table "public"."enter_units" add constraint "enter_units_event_date_key" UNIQUE using index "enter_units_event_date_key";

alter table "public"."enter_units" add constraint "enter_units_status_check" CHECK ((status = ANY (ARRAY['ready'::text, 'active'::text, 'archiving'::text, 'finished'::text]))) not valid;

alter table "public"."enter_units" validate constraint "enter_units_status_check";

alter table "public"."enter_units" add constraint "fk_enter_unit_project" FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE not valid;

alter table "public"."enter_units" validate constraint "fk_enter_unit_project";

alter table "public"."projects" add constraint "projects_type_check" CHECK ((type = ANY (ARRAY['enter-endurance'::text, 'endurance'::text, 'multi-endurance'::text, 'panel_open'::text]))) not valid;

alter table "public"."projects" validate constraint "projects_type_check";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.activate_enter_unit(p_unit_id uuid, p_started_at timestamp with time zone)
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare
    v_status text;
begin
    select status
    into v_status
    from enter_units
    where id = p_unit_id;

    if v_status is null then
        raise exception 'enter unit not found';
    end if;

    -- draft / scheduled 以外は拒否
    if v_status <> 'ready' then
        raise exception 'enter unit cannot be activate';
    end if;

    update enter_units
    set 
        status = 'active',
        started_at = p_started_at
    where id = p_unit_id;

    return p_unit_id;
end;
$function$
;

create type "public"."archive_log_args" as ("user_number" integer, "user_name" text);

CREATE OR REPLACE FUNCTION public.archive_enter_logs(p_unit_id uuid, p_enter_count integer, p_started_at timestamp with time zone, p_completed_at timestamp with time zone, p_logs public.archive_log_args[])
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare
    v_status text;
    v_log archive_log_args;
begin
    -----------------------------
    -- 1) 企画の状態チェック
    -----------------------------
    select status
    into v_status
    from enter_units
    where id = p_unit_id;

    if v_status is null then
        raise exception 'enter unit not found';
    end if;

    if v_status <> 'archiving' then
        raise exception 'enter unit is not archiving';
    end if;

    update enter_units
    set
        status = 'finished',
        enter_count = p_enter_count,
        started_at = p_started_at,
        completed_at = p_completed_at,
        updated_at = now()
    where
        id = p_unit_id;

    -----------------------------
    -- 履歴に記録（★最重要）
    -----------------------------
    foreach v_log in array p_logs
    loop
        insert into enter_logs (
            unit_id,
            user_number,
            user_name,
            entered_at
        )
        values (
            p_unit_id,
            v_log.user_number,
            v_log.user_name,
            p_completed_at
        );
    end loop;

    return p_unit_id;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.archive_enter_unit(p_unit_id uuid)
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare
    v_status text;
begin
    select status
    into v_status
    from enter_units
    where id = p_unit_id;

    if v_status is null then
        raise exception 'enter unit not found';
    end if;

    -- draft / scheduled 以外は拒否
    if v_status <> 'ready' then
        raise exception 'enter unit cannot be archive';
    end if;

    update enter_units
    set 
        status = 'archiving'
    where id = p_unit_id;

    return p_unit_id;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.create_enter_endurance_project()
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare
    v_project_id uuid;
begin
    -- projects 作成
    insert into projects (
        title,
        type
    )
    values (
        '毎週日曜入室100人耐久',
        'enter-endurance'
    )
    returning id into v_project_id;

    return v_project_id;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.create_enter_unit(p_project_id uuid, p_event_date timestamp with time zone)
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare
    v_unit_id uuid;
begin
    -- enter_units
    insert into enter_units (
        project_id,
        event_date
    )
    values (
        p_project_id,
        p_event_date
    )
    returning id into v_unit_id;

    return v_unit_id;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.finish_enter_unit(p_unit_id uuid)
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare
    v_status text;
begin
    select status
    into v_status
    from enter_units
    where id = p_unit_id;

    if v_status is null then
        raise exception 'enter unit not found';
    end if;

    -- draft / scheduled 以外は拒否
    if v_status <> 'active' then
        raise exception 'enter unit cannot be finish';
    end if;

    update enter_units
    set status = 'finished'
    where id = p_unit_id;

    return p_unit_id;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.log_enter(p_unit_id uuid, p_user_number integer, p_user_name text, p_entered_at timestamp with time zone)
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
    from enter_units
    where id = p_unit_id;

    if v_status is null then
        raise exception 'enter unit not found';
    end if;

    if v_status <> 'active' then
        raise exception 'enter unit is not active';
    end if;

    update enter_units
    set
        enter_count = enter_count + 1,
        completed_at = case 
            when enter_count + 1 = 100 then now() 
            else completed_at 
        end,
        updated_at = now()
    where
        id = p_unit_id;

    -----------------------------
    -- 履歴に記録（★最重要）
    -----------------------------
    insert into enter_logs (
        unit_id,
        user_number,
        user_name,
        entered_at
    )
    values (
        p_unit_id,
        p_user_number,
        p_user_name,
        p_entered_at
    );

    return p_unit_id;
end;
$function$
;

grant delete on table "public"."enter_logs" to "anon";

grant insert on table "public"."enter_logs" to "anon";

grant references on table "public"."enter_logs" to "anon";

grant select on table "public"."enter_logs" to "anon";

grant trigger on table "public"."enter_logs" to "anon";

grant truncate on table "public"."enter_logs" to "anon";

grant update on table "public"."enter_logs" to "anon";

grant delete on table "public"."enter_logs" to "authenticated";

grant insert on table "public"."enter_logs" to "authenticated";

grant references on table "public"."enter_logs" to "authenticated";

grant select on table "public"."enter_logs" to "authenticated";

grant trigger on table "public"."enter_logs" to "authenticated";

grant truncate on table "public"."enter_logs" to "authenticated";

grant update on table "public"."enter_logs" to "authenticated";

grant delete on table "public"."enter_logs" to "postgres";

grant insert on table "public"."enter_logs" to "postgres";

grant references on table "public"."enter_logs" to "postgres";

grant select on table "public"."enter_logs" to "postgres";

grant trigger on table "public"."enter_logs" to "postgres";

grant truncate on table "public"."enter_logs" to "postgres";

grant update on table "public"."enter_logs" to "postgres";

grant delete on table "public"."enter_logs" to "service_role";

grant insert on table "public"."enter_logs" to "service_role";

grant references on table "public"."enter_logs" to "service_role";

grant select on table "public"."enter_logs" to "service_role";

grant trigger on table "public"."enter_logs" to "service_role";

grant truncate on table "public"."enter_logs" to "service_role";

grant update on table "public"."enter_logs" to "service_role";

grant delete on table "public"."enter_units" to "anon";

grant insert on table "public"."enter_units" to "anon";

grant references on table "public"."enter_units" to "anon";

grant select on table "public"."enter_units" to "anon";

grant trigger on table "public"."enter_units" to "anon";

grant truncate on table "public"."enter_units" to "anon";

grant update on table "public"."enter_units" to "anon";

grant delete on table "public"."enter_units" to "authenticated";

grant insert on table "public"."enter_units" to "authenticated";

grant references on table "public"."enter_units" to "authenticated";

grant select on table "public"."enter_units" to "authenticated";

grant trigger on table "public"."enter_units" to "authenticated";

grant truncate on table "public"."enter_units" to "authenticated";

grant update on table "public"."enter_units" to "authenticated";

grant delete on table "public"."enter_units" to "postgres";

grant insert on table "public"."enter_units" to "postgres";

grant references on table "public"."enter_units" to "postgres";

grant select on table "public"."enter_units" to "postgres";

grant trigger on table "public"."enter_units" to "postgres";

grant truncate on table "public"."enter_units" to "postgres";

grant update on table "public"."enter_units" to "postgres";

grant delete on table "public"."enter_units" to "service_role";

grant insert on table "public"."enter_units" to "service_role";

grant references on table "public"."enter_units" to "service_role";

grant select on table "public"."enter_units" to "service_role";

grant trigger on table "public"."enter_units" to "service_role";

grant truncate on table "public"."enter_units" to "service_role";

grant update on table "public"."enter_units" to "service_role";


