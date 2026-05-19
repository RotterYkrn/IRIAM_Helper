set check_function_bodies = off;

DROP FUNCTION IF EXISTS public.delete_project(p_project_id uuid);

DROP FUNCTION IF EXISTS public.create_endurance_project_new(text, numeric, public.create_endurance_action_args[], public.create_endurance_action_args[]);

DROP FUNCTION IF EXISTS public.create_multi_endurance_project(p_title text, p_units public.create_unit_args[]);

DROP FUNCTION IF EXISTS public.duplicate_endurance_project(p_project_id uuid);

DROP FUNCTION IF EXISTS public.duplicate_multi_endurance_project(p_project_id uuid);

DROP FUNCTION IF EXISTS public.update_endurance_project_new(p_project_id uuid, p_unit_id uuid, p_title text, p_target_count numeric, p_rescue_actions public.update_endurance_action_args[], p_sabotage_actions public.update_endurance_action_args[]);

DROP FUNCTION IF EXISTS public.update_multi_endurance_project(p_project_id uuid, p_title text, p_units public.update_unit_args[]);

create type "public"."dto_endurance_action" as ("id" uuid, "type" text, "position" integer, "label" text, "amount" integer, "count" integer);

create type "public"."dto_endurance_action_count" as ("normal_count" integer, "rescue_count" integer, "sabotage_count" integer);

create type "public"."dto_endurance_unit" as ("id" uuid, "target_count" integer, "current_count" integer);

create type "public"."dto_multi_endurance_unit" as ("id" uuid, "position" integer, "label" text, "target_count" integer, "current_count" integer);

create or replace view "public"."endurance_project_dto" as  SELECT p.id,
    p.type,
    p.title,
    p.status,
    ROW(eu.id, (eu.target_count)::integer, (eu.current_count)::integer)::public.dto_endurance_unit AS unit,
    ROW((eac.normal_count)::integer, (eac.rescue_count)::integer, (eac.sabotage_count)::integer)::public.dto_endurance_action_count AS action_count,
    COALESCE(( SELECT array_agg(ROW(a.id, a.type, a."position", a.label, (a.amount)::integer, a.count)::public.dto_endurance_action ORDER BY a."position") AS array_agg
           FROM public.endurance_actions_new a
          WHERE ((a.project_id = p.id) AND (a.type = 'rescue'::text))), '{}'::public.dto_endurance_action[]) AS rescue_actions,
    COALESCE(( SELECT array_agg(ROW(a.id, a.type, a."position", a.label, (a.amount)::integer, a.count)::public.dto_endurance_action ORDER BY a."position") AS array_agg
           FROM public.endurance_actions_new a
          WHERE ((a.project_id = p.id) AND (a.type = 'sabotage'::text))), '{}'::public.dto_endurance_action[]) AS sabotage_actions
   FROM ((public.projects p
     LEFT JOIN public.endurance_units eu ON ((eu.project_id = p.id)))
     LEFT JOIN public.endurance_action_counts eac ON ((eac.project_id = p.id)))
  WHERE (p.type = 'endurance'::text);


create or replace view "public"."multi_endurance_project_dto" as  SELECT p.id,
    p.type,
    p.title,
    p.status,
    COALESCE(( SELECT array_agg(ROW(u.id, u."position", u.label, (u.target_count)::integer, (u.current_count)::integer)::public.dto_multi_endurance_unit ORDER BY u."position") AS array_agg
           FROM public.endurance_units u
          WHERE (u.project_id = p.id)), '{}'::public.dto_multi_endurance_unit[]) AS units
   FROM (public.projects p
     LEFT JOIN public.endurance_units eu ON ((eu.project_id = p.id)))
  WHERE (p.type = 'multi-endurance'::text);


