create extension if not exists "pg_net" with schema "extensions";


  create table "public"."endurance_action_histories" (
    "id" uuid not null default gen_random_uuid(),
    "project_id" uuid not null,
    "action_id" uuid,
    "action_type" text not null,
    "action_amount" integer not null,
    "created_at" timestamp with time zone not null default now()
      );



  create table "public"."endurance_actions" (
    "id" uuid not null default gen_random_uuid(),
    "project_id" uuid not null,
    "type" text not null,
    "position" integer not null,
    "label" text not null,
    "amount" integer not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );



  create table "public"."endurance_progress" (
    "id" uuid not null default gen_random_uuid(),
    "project_id" uuid not null,
    "normal_count" integer not null default 0,
    "rescue_count" integer not null default 0,
    "sabotage_count" integer not null default 0,
    "current_count" integer not null default 0,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );



  create table "public"."endurance_settings" (
    "id" uuid not null default gen_random_uuid(),
    "project_id" uuid not null,
    "target_count" integer not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );



  create table "public"."projects" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null,
    "type" text not null,
    "status" text not null default 'scheduled'::text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


CREATE UNIQUE INDEX endurance_action_histories_pkey ON public.endurance_action_histories USING btree (id);

CREATE UNIQUE INDEX endurance_actions_pkey ON public.endurance_actions USING btree (id);

CREATE UNIQUE INDEX endurance_progress_pkey ON public.endurance_progress USING btree (id);

CREATE UNIQUE INDEX endurance_settings_pkey ON public.endurance_settings USING btree (id);

CREATE INDEX idx_endurance_actions_project_type_position ON public.endurance_actions USING btree (project_id, type, "position");

CREATE INDEX idx_endurance_histories_actions ON public.endurance_action_histories USING btree (action_id);

CREATE INDEX idx_endurance_histories_project_created ON public.endurance_action_histories USING btree (project_id, created_at DESC);

CREATE INDEX idx_endurance_progress_project ON public.endurance_progress USING btree (project_id);

CREATE INDEX idx_endurance_settings_project ON public.endurance_settings USING btree (project_id);

CREATE UNIQUE INDEX projects_pkey ON public.projects USING btree (id);

CREATE UNIQUE INDEX unique_action_per_project ON public.endurance_actions USING btree (project_id, label);

CREATE UNIQUE INDEX unique_endurance_progress_project ON public.endurance_progress USING btree (project_id);

CREATE UNIQUE INDEX unique_endurance_settings_project ON public.endurance_settings USING btree (project_id);

alter table "public"."endurance_action_histories" add constraint "endurance_action_histories_pkey" PRIMARY KEY using index "endurance_action_histories_pkey";

alter table "public"."endurance_actions" add constraint "endurance_actions_pkey" PRIMARY KEY using index "endurance_actions_pkey";

alter table "public"."endurance_progress" add constraint "endurance_progress_pkey" PRIMARY KEY using index "endurance_progress_pkey";

alter table "public"."endurance_settings" add constraint "endurance_settings_pkey" PRIMARY KEY using index "endurance_settings_pkey";

alter table "public"."projects" add constraint "projects_pkey" PRIMARY KEY using index "projects_pkey";

alter table "public"."endurance_action_histories" add constraint "endurance_action_histories_action_amount_check" CHECK ((action_amount > 0)) not valid;

alter table "public"."endurance_action_histories" validate constraint "endurance_action_histories_action_amount_check";

alter table "public"."endurance_action_histories" add constraint "endurance_action_histories_action_type_check" CHECK ((action_type = ANY (ARRAY['normal'::text, 'rescue'::text, 'sabotage'::text]))) not valid;

alter table "public"."endurance_action_histories" validate constraint "endurance_action_histories_action_type_check";

alter table "public"."endurance_action_histories" add constraint "fk_endurance_histories_actions" FOREIGN KEY (action_id) REFERENCES public.endurance_actions(id) ON DELETE SET NULL not valid;

alter table "public"."endurance_action_histories" validate constraint "fk_endurance_histories_actions";

alter table "public"."endurance_action_histories" add constraint "fk_endurance_histories_project" FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE not valid;

alter table "public"."endurance_action_histories" validate constraint "fk_endurance_histories_project";

alter table "public"."endurance_actions" add constraint "endurance_actions_amount_check" CHECK ((amount > 0)) not valid;

alter table "public"."endurance_actions" validate constraint "endurance_actions_amount_check";

alter table "public"."endurance_actions" add constraint "endurance_actions_type_check" CHECK ((type = ANY (ARRAY['rescue'::text, 'sabotage'::text]))) not valid;

alter table "public"."endurance_actions" validate constraint "endurance_actions_type_check";

alter table "public"."endurance_actions" add constraint "fk_action_project" FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE not valid;

alter table "public"."endurance_actions" validate constraint "fk_action_project";

alter table "public"."endurance_actions" add constraint "unique_action_per_project" UNIQUE using index "unique_action_per_project";

alter table "public"."endurance_progress" add constraint "endurance_progress_normal_count_check" CHECK ((normal_count >= 0)) not valid;

alter table "public"."endurance_progress" validate constraint "endurance_progress_normal_count_check";

alter table "public"."endurance_progress" add constraint "endurance_progress_rescue_count_check" CHECK ((rescue_count >= 0)) not valid;

alter table "public"."endurance_progress" validate constraint "endurance_progress_rescue_count_check";

alter table "public"."endurance_progress" add constraint "endurance_progress_sabotage_count_check" CHECK ((sabotage_count >= 0)) not valid;

alter table "public"."endurance_progress" validate constraint "endurance_progress_sabotage_count_check";

alter table "public"."endurance_progress" add constraint "fk_endurance_progress_project" FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE not valid;

alter table "public"."endurance_progress" validate constraint "fk_endurance_progress_project";

alter table "public"."endurance_progress" add constraint "unique_endurance_progress_project" UNIQUE using index "unique_endurance_progress_project";

alter table "public"."endurance_settings" add constraint "endurance_settings_target_count_check" CHECK ((target_count > 0)) not valid;

alter table "public"."endurance_settings" validate constraint "endurance_settings_target_count_check";

alter table "public"."endurance_settings" add constraint "fk_endurance_settings_project" FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE not valid;

alter table "public"."endurance_settings" validate constraint "fk_endurance_settings_project";

alter table "public"."endurance_settings" add constraint "unique_endurance_settings_project" UNIQUE using index "unique_endurance_settings_project";

alter table "public"."projects" add constraint "projects_status_check" CHECK ((status = ANY (ARRAY['scheduled'::text, 'active'::text, 'finished'::text]))) not valid;

alter table "public"."projects" validate constraint "projects_status_check";

alter table "public"."projects" add constraint "projects_title_check" CHECK ((length(TRIM(BOTH FROM title)) > 0)) not valid;

alter table "public"."projects" validate constraint "projects_title_check";

alter table "public"."projects" add constraint "projects_type_check" CHECK ((type = ANY (ARRAY['endurance'::text, 'gacha'::text, 'panel_open'::text]))) not valid;

alter table "public"."projects" validate constraint "projects_type_check";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.activate_project(p_project_id uuid)
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare
  v_status text;
begin
  select status
  into v_status
  from projects
  where id = p_project_id;

  if v_status is null then
    raise exception 'project not found';
  end if;

  -- draft / scheduled 以外は拒否
  if v_status <> 'scheduled' then
    raise exception 'project cannot be activated';
  end if;

  update projects
  set status = 'active'
  where id = p_project_id;

  return p_project_id;
end;
$function$
;

create type "public"."create_endurance_action_args" as ("position" integer, "label" text, "amount" integer);

CREATE OR REPLACE FUNCTION public.create_endurance_project(p_title text, p_target_count integer, p_rescue_actions public.create_endurance_action_args[], p_sabotage_actions public.create_endurance_action_args[])
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare
    v_project_id uuid;
    v_action create_endurance_action_args;
begin
    -- projects 作成
    insert into projects (
        id,
        title,
        type,
        status,
        created_at,
        updated_at
    )
    values (
        gen_random_uuid(),
        p_title,
        'endurance',
        'scheduled',
        now(),
        now()
    )
    returning id into v_project_id;

    -- endurance_settings
    insert into endurance_settings (
        id,
        project_id,
        target_count,
        created_at,
        updated_at
    )
    values (
        gen_random_uuid(),
        v_project_id,
        p_target_count,
        now(),
        now()
    );

    -- endurance_progress
    insert into endurance_progress (
        id,
        project_id,
        current_count,
        normal_count, rescue_count, sabotage_count,
        created_at,
        updated_at
    )
    values (
        gen_random_uuid(),
        v_project_id,
        0,
        0, 0, 0,
        now(),
        now()
    );

    -- 救済
    foreach v_action in array p_rescue_actions
    loop
        insert into endurance_actions (
            id, project_id, type, position, label, amount, created_at, updated_at
        )
        values (
            gen_random_uuid(),
            v_project_id,
            'rescue',
            v_action.position,
            v_action.label,
            v_action.amount,
            now(),
            now()
        );
    end loop;

    -- 妨害
    foreach v_action in array p_sabotage_actions
    loop
        insert into endurance_actions (
            id, project_id, type, position, label, amount, created_at, updated_at
        )
        values (
            gen_random_uuid(),
            v_project_id,
            'sabotage',
            v_action.position,
            v_action.label,
            v_action.amount,
            now(),
            now()
        );
    end loop;

    return v_project_id;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.delete_project(p_project_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare
  v_status text;
begin
  -- status 取得
  select status
  into v_status
  from projects
  where id = p_project_id;

  if v_status is null then
    raise exception 'project not found';
  end if;

  -- scheduled のみ削除可
  if v_status <> 'scheduled' then
    raise exception 'only scheduled projects can be deleted';
  end if;

  -- 削除（CASCADE で子も消える）
  delete from projects
  where id = p_project_id;
end;
$function$
;

create type "public"."endurance_action_stat" as ("id" uuid, "type" text, "position" integer, "label" text, "amount" integer, "action_times" integer);

create or replace view "public"."endurance_action_stats_view" as  SELECT p.id AS project_id,
    COALESCE(array_agg(ROW(a.id, a.type, a."position", a.label, a.amount, (( SELECT count(*) AS count
           FROM public.endurance_action_histories h
          WHERE (h.action_id = a.id)))::integer)::public.endurance_action_stat ORDER BY a."position") FILTER (WHERE (a.type = 'rescue'::text)), '{}'::public.endurance_action_stat[]) AS rescue_actions,
    COALESCE(array_agg(ROW(a.id, a.type, a."position", a.label, a.amount, (( SELECT count(*) AS count
           FROM public.endurance_action_histories h
          WHERE (h.action_id = a.id)))::integer)::public.endurance_action_stat ORDER BY a."position") FILTER (WHERE (a.type = 'sabotage'::text)), '{}'::public.endurance_action_stat[]) AS sabotage_actions
   FROM (public.projects p
     LEFT JOIN public.endurance_actions a ON ((a.project_id = p.id)))
  GROUP BY p.id;


create or replace view "public"."endurance_project_view" as  SELECT p.id,
    p.title,
    p.status,
    ps.target_count,
    pr.current_count,
    pr.normal_count,
    pr.rescue_count,
    pr.sabotage_count
   FROM ((public.projects p
     JOIN public.endurance_settings ps ON ((ps.project_id = p.id)))
     JOIN public.endurance_progress pr ON ((pr.project_id = p.id)))
  WHERE (p.type = 'endurance'::text);


CREATE OR REPLACE FUNCTION public.finish_project(p_project_id uuid)
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare
  v_status text;
begin
  select status
  into v_status
  from projects
  where id = p_project_id;

  if v_status is null then
    raise exception 'project not found';
  end if;

  -- active のときだけ終了できる
  if v_status <> 'active' then
    raise exception 'project is not active';
  end if;

  update projects
  set status = 'finished',
      updated_at = now()
  where id = p_project_id;

  return p_project_id;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.increment_endurance_count(p_project_id uuid, p_increment integer)
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare
  v_status text;
begin
  -- プロジェクトの status を取得
  select status
  into v_status
  from projects
  where id = p_project_id;

  if v_status is null then
    raise exception 'project not found';
  end if;

  -- active 以外は拒否
  if v_status <> 'active' then
    raise exception 'project is not active';
  end if;

  update endurance_progress
  set current_count = least(
    current_count + p_increment,
    (select target_count
     from endurance_settings
     where project_id = p_project_id)
  )
  where project_id = p_project_id;

  return p_project_id;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.log_endurance_action_history(p_project_id uuid, p_action_history_type text, p_action_id uuid DEFAULT NULL::uuid)
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare
    v_status text;
    v_amount integer;
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
        from endurance_actions
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
    insert into endurance_action_histories (
        project_id,
        action_id,
        action_type,
        action_amount,
        created_at
    )
    values (
        p_project_id,
        case 
            when p_action_history_type = 'normal' then null
            else p_action_id
        end,
        p_action_history_type,
        v_amount,
        now()
    );

    -----------------------------
    -- 4) progress を更新（あなたのロジック）
    -----------------------------
    update endurance_progress
    set
        current_count =
            case
                when p_action_history_type = 'normal'
                    then current_count + v_amount

                when p_action_history_type = 'rescue'
                    then current_count + v_amount

                when p_action_history_type = 'sabotage'
                    then current_count - v_amount
            end,

        normal_count =
            case when p_action_history_type = 'normal'
                then normal_count + v_amount
                else normal_count end,

        rescue_count =
            case when p_action_history_type = 'rescue'
                then rescue_count + v_amount
                else rescue_count end,

        sabotage_count =
            case when p_action_history_type = 'sabotage'
                then sabotage_count + v_amount
                else sabotage_count end,

        updated_at = now()

    where project_id = p_project_id;

    return p_project_id;
