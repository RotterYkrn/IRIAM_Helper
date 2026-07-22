drop function if exists update_gift cascade;

CREATE OR REPLACE FUNCTION update_gift (
    p_gift_id uuid,
    p_name text,
    p_point integer,
    p_category_ids integer[],
    p_nick_name text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
    v_category_id integer;
BEGIN
    -- 1. ギフト本体の更新
    UPDATE gifts
    SET 
        name = p_name,
        nick_name = p_nick_name,
        point = p_point,
        updated_at = NOW()
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
$$;