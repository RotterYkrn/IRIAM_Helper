alter table "public"."projects" drop constraint "projects_type_check";

drop function if exists "public"."increment_endurance_count"(p_project_id uuid, p_increment integer);

drop function if exists "public"."log_endurance_action_history"(p_project_id uuid, p_action_history_type text, p_action_id uuid);

drop view if exists "public"."endurance_action_stats_view";

alter table "public"."endurance_action_histories" add column "is_reversal" boolean not null default false;

alter table "public"."projects" add constraint "projects_type_check" CHECK ((type = ANY (ARRAY['endurance'::text, 'multi_endurance'::text, 'gacha'::text, 'panel_open'::text]))) not valid;

alter table "public"."projects" validate constraint "projects_type_check";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.log_endurance_action_history(p_project_id uuid, p_action_history_type text, p_is_reversal boolean, p_action_id uuid DEFAULT NULL::uuid)
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
        is_reversal,
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
        p_is_reversal,
        now()
    );

    if p_is_reversal = true then
        v_amount = -v_amount;
    end if;

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

CREATE OR REPLACE FUNCTION public.duplicate_project(p_project_id uuid)
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare
    v_new_project_id uuid;
begin
    -- ① project複製
    insert into projects (id, title, type, status, created_at, updated_at)
    select
        gen_random_uuid(),
        title || '（コピー）',
        type,
        'scheduled',
        now(),
        now()
    from projects
    where id = p_project_id
    returning id into v_new_project_id;

    -- ② endurance_settings複製
    insert into endurance_settings (
        id,
        project_id,
        target_count,
        created_at,
        updated_at
    )
    select
        gen_random_uuid(),
        v_new_project_id,
        target_count,
        now(),
        now()
    from endurance_settings
    where project_id = p_project_id;

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
        v_new_project_id,
        0,
        0, 0, 0,
        now(),
        now()
    );

    -- ③ endurance_actions複製
    insert into endurance_actions (
        id,
        project_id,
        type,
        label,
        amount,
        position,
        created_at,
        updated_at
    )
    select
        gen_random_uuid(),
        v_new_project_id,
        type,
        label,
        amount,
        position,
        now(),
        now()
    from endurance_actions
    where project_id = p_project_id;

    return v_new_project_id;
end;
$function$
;

create or replace view "public"."endurance_action_stats_view" as  SELECT p.id AS project_id,
    COALESCE(array_agg(ROW(a.id, a.type, a."position", a.label, a.amount, (( SELECT COALESCE(sum(
                CASE
                    WHEN (h.is_reversal = true) THEN '-1'::integer
                    ELSE 1
                END), (0)::bigint) AS "coalesce"
           FROM public.endurance_action_histories h
          WHERE (h.action_id = a.id)))::integer)::public.endurance_action_stat ORDER BY a."position") FILTER (WHERE (a.type = 'rescue'::text)), '{}'::public.endurance_action_stat[]) AS rescue_actions,
    COALESCE(array_agg(ROW(a.id, a.type, a."position", a.label, a.amount, (( SELECT COALESCE(sum(
                CASE
                    WHEN (h.is_reversal = true) THEN '-1'::integer
                    ELSE 1
                END), (0)::bigint) AS "coalesce"
           FROM public.endurance_action_histories h
          WHERE (h.action_id = a.id)))::integer)::public.endurance_action_stat ORDER BY a."position") FILTER (WHERE (a.type = 'sabotage'::text)), '{}'::public.endurance_action_stat[]) AS sabotage_actions
   FROM (public.projects p
     LEFT JOIN public.endurance_actions a ON ((a.project_id = p.id)))
  GROUP BY p.id;


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

grant delete on table "public"."endurance_action_histories" to "postgres";

grant insert on table "public"."endurance_action_histories" to "postgres";

grant references on table "public"."endurance_action_histories" to "postgres";

grant select on table "public"."endurance_action_histories" to "postgres";

grant trigger on table "public"."endurance_action_histories" to "postgres";

grant truncate on table "public"."endurance_action_histories" to "postgres";

grant update on table "public"."endurance_action_histories" to "postgres";

grant delete on table "public"."endurance_actions" to "postgres";

grant insert on table "public"."endurance_actions" to "postgres";

grant references on table "public"."endurance_actions" to "postgres";

grant select on table "public"."endurance_actions" to "postgres";

grant trigger on table "public"."endurance_actions" to "postgres";

grant truncate on table "public"."endurance_actions" to "postgres";

grant update on table "public"."endurance_actions" to "postgres";

grant delete on table "public"."endurance_progress" to "postgres";

grant insert on table "public"."endurance_progress" to "postgres";

grant references on table "public"."endurance_progress" to "postgres";

grant select on table "public"."endurance_progress" to "postgres";

grant trigger on table "public"."endurance_progress" to "postgres";

grant truncate on table "public"."endurance_progress" to "postgres";

grant update on table "public"."endurance_progress" to "postgres";

grant delete on table "public"."endurance_settings" to "postgres";

grant insert on table "public"."endurance_settings" to "postgres";

grant references on table "public"."endurance_settings" to "postgres";

grant select on table "public"."endurance_settings" to "postgres";

grant trigger on table "public"."endurance_settings" to "postgres";

grant truncate on table "public"."endurance_settings" to "postgres";

grant update on table "public"."endurance_settings" to "postgres";

grant delete on table "public"."projects" to "postgres";

grant insert on table "public"."projects" to "postgres";

grant references on table "public"."projects" to "postgres";

grant select on table "public"."projects" to "postgres";

grant trigger on table "public"."projects" to "postgres";

grant truncate on table "public"."projects" to "postgres";

grant update on table "public"."projects" to "postgres";

CREATE TRIGGER protect_buckets_delete BEFORE DELETE ON storage.buckets FOR EACH STATEMENT EXECUTE FUNCTION storage.protect_delete();

CREATE TRIGGER protect_objects_delete BEFORE DELETE ON storage.objects FOR EACH STATEMENT EXECUTE FUNCTION storage.protect_delete();