end;
$function$
;

create type "public"."update_endurance_action_args" as ("id" uuid, "position" integer, "label" text, "amount" integer);

CREATE OR REPLACE FUNCTION public.update_endurance_project(p_project_id uuid, p_title text, p_target_count integer, p_rescue_actions public.update_endurance_action_args[], p_sabotage_actions public.update_endurance_action_args[])
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

    -- endurance_settings
    update endurance_settings
    set target_count = p_target_count
    where project_id = p_project_id;

    -----------------------------
    -- 3) ★ 既存の救済/妨害を「まず削除」
    --    （フロントに無いものは消える）
    -----------------------------
    delete from endurance_actions
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
            insert into endurance_actions (
                id, project_id, type, position, label, amount, created_at, updated_at
            )
            values (
                gen_random_uuid(),
                p_project_id,
                'rescue',
                v_action.position,
                v_action.label,
                v_action.amount,
                now(),
                now()
            );
        else
            -- 更新
            update endurance_actions
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
            insert into endurance_actions (
                id, project_id, type, position, label, amount, created_at, updated_at
            )
            values (
                gen_random_uuid(),
                p_project_id,
                'sabotage',
                v_action.position,
                v_action.label,
                v_action.amount,
                now(),
                now()
            );
        else
            update endurance_actions
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

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$
;

grant delete on table "public"."endurance_action_histories" to "anon";

grant insert on table "public"."endurance_action_histories" to "anon";

grant references on table "public"."endurance_action_histories" to "anon";

grant select on table "public"."endurance_action_histories" to "anon";

grant trigger on table "public"."endurance_action_histories" to "anon";

grant truncate on table "public"."endurance_action_histories" to "anon";

grant update on table "public"."endurance_action_histories" to "anon";

