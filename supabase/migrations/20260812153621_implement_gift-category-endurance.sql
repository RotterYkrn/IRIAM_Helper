alter table "public"."projects" drop constraint "projects_type_check";


  create table "public"."gift_categories" (
    "id" integer generated always as identity not null,
    "name" text not null
      );



  create table "public"."gift_category_mappings" (
    "gift_id" uuid not null,
    "category_id" integer not null
      );



  create table "public"."gifts" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "nick_name" text,
    "point" integer not null
      );


CREATE UNIQUE INDEX gift_categories_name_key ON public.gift_categories USING btree (name);

CREATE UNIQUE INDEX gift_categories_pkey ON public.gift_categories USING btree (id);

CREATE UNIQUE INDEX gift_category_mappings_pkey ON public.gift_category_mappings USING btree (gift_id, category_id);

CREATE UNIQUE INDEX gifts_name_key ON public.gifts USING btree (name);

CREATE UNIQUE INDEX gifts_nick_name_key ON public.gifts USING btree (nick_name);

CREATE UNIQUE INDEX gifts_pkey ON public.gifts USING btree (id);

alter table "public"."gift_categories" add constraint "gift_categories_pkey" PRIMARY KEY using index "gift_categories_pkey";

alter table "public"."gift_category_mappings" add constraint "gift_category_mappings_pkey" PRIMARY KEY using index "gift_category_mappings_pkey";

alter table "public"."gifts" add constraint "gifts_pkey" PRIMARY KEY using index "gifts_pkey";

alter table "public"."gift_categories" add constraint "gift_categories_name_check" CHECK ((length(TRIM(BOTH FROM name)) > 0)) not valid;

alter table "public"."gift_categories" validate constraint "gift_categories_name_check";

alter table "public"."gift_categories" add constraint "gift_categories_name_key" UNIQUE using index "gift_categories_name_key";

alter table "public"."gift_category_mappings" add constraint "gift_category_mappings_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public.gift_categories(id) ON DELETE CASCADE not valid;

alter table "public"."gift_category_mappings" validate constraint "gift_category_mappings_category_id_fkey";

alter table "public"."gift_category_mappings" add constraint "gift_category_mappings_gift_id_fkey" FOREIGN KEY (gift_id) REFERENCES public.gifts(id) ON DELETE CASCADE not valid;

alter table "public"."gift_category_mappings" validate constraint "gift_category_mappings_gift_id_fkey";

alter table "public"."gifts" add constraint "gifts_name_check" CHECK ((length(TRIM(BOTH FROM name)) > 0)) not valid;

alter table "public"."gifts" validate constraint "gifts_name_check";

alter table "public"."gifts" add constraint "gifts_name_key" UNIQUE using index "gifts_name_key";

alter table "public"."gifts" add constraint "gifts_nick_name_check" CHECK ((length(TRIM(BOTH FROM nick_name)) > 0)) not valid;

alter table "public"."gifts" validate constraint "gifts_nick_name_check";

alter table "public"."gifts" add constraint "gifts_nick_name_key" UNIQUE using index "gifts_nick_name_key";

alter table "public"."gifts" add constraint "gifts_point_check" CHECK ((point > 0)) not valid;

alter table "public"."gifts" validate constraint "gifts_point_check";

alter table "public"."projects" add constraint "projects_type_check" CHECK ((type = ANY (ARRAY['enter-endurance'::text, 'endurance'::text, 'multi-endurance'::text, 'gift-category-endurance'::text, 'panel_open'::text]))) not valid;

alter table "public"."projects" validate constraint "projects_type_check";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_gift(p_name text, p_point integer, p_category_ids integer[], p_nick_name text DEFAULT NULL::text)
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare
    v_gift_id uuid;
    v_category_id integer;
begin
    
    insert into gifts (
        name,
        nick_name,
        point
    )
    values (
        p_name,
        p_nick_name,
        p_point
    )
    returning id into v_gift_id;

    foreach v_category_id in array p_category_ids
    loop
        IF NOT EXISTS (
            SELECT 1 FROM gift_categories WHERE id = v_category_id
        ) THEN
            RAISE EXCEPTION 'IDが存在しません: %', v_category_id;
        END IF;
        
        insert into gift_category_mappings (
            gift_id,
            category_id
        )
        values (
            v_gift_id,
            v_category_id
        );
    end loop;

    return v_gift_id;
end;
$function$
;

create or replace view "public"."gifts_dto" as  SELECT g.id,
    g.name,
    g.nick_name,
    g.point,
    COALESCE(array_remove(array_agg(gcm.category_id), NULL::integer), '{}'::integer[]) AS category_ids
   FROM (public.gifts g
     LEFT JOIN public.gift_category_mappings gcm ON ((g.id = gcm.gift_id)))
  GROUP BY g.id;

create type "public"."dto_gift_category_endurance_unit" as ("id" uuid, "position" integer, "gift" public.gifts_dto, "target_count" integer, "current_count" integer);

create or replace view "public"."gift_category_endurance_project_dto" as  SELECT id,
    type,
    title,
    status,
    COALESCE(( SELECT array_agg(ROW(u.id, u."position", g.*::public.gifts_dto, (u.target_count)::integer, (u.current_count)::integer)::public.dto_gift_category_endurance_unit ORDER BY u."position") AS array_agg
           FROM (public.endurance_units u
             LEFT JOIN public.gifts_dto g ON (((u.label)::uuid = g.id)))
          WHERE (u.project_id = p.id)), '{}'::public.dto_gift_category_endurance_unit[]) AS units
   FROM public.projects p
  WHERE (type = 'gift-category-endurance'::text);

create type "public"."create_gift_category_unit_args" as ("position" integer, "gift_id" text);

CREATE OR REPLACE FUNCTION public.create_gift_category_endurance_project(p_title text, p_target_count integer, p_units public.create_gift_category_unit_args[])
 RETURNS public.gift_category_endurance_project_dto
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare
    v_project_id uuid;
    v_unit create_gift_category_unit_args;
    v_result_row gift_category_endurance_project_dto;
begin
    -- projects 作成
    insert into projects (
        title,
        type,
        status
    )
    values (
        p_title,
        'gift-category-endurance',
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
            v_unit.gift_id,
            p_target_count
        );
    end loop;

    SELECT * INTO v_result_row 
    FROM gift_category_endurance_project_dto 
    WHERE id = v_project_id 
    LIMIT 1;

    return v_result_row;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.duplicate_gift_category_endurance_project(p_project_id uuid)
 RETURNS public.gift_category_endurance_project_dto
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare
    v_new_project_id uuid;
    v_result_row gift_category_endurance_project_dto;
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
        position,
        label,
        target_count
    )
    select
        v_new_project_id,
        position,
        label,
        target_count
    from endurance_units
    where project_id = p_project_id;

    SELECT * INTO v_result_row 
    FROM gift_category_endurance_project_dto 
    WHERE id = v_new_project_id 
    LIMIT 1;

    return v_result_row;
end;
$function$
;


CREATE OR REPLACE FUNCTION public.import_gift_data(p_categories public.gift_categories[], p_gifts public.gifts[], p_mappings public.gift_category_mappings[])
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
DECLARE
    -- 旧ID -> 新ID の変換用マップ
    v_category_id_map jsonb := '{}'::jsonb;
    v_gift_id_map     jsonb := '{}'::jsonb;
    
    r RECORD;
