set check_function_bodies = off;

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
    
    -------------------------------------------------------------------
    -- 4. endurance_units.label 内の gift_id (旧ID -> 新ID) 再マップ
    -------------------------------------------------------------------
    IF v_gift_id_map <> '{}'::jsonb THEN
        UPDATE endurance_units AS eu
        SET label = v_gift_id_map ->> eu.label
        WHERE v_gift_id_map ? eu.label;
    END IF;

END;
$function$
;