grant delete on table "public"."endurance_action_histories" to "authenticated";

grant insert on table "public"."endurance_action_histories" to "authenticated";

grant references on table "public"."endurance_action_histories" to "authenticated";

grant select on table "public"."endurance_action_histories" to "authenticated";

grant trigger on table "public"."endurance_action_histories" to "authenticated";

grant truncate on table "public"."endurance_action_histories" to "authenticated";

grant update on table "public"."endurance_action_histories" to "authenticated";

grant delete on table "public"."endurance_action_histories" to "postgres";

grant insert on table "public"."endurance_action_histories" to "postgres";

grant references on table "public"."endurance_action_histories" to "postgres";

grant select on table "public"."endurance_action_histories" to "postgres";

grant trigger on table "public"."endurance_action_histories" to "postgres";

grant truncate on table "public"."endurance_action_histories" to "postgres";

grant update on table "public"."endurance_action_histories" to "postgres";

grant delete on table "public"."endurance_action_histories" to "service_role";

grant insert on table "public"."endurance_action_histories" to "service_role";

grant references on table "public"."endurance_action_histories" to "service_role";

grant select on table "public"."endurance_action_histories" to "service_role";

grant trigger on table "public"."endurance_action_histories" to "service_role";

grant truncate on table "public"."endurance_action_histories" to "service_role";

grant update on table "public"."endurance_action_histories" to "service_role";

grant delete on table "public"."endurance_actions" to "anon";

grant insert on table "public"."endurance_actions" to "anon";

grant references on table "public"."endurance_actions" to "anon";

grant select on table "public"."endurance_actions" to "anon";

grant trigger on table "public"."endurance_actions" to "anon";

grant truncate on table "public"."endurance_actions" to "anon";

grant update on table "public"."endurance_actions" to "anon";

grant delete on table "public"."endurance_actions" to "authenticated";

grant insert on table "public"."endurance_actions" to "authenticated";

grant references on table "public"."endurance_actions" to "authenticated";

grant select on table "public"."endurance_actions" to "authenticated";

grant trigger on table "public"."endurance_actions" to "authenticated";

grant truncate on table "public"."endurance_actions" to "authenticated";

grant update on table "public"."endurance_actions" to "authenticated";

grant delete on table "public"."endurance_actions" to "postgres";

grant insert on table "public"."endurance_actions" to "postgres";

grant references on table "public"."endurance_actions" to "postgres";

grant select on table "public"."endurance_actions" to "postgres";

grant trigger on table "public"."endurance_actions" to "postgres";

grant truncate on table "public"."endurance_actions" to "postgres";

grant update on table "public"."endurance_actions" to "postgres";

grant delete on table "public"."endurance_actions" to "service_role";

grant insert on table "public"."endurance_actions" to "service_role";

grant references on table "public"."endurance_actions" to "service_role";

grant select on table "public"."endurance_actions" to "service_role";

grant trigger on table "public"."endurance_actions" to "service_role";

grant truncate on table "public"."endurance_actions" to "service_role";

grant update on table "public"."endurance_actions" to "service_role";

grant delete on table "public"."endurance_progress" to "anon";

grant insert on table "public"."endurance_progress" to "anon";

grant references on table "public"."endurance_progress" to "anon";

grant select on table "public"."endurance_progress" to "anon";

grant trigger on table "public"."endurance_progress" to "anon";

grant truncate on table "public"."endurance_progress" to "anon";

grant update on table "public"."endurance_progress" to "anon";

grant delete on table "public"."endurance_progress" to "authenticated";

grant insert on table "public"."endurance_progress" to "authenticated";

grant references on table "public"."endurance_progress" to "authenticated";

grant select on table "public"."endurance_progress" to "authenticated";

grant trigger on table "public"."endurance_progress" to "authenticated";

grant truncate on table "public"."endurance_progress" to "authenticated";

grant update on table "public"."endurance_progress" to "authenticated";

grant delete on table "public"."endurance_progress" to "postgres";

grant insert on table "public"."endurance_progress" to "postgres";

