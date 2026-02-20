drop view if exists "public"."endurance_action_stats_view";


  create table "public"."endurance_action_counts" (
    "id" uuid not null default gen_random_uuid(),
    "project_id" uuid not null,
    "unit_id" uuid not null,
    "normal_count" integer not null default 0,
    "rescue_count" integer not null default 0,
    "sabotage_count" integer not null default 0,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );



  create table "public"."endurance_action_histories_new" (
    "id" uuid not null default gen_random_uuid(),
    "project_id" uuid not null,
    "unit_id" uuid not null,
    "action_id" uuid,
    "action_type" text not null,
    "action_amount" integer not null,
    "action_count" integer not null,
    "created_at" timestamp with time zone not null default now()
      );



  create table "public"."endurance_actions_new" (
    "id" uuid not null default gen_random_uuid(),
    "project_id" uuid not null,
    "unit_id" uuid not null,
    "type" text not null,
    "position" integer not null,
    "label" text not null,
    "amount" integer not null,
    "count" integer not null default 0,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );



  create table "public"."endurance_units" (
    "id" uuid not null default gen_random_uuid(),
    "project_id" uuid not null,
    "label" text not null,
    "target_count" integer not null,
    "current_count" integer not null default 0,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


CREATE UNIQUE INDEX endurance_action_counts_pkey ON public.endurance_action_counts USING btree (id);

CREATE UNIQUE INDEX endurance_action_histories_new_pkey ON public.endurance_action_histories_new USING btree (id);

CREATE UNIQUE INDEX endurance_actions_new_pkey ON public.endurance_actions_new USING btree (id);

CREATE UNIQUE INDEX endurance_units_pkey ON public.endurance_units USING btree (id);

CREATE INDEX idx_endurance_action_count_unit ON public.endurance_action_counts USING btree (unit_id);

CREATE INDEX idx_endurance_histories_actions_new ON public.endurance_action_histories_new USING btree (action_id);

CREATE INDEX idx_endurance_histories_project ON public.endurance_action_histories_new USING btree (project_id);

CREATE INDEX idx_endurance_histories_unit ON public.endurance_action_histories_new USING btree (unit_id);

CREATE INDEX idx_endurance_unit_project ON public.endurance_units USING btree (project_id);

CREATE INDEX idx_endurance_unit_type_position ON public.endurance_actions_new USING btree (unit_id, type, "position");

CREATE UNIQUE INDEX unique_action_per_unit_type_position ON public.endurance_actions_new USING btree (unit_id, type, "position");

CREATE UNIQUE INDEX unique_endurance_action_count_unit ON public.endurance_action_counts USING btree (unit_id);

alter table "public"."endurance_action_counts" add constraint "endurance_action_counts_pkey" PRIMARY KEY using index "endurance_action_counts_pkey";

alter table "public"."endurance_action_histories_new" add constraint "endurance_action_histories_new_pkey" PRIMARY KEY using index "endurance_action_histories_new_pkey";

alter table "public"."endurance_actions_new" add constraint "endurance_actions_new_pkey" PRIMARY KEY using index "endurance_actions_new_pkey";

alter table "public"."endurance_units" add constraint "endurance_units_pkey" PRIMARY KEY using index "endurance_units_pkey";

alter table "public"."endurance_action_counts" add constraint "endurance_action_counts_normal_count_check" CHECK ((normal_count >= 0)) not valid;

alter table "public"."endurance_action_counts" validate constraint "endurance_action_counts_normal_count_check";

alter table "public"."endurance_action_counts" add constraint "endurance_action_counts_rescue_count_check" CHECK ((rescue_count >= 0)) not valid;

alter table "public"."endurance_action_counts" validate constraint "endurance_action_counts_rescue_count_check";

alter table "public"."endurance_action_counts" add constraint "endurance_action_counts_sabotage_count_check" CHECK ((sabotage_count >= 0)) not valid;

alter table "public"."endurance_action_counts" validate constraint "endurance_action_counts_sabotage_count_check";

alter table "public"."endurance_action_counts" add constraint "fk_endurance_action_counts_project" FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE not valid;

alter table "public"."endurance_action_counts" validate constraint "fk_endurance_action_counts_project";

alter table "public"."endurance_action_counts" add constraint "fk_endurance_action_counts_unit" FOREIGN KEY (unit_id) REFERENCES public.endurance_units(id) ON DELETE CASCADE not valid;

alter table "public"."endurance_action_counts" validate constraint "fk_endurance_action_counts_unit";

alter table "public"."endurance_action_counts" add constraint "unique_endurance_action_count_unit" UNIQUE using index "unique_endurance_action_count_unit";

alter table "public"."endurance_action_histories_new" add constraint "endurance_action_histories_new_action_amount_check" CHECK ((action_amount > 0)) not valid;

alter table "public"."endurance_action_histories_new" validate constraint "endurance_action_histories_new_action_amount_check";

alter table "public"."endurance_action_histories_new" add constraint "endurance_action_histories_new_action_type_check" CHECK ((action_type = ANY (ARRAY['normal'::text, 'rescue'::text, 'sabotage'::text]))) not valid;

alter table "public"."endurance_action_histories_new" validate constraint "endurance_action_histories_new_action_type_check";

alter table "public"."endurance_action_histories_new" add constraint "fk_endurance_histories_actions" FOREIGN KEY (action_id) REFERENCES public.endurance_actions_new(id) ON DELETE SET NULL not valid;

alter table "public"."endurance_action_histories_new" validate constraint "fk_endurance_histories_actions";

alter table "public"."endurance_action_histories_new" add constraint "fk_endurance_histories_project" FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE not valid;

alter table "public"."endurance_action_histories_new" validate constraint "fk_endurance_histories_project";

alter table "public"."endurance_action_histories_new" add constraint "fk_endurance_histories_unit" FOREIGN KEY (unit_id) REFERENCES public.endurance_units(id) ON DELETE CASCADE not valid;

alter table "public"."endurance_action_histories_new" validate constraint "fk_endurance_histories_unit";

alter table "public"."endurance_actions_new" add constraint "endurance_actions_new_amount_check" CHECK ((amount > 0)) not valid;

alter table "public"."endurance_actions_new" validate constraint "endurance_actions_new_amount_check";

alter table "public"."endurance_actions_new" add constraint "endurance_actions_new_count_check" CHECK ((count >= 0)) not valid;

alter table "public"."endurance_actions_new" validate constraint "endurance_actions_new_count_check";

alter table "public"."endurance_actions_new" add constraint "endurance_actions_new_label_check" CHECK ((length(TRIM(BOTH FROM label)) > 0)) not valid;

alter table "public"."endurance_actions_new" validate constraint "endurance_actions_new_label_check";

alter table "public"."endurance_actions_new" add constraint "endurance_actions_new_position_check" CHECK (("position" >= 0)) not valid;

alter table "public"."endurance_actions_new" validate constraint "endurance_actions_new_position_check";

alter table "public"."endurance_actions_new" add constraint "endurance_actions_new_type_check" CHECK ((type = ANY (ARRAY['rescue'::text, 'sabotage'::text]))) not valid;

alter table "public"."endurance_actions_new" validate constraint "endurance_actions_new_type_check";

alter table "public"."endurance_actions_new" add constraint "fk_action_project" FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE not valid;

alter table "public"."endurance_actions_new" validate constraint "fk_action_project";

alter table "public"."endurance_actions_new" add constraint "fk_action_unit" FOREIGN KEY (unit_id) REFERENCES public.endurance_units(id) ON DELETE CASCADE not valid;

alter table "public"."endurance_actions_new" validate constraint "fk_action_unit";

alter table "public"."endurance_actions_new" add constraint "unique_action_per_unit_type_position" UNIQUE using index "unique_action_per_unit_type_position";

alter table "public"."endurance_units" add constraint "endurance_units_label_check" CHECK ((length(TRIM(BOTH FROM label)) > 0)) not valid;

alter table "public"."endurance_units" validate constraint "endurance_units_label_check";

alter table "public"."endurance_units" add constraint "endurance_units_target_count_check" CHECK ((target_count > 0)) not valid;

alter table "public"."endurance_units" validate constraint "endurance_units_target_count_check";

alter table "public"."endurance_units" add constraint "fk_endurance_unit_project" FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE not valid;

alter table "public"."endurance_units" validate constraint "fk_endurance_unit_project";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_endurance_project_new(p_title text, p_target_count integer, p_rescue_actions public.create_endurance_action_args[], p_sabotage_actions public.create_endurance_action_args[])
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

create type "public"."endurance_action_stat_new" as ("id" uuid, "type" text, "position" integer, "label" text, "amount" integer, "count" integer);

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


CREATE OR REPLACE FUNCTION public.log_endurance_action_history_new(p_project_id uuid, p_unit_id uuid, p_action_history_type text, p_action_count integer, p_action_id uuid DEFAULT NULL::uuid)
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

CREATE OR REPLACE FUNCTION public.update_endurance_project_new(p_project_id uuid, p_unit_id uuid, p_title text, p_target_count integer, p_rescue_actions public.update_endurance_action_args[], p_sabotage_actions public.update_endurance_action_args[])
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

grant delete on table "public"."endurance_action_counts" to "anon";

grant insert on table "public"."endurance_action_counts" to "anon";

grant references on table "public"."endurance_action_counts" to "anon";

grant select on table "public"."endurance_action_counts" to "anon";

grant trigger on table "public"."endurance_action_counts" to "anon";

grant truncate on table "public"."endurance_action_counts" to "anon";

grant update on table "public"."endurance_action_counts" to "anon";

grant delete on table "public"."endurance_action_counts" to "authenticated";

grant insert on table "public"."endurance_action_counts" to "authenticated";

grant references on table "public"."endurance_action_counts" to "authenticated";

grant select on table "public"."endurance_action_counts" to "authenticated";

grant trigger on table "public"."endurance_action_counts" to "authenticated";

grant truncate on table "public"."endurance_action_counts" to "authenticated";

grant update on table "public"."endurance_action_counts" to "authenticated";

grant delete on table "public"."endurance_action_counts" to "postgres";

grant insert on table "public"."endurance_action_counts" to "postgres";

grant references on table "public"."endurance_action_counts" to "postgres";

grant select on table "public"."endurance_action_counts" to "postgres";

grant trigger on table "public"."endurance_action_counts" to "postgres";

grant truncate on table "public"."endurance_action_counts" to "postgres";

grant update on table "public"."endurance_action_counts" to "postgres";

grant delete on table "public"."endurance_action_counts" to "service_role";

grant insert on table "public"."endurance_action_counts" to "service_role";

grant references on table "public"."endurance_action_counts" to "service_role";

grant select on table "public"."endurance_action_counts" to "service_role";

grant trigger on table "public"."endurance_action_counts" to "service_role";

grant truncate on table "public"."endurance_action_counts" to "service_role";

grant update on table "public"."endurance_action_counts" to "service_role";

grant delete on table "public"."endurance_action_histories" to "postgres";

grant insert on table "public"."endurance_action_histories" to "postgres";

grant references on table "public"."endurance_action_histories" to "postgres";

grant select on table "public"."endurance_action_histories" to "postgres";

grant trigger on table "public"."endurance_action_histories" to "postgres";

grant truncate on table "public"."endurance_action_histories" to "postgres";

grant update on table "public"."endurance_action_histories" to "postgres";

grant delete on table "public"."endurance_action_histories_new" to "anon";

grant insert on table "public"."endurance_action_histories_new" to "anon";

grant references on table "public"."endurance_action_histories_new" to "anon";

grant select on table "public"."endurance_action_histories_new" to "anon";

grant trigger on table "public"."endurance_action_histories_new" to "anon";

grant truncate on table "public"."endurance_action_histories_new" to "anon";

grant update on table "public"."endurance_action_histories_new" to "anon";

grant delete on table "public"."endurance_action_histories_new" to "authenticated";

grant insert on table "public"."endurance_action_histories_new" to "authenticated";

grant references on table "public"."endurance_action_histories_new" to "authenticated";

grant select on table "public"."endurance_action_histories_new" to "authenticated";

grant trigger on table "public"."endurance_action_histories_new" to "authenticated";

grant truncate on table "public"."endurance_action_histories_new" to "authenticated";

grant update on table "public"."endurance_action_histories_new" to "authenticated";

grant delete on table "public"."endurance_action_histories_new" to "postgres";

grant insert on table "public"."endurance_action_histories_new" to "postgres";

grant references on table "public"."endurance_action_histories_new" to "postgres";

grant select on table "public"."endurance_action_histories_new" to "postgres";

grant trigger on table "public"."endurance_action_histories_new" to "postgres";

grant truncate on table "public"."endurance_action_histories_new" to "postgres";

grant update on table "public"."endurance_action_histories_new" to "postgres";

grant delete on table "public"."endurance_action_histories_new" to "service_role";

grant insert on table "public"."endurance_action_histories_new" to "service_role";

grant references on table "public"."endurance_action_histories_new" to "service_role";

grant select on table "public"."endurance_action_histories_new" to "service_role";

grant trigger on table "public"."endurance_action_histories_new" to "service_role";

grant truncate on table "public"."endurance_action_histories_new" to "service_role";

grant update on table "public"."endurance_action_histories_new" to "service_role";

grant delete on table "public"."endurance_actions" to "postgres";

grant insert on table "public"."endurance_actions" to "postgres";

grant references on table "public"."endurance_actions" to "postgres";

grant select on table "public"."endurance_actions" to "postgres";

grant trigger on table "public"."endurance_actions" to "postgres";

grant truncate on table "public"."endurance_actions" to "postgres";

grant update on table "public"."endurance_actions" to "postgres";

grant delete on table "public"."endurance_actions_new" to "anon";

grant insert on table "public"."endurance_actions_new" to "anon";

grant references on table "public"."endurance_actions_new" to "anon";

grant select on table "public"."endurance_actions_new" to "anon";

grant trigger on table "public"."endurance_actions_new" to "anon";

grant truncate on table "public"."endurance_actions_new" to "anon";

grant update on table "public"."endurance_actions_new" to "anon";

grant delete on table "public"."endurance_actions_new" to "authenticated";

grant insert on table "public"."endurance_actions_new" to "authenticated";

grant references on table "public"."endurance_actions_new" to "authenticated";

grant select on table "public"."endurance_actions_new" to "authenticated";

grant trigger on table "public"."endurance_actions_new" to "authenticated";

grant truncate on table "public"."endurance_actions_new" to "authenticated";

grant update on table "public"."endurance_actions_new" to "authenticated";

grant delete on table "public"."endurance_actions_new" to "postgres";

grant insert on table "public"."endurance_actions_new" to "postgres";

grant references on table "public"."endurance_actions_new" to "postgres";

grant select on table "public"."endurance_actions_new" to "postgres";

grant trigger on table "public"."endurance_actions_new" to "postgres";

grant truncate on table "public"."endurance_actions_new" to "postgres";

grant update on table "public"."endurance_actions_new" to "postgres";

grant delete on table "public"."endurance_actions_new" to "service_role";

grant insert on table "public"."endurance_actions_new" to "service_role";

grant references on table "public"."endurance_actions_new" to "service_role";

grant select on table "public"."endurance_actions_new" to "service_role";

grant trigger on table "public"."endurance_actions_new" to "service_role";

grant truncate on table "public"."endurance_actions_new" to "service_role";

grant update on table "public"."endurance_actions_new" to "service_role";

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

grant delete on table "public"."endurance_units" to "anon";

grant insert on table "public"."endurance_units" to "anon";

grant references on table "public"."endurance_units" to "anon";

grant select on table "public"."endurance_units" to "anon";

grant trigger on table "public"."endurance_units" to "anon";

grant truncate on table "public"."endurance_units" to "anon";

grant update on table "public"."endurance_units" to "anon";

grant delete on table "public"."endurance_units" to "authenticated";

grant insert on table "public"."endurance_units" to "authenticated";

grant references on table "public"."endurance_units" to "authenticated";

grant select on table "public"."endurance_units" to "authenticated";

grant trigger on table "public"."endurance_units" to "authenticated";

grant truncate on table "public"."endurance_units" to "authenticated";

grant update on table "public"."endurance_units" to "authenticated";

grant delete on table "public"."endurance_units" to "postgres";

grant insert on table "public"."endurance_units" to "postgres";

grant references on table "public"."endurance_units" to "postgres";

grant select on table "public"."endurance_units" to "postgres";

grant trigger on table "public"."endurance_units" to "postgres";

grant truncate on table "public"."endurance_units" to "postgres";

grant update on table "public"."endurance_units" to "postgres";

grant delete on table "public"."endurance_units" to "service_role";

grant insert on table "public"."endurance_units" to "service_role";

grant references on table "public"."endurance_units" to "service_role";

grant select on table "public"."endurance_units" to "service_role";

grant trigger on table "public"."endurance_units" to "service_role";

grant truncate on table "public"."endurance_units" to "service_role";

grant update on table "public"."endurance_units" to "service_role";

grant delete on table "public"."projects" to "postgres";

grant insert on table "public"."projects" to "postgres";

grant references on table "public"."projects" to "postgres";

grant select on table "public"."projects" to "postgres";

grant trigger on table "public"."projects" to "postgres";

grant truncate on table "public"."projects" to "postgres";

grant update on table "public"."projects" to "postgres";