CREATE OR REPLACE FUNCTION public.create_endurance_project_new(p_title text, p_target_count numeric, p_rescue_actions public.create_endurance_action_args[], p_sabotage_actions public.create_endurance_action_args[])
 RETURNS public.endurance_project_dto
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare
    v_project_id uuid;
    v_unit_id uuid;
    v_action create_endurance_action_args;
    v_result_row endurance_project_dto;
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

    insert into endurance_actions_new (project_id, unit_id, type, position, label, amount)
    select v_project_id, v_unit_id, 'rescue', unnest.position, unnest.label, unnest.amount
    from unnest(p_rescue_actions) as unnest;

    insert into endurance_actions_new (project_id, unit_id, type, position, label, amount)
    select v_project_id, v_unit_id, 'sabotage', unnest.position, unnest.label, unnest.amount
    from unnest(p_sabotage_actions) as unnest;
    
    SELECT * INTO v_result_row 
    FROM endurance_project_dto 
    WHERE id = v_project_id 
    LIMIT 1;

    RETURN v_result_row;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.create_multi_endurance_project(p_title text, p_units public.create_unit_args[])
 RETURNS public.multi_endurance_project_dto
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare
    v_project_id uuid;
    v_unit create_unit_args;
    v_result_row multi_endurance_project_dto;
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

    SELECT * INTO v_result_row 
    FROM multi_endurance_project_dto 
    WHERE id = v_project_id 
    LIMIT 1;

    return v_result_row;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.delete_project(p_project_id uuid)
 RETURNS uuid
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

    -- scheduled, finished のみ削除可
    if v_status = 'active' then
        raise exception 'only scheduled projects can be deleted';
    end if;

    -- 削除（CASCADE で子も消える）
    delete from projects
    where id = p_project_id;

    return p_project_id;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.duplicate_endurance_project(p_project_id uuid)
 RETURNS public.endurance_project_dto
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare
    v_new_project_id uuid;
    v_new_unit_id uuid;
    v_result_row endurance_project_dto;
begin
    -- ① project複製
    insert into projects (title, type, status)
    select
        title || '（コピー）',
        type,
        'scheduled'
    from projects
    where id = p_project_id
    returning id into v_new_project_id;

    -- ② endurance_units複製
    insert into endurance_units (
        project_id,
        label,
        target_count
    )
    select
        v_new_project_id,
        label,
        target_count
    from endurance_units
    where project_id = p_project_id
    returning id into v_new_unit_id;

    -- endurance_action_counts作成
    insert into endurance_action_counts (
        project_id,
        unit_id
    )
    values (
        v_new_project_id,
        v_new_unit_id
    );

    -- ③ endurance_actions複製
    insert into endurance_actions_new (
        project_id,
        unit_id,
        type,
        position,
        label,
        amount
    )
    select
        v_new_project_id,
        v_new_unit_id,
        type,
        position,
        label,
        amount
    from endurance_actions_new
    where project_id = p_project_id;

    SELECT * INTO v_result_row 
    FROM endurance_project_dto 
    WHERE id = v_new_project_id 
    LIMIT 1;

    return v_result_row;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.duplicate_multi_endurance_project(p_project_id uuid)
 RETURNS public.multi_endurance_project_dto
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare
    v_new_project_id uuid;
    v_result_row multi_endurance_project_dto;
begin
    -- ① project複製
    insert into projects (title, type, status)
    select
        title || '（コピー）',
        type,
        'scheduled'
    from projects
    where id = p_project_id
    returning id into v_new_project_id;

    -- ② endurance_units複製
    insert into endurance_units (
        project_id,
        label,
        target_count
    )
    select
        v_new_project_id,
        label,
        target_count
    from endurance_units
    where project_id = p_project_id;

    SELECT * INTO v_result_row 
    FROM multi_endurance_project_dto 
    WHERE id = v_new_project_id 
    LIMIT 1;

    return v_result_row;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.update_endurance_project_new(p_project_id uuid, p_unit_id uuid, p_title text, p_target_count numeric, p_rescue_actions public.update_endurance_action_args[], p_sabotage_actions public.update_endurance_action_args[])
 RETURNS public.endurance_project_dto
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare
    v_action update_endurance_action_args;
    v_result_row endurance_project_dto;
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

    SELECT * INTO v_result_row 
    FROM endurance_project_dto 
    WHERE id = p_project_id 
    LIMIT 1;

    RETURN v_result_row;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.update_multi_endurance_project(p_project_id uuid, p_title text, p_units public.update_unit_args[])
 RETURNS public.multi_endurance_project_dto
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare
    v_unit update_unit_args;
    v_result_row multi_endurance_project_dto;
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

    SELECT * INTO v_result_row 
    FROM multi_endurance_project_dto 
    WHERE id = p_project_id 
    LIMIT 1;

    RETURN v_result_row;
end;
$function$
;