grant references on table "public"."endurance_progress" to "postgres";

grant select on table "public"."endurance_progress" to "postgres";

grant trigger on table "public"."endurance_progress" to "postgres";

grant truncate on table "public"."endurance_progress" to "postgres";

grant update on table "public"."endurance_progress" to "postgres";

grant delete on table "public"."endurance_progress" to "service_role";

grant insert on table "public"."endurance_progress" to "service_role";

grant references on table "public"."endurance_progress" to "service_role";

grant select on table "public"."endurance_progress" to "service_role";

grant trigger on table "public"."endurance_progress" to "service_role";

grant truncate on table "public"."endurance_progress" to "service_role";

grant update on table "public"."endurance_progress" to "service_role";

grant delete on table "public"."endurance_settings" to "anon";

grant insert on table "public"."endurance_settings" to "anon";

grant references on table "public"."endurance_settings" to "anon";

grant select on table "public"."endurance_settings" to "anon";

grant trigger on table "public"."endurance_settings" to "anon";

grant truncate on table "public"."endurance_settings" to "anon";

grant update on table "public"."endurance_settings" to "anon";

grant delete on table "public"."endurance_settings" to "authenticated";

grant insert on table "public"."endurance_settings" to "authenticated";

grant references on table "public"."endurance_settings" to "authenticated";

grant select on table "public"."endurance_settings" to "authenticated";

grant trigger on table "public"."endurance_settings" to "authenticated";

grant truncate on table "public"."endurance_settings" to "authenticated";

grant update on table "public"."endurance_settings" to "authenticated";

grant delete on table "public"."endurance_settings" to "postgres";

grant insert on table "public"."endurance_settings" to "postgres";

grant references on table "public"."endurance_settings" to "postgres";

grant select on table "public"."endurance_settings" to "postgres";

grant trigger on table "public"."endurance_settings" to "postgres";

grant truncate on table "public"."endurance_settings" to "postgres";

grant update on table "public"."endurance_settings" to "postgres";

grant delete on table "public"."endurance_settings" to "service_role";

grant insert on table "public"."endurance_settings" to "service_role";

grant references on table "public"."endurance_settings" to "service_role";

grant select on table "public"."endurance_settings" to "service_role";

grant trigger on table "public"."endurance_settings" to "service_role";

grant truncate on table "public"."endurance_settings" to "service_role";

grant update on table "public"."endurance_settings" to "service_role";

grant delete on table "public"."projects" to "anon";

grant insert on table "public"."projects" to "anon";

grant references on table "public"."projects" to "anon";

grant select on table "public"."projects" to "anon";

grant trigger on table "public"."projects" to "anon";

grant truncate on table "public"."projects" to "anon";

grant update on table "public"."projects" to "anon";

grant delete on table "public"."projects" to "authenticated";

grant insert on table "public"."projects" to "authenticated";

grant references on table "public"."projects" to "authenticated";

grant select on table "public"."projects" to "authenticated";

grant trigger on table "public"."projects" to "authenticated";

grant truncate on table "public"."projects" to "authenticated";

grant update on table "public"."projects" to "authenticated";

grant delete on table "public"."projects" to "postgres";

grant insert on table "public"."projects" to "postgres";

grant references on table "public"."projects" to "postgres";

grant select on table "public"."projects" to "postgres";

grant trigger on table "public"."projects" to "postgres";

grant truncate on table "public"."projects" to "postgres";

grant update on table "public"."projects" to "postgres";

grant delete on table "public"."projects" to "service_role";

grant insert on table "public"."projects" to "service_role";

grant references on table "public"."projects" to "service_role";

grant select on table "public"."projects" to "service_role";

grant trigger on table "public"."projects" to "service_role";

grant truncate on table "public"."projects" to "service_role";

grant update on table "public"."projects" to "service_role";

drop trigger if exists "protect_buckets_delete" on "storage"."buckets";

drop trigger if exists "protect_objects_delete" on "storage"."objects";