BEGIN
    -------------------------------------------------------------------
    -- 1. カテゴリの UPSERT & IDマッピング構築
    -------------------------------------------------------------------
    IF p_categories IS NOT NULL AND array_length(p_categories, 1) > 0 THEN
        FOR r IN
            WITH input_categories AS (
                SELECT c.id AS old_id, c.name FROM unnest(p_categories) AS c
            ),
            upserted AS (
                INSERT INTO gift_categories (name)
                SELECT DISTINCT name FROM input_categories
                ON CONFLICT (name) DO UPDATE 
                    SET name = EXCLUDED.name -- 既存があればそのまま利用してIDを取得
                RETURNING id AS new_id, name
            )
            SELECT ic.old_id, u.new_id
            FROM input_categories ic
            JOIN upserted u ON ic.name = u.name
        LOOP
            v_category_id_map := jsonb_set(
                v_category_id_map, 
                ARRAY[r.old_id::text], 
                to_jsonb(r.new_id)
            );
        END LOOP;
    END IF;

    -------------------------------------------------------------------
    -- 2. ギフトの UPSERT & IDマッピング構築
    -------------------------------------------------------------------
    IF p_gifts IS NOT NULL AND array_length(p_gifts, 1) > 0 THEN
        FOR r IN
            WITH input_gifts AS (
                SELECT g.id AS old_id, g.name, g.nick_name, g.point FROM unnest(p_gifts) AS g
            ),
            upserted AS (
                INSERT INTO gifts (name, nick_name, point)
                SELECT name, nick_name, point 
                FROM input_gifts
                ON CONFLICT (name) DO UPDATE 
                    SET nick_name = EXCLUDED.nick_name,
                        point = EXCLUDED.point
                RETURNING id AS new_id, name
            )
            SELECT ig.old_id, u.new_id
            FROM input_gifts ig
            JOIN upserted u ON ig.name = u.name
        LOOP
            v_gift_id_map := jsonb_set(
                v_gift_id_map, 
                ARRAY[r.old_id::text], 
                to_jsonb(r.new_id)
            );
        END LOOP;
    END IF;

    -------------------------------------------------------------------
    -- 3. マッピングテーブルの挿入（変換された新IDを使用）
    -------------------------------------------------------------------
    IF p_mappings IS NOT NULL AND array_length(p_mappings, 1) > 0 THEN
        INSERT INTO gift_category_mappings (gift_id, category_id)
        SELECT 
            (v_gift_id_map ->> m.gift_id::text)::uuid AS gift_id,
            (v_category_id_map ->> m.category_id::text)::integer AS category_id
        FROM unnest(p_mappings) AS m
        WHERE (v_gift_id_map ->> m.gift_id::text) IS NOT NULL
          AND (v_category_id_map ->> m.category_id::text) IS NOT NULL
        ON CONFLICT (gift_id, category_id) DO NOTHING;
    END IF;

END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_gift(p_gift_id uuid, p_name text, p_point integer, p_category_ids integer[], p_nick_name text DEFAULT NULL::text)
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
DECLARE
    v_category_id integer;
BEGIN
    -- 1. ギフト本体の更新
    UPDATE gifts
    SET 
        name = p_name,
        nick_name = p_nick_name,
        point = p_point
    WHERE id = p_gift_id;

    -- 対象のギフトが存在しない場合は例外を発生させる
    IF NOT FOUND THEN
        RAISE EXCEPTION '指定されたID (%) のギフトが存在しません', p_gift_id;
    END IF;

    -- 2. 引数で渡されたカテゴリIDの存在チェック
    IF p_category_ids IS NOT NULL AND array_length(p_category_ids, 1) > 0 THEN
        FOREACH v_category_id IN ARRAY p_category_ids
        LOOP
            IF NOT EXISTS (
                SELECT 1 FROM gift_categories WHERE id = v_category_id
            ) THEN
                RAISE EXCEPTION 'カテゴリIDが存在しません: %', v_category_id;
            END IF;
        END LOOP;
    END IF;

    -- 3. 引数（p_category_ids）に含まれない「古い紐付け」を削除
    DELETE FROM gift_category_mappings
    WHERE gift_id = p_gift_id
      AND category_id NOT IN (SELECT UNNEST(p_category_ids));

    -- 4. 新しく追加されたカテゴリのみインサート（ON CONFLICT で重複を無視）
    IF p_category_ids IS NOT NULL AND array_length(p_category_ids, 1) > 0 THEN
        INSERT INTO gift_category_mappings (gift_id, category_id)
        SELECT p_gift_id, UNNEST(p_category_ids)
        ON CONFLICT (gift_id, category_id) DO NOTHING;
    END IF;

END;
$function$
;

create type "public"."update_gift_category_unit_args" as ("position" integer, "gift_id" text);

CREATE OR REPLACE FUNCTION public.update_gift_category_endurance_project(p_project_id uuid, p_title text, p_target_count integer, p_units public.update_gift_category_unit_args[])
 RETURNS public.gift_category_endurance_project_dto
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare
    v_unit update_gift_category_unit_args;
    v_result_row gift_category_endurance_project_dto;
begin
    -- projects
    update projects
    set title = p_title
    where id = p_project_id;

    -- endurance_units
    delete from endurance_units
    where project_id = p_project_id;
    
    foreach v_unit in array p_units
    loop
        insert into endurance_units (
            project_id,
            position,
            label,
            target_count
        )
        values (
            p_project_id,
            v_unit.position,
            v_unit.gift_id,
            p_target_count
        );
    end loop;

    SELECT * INTO v_result_row 
    FROM gift_category_endurance_project_dto 
    WHERE id = p_project_id 
    LIMIT 1;

    return v_result_row;
end;
$function$
;


grant delete on table "public"."gift_categories" to "anon";

grant insert on table "public"."gift_categories" to "anon";

grant references on table "public"."gift_categories" to "anon";

grant select on table "public"."gift_categories" to "anon";

grant trigger on table "public"."gift_categories" to "anon";

grant truncate on table "public"."gift_categories" to "anon";

grant update on table "public"."gift_categories" to "anon";

grant delete on table "public"."gift_categories" to "authenticated";

grant insert on table "public"."gift_categories" to "authenticated";

grant references on table "public"."gift_categories" to "authenticated";

grant select on table "public"."gift_categories" to "authenticated";

grant trigger on table "public"."gift_categories" to "authenticated";

grant truncate on table "public"."gift_categories" to "authenticated";

grant update on table "public"."gift_categories" to "authenticated";

grant delete on table "public"."gift_categories" to "service_role";

grant insert on table "public"."gift_categories" to "service_role";

grant references on table "public"."gift_categories" to "service_role";

grant select on table "public"."gift_categories" to "service_role";

grant trigger on table "public"."gift_categories" to "service_role";

grant truncate on table "public"."gift_categories" to "service_role";

grant update on table "public"."gift_categories" to "service_role";

grant delete on table "public"."gift_category_mappings" to "anon";

grant insert on table "public"."gift_category_mappings" to "anon";

grant references on table "public"."gift_category_mappings" to "anon";

grant select on table "public"."gift_category_mappings" to "anon";

grant trigger on table "public"."gift_category_mappings" to "anon";

grant truncate on table "public"."gift_category_mappings" to "anon";

grant update on table "public"."gift_category_mappings" to "anon";

grant delete on table "public"."gift_category_mappings" to "authenticated";

grant insert on table "public"."gift_category_mappings" to "authenticated";

grant references on table "public"."gift_category_mappings" to "authenticated";

grant select on table "public"."gift_category_mappings" to "authenticated";

grant trigger on table "public"."gift_category_mappings" to "authenticated";

grant truncate on table "public"."gift_category_mappings" to "authenticated";

grant update on table "public"."gift_category_mappings" to "authenticated";

grant delete on table "public"."gift_category_mappings" to "service_role";

grant insert on table "public"."gift_category_mappings" to "service_role";

grant references on table "public"."gift_category_mappings" to "service_role";

grant select on table "public"."gift_category_mappings" to "service_role";

grant trigger on table "public"."gift_category_mappings" to "service_role";

grant truncate on table "public"."gift_category_mappings" to "service_role";

grant update on table "public"."gift_category_mappings" to "service_role";

grant delete on table "public"."gifts" to "anon";

grant insert on table "public"."gifts" to "anon";

grant references on table "public"."gifts" to "anon";

grant select on table "public"."gifts" to "anon";

grant trigger on table "public"."gifts" to "anon";

grant truncate on table "public"."gifts" to "anon";

grant update on table "public"."gifts" to "anon";

grant delete on table "public"."gifts" to "authenticated";

grant insert on table "public"."gifts" to "authenticated";

grant references on table "public"."gifts" to "authenticated";

grant select on table "public"."gifts" to "authenticated";

grant trigger on table "public"."gifts" to "authenticated";

grant truncate on table "public"."gifts" to "authenticated";

grant update on table "public"."gifts" to "authenticated";

grant delete on table "public"."gifts" to "service_role";

grant insert on table "public"."gifts" to "service_role";

grant references on table "public"."gifts" to "service_role";

grant select on table "public"."gifts" to "service_role";

grant trigger on table "public"."gifts" to "service_role";

grant truncate on table "public"."gifts" to "service_role";

grant update on table "public"."gifts" to "service_role";


