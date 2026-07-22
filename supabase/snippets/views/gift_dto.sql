CREATE OR REPLACE VIEW gifts_dto AS
SELECT 
    g.id,
    g.name,
    g.nick_name,
    g.point,
    -- NULL の場合は空の配列 `[]` になるように COALESCE と ARRAY_REMOVE を組み合わせる
    COALESCE(array_remove(array_agg(gcm.category_id), NULL), '{}') AS category_ids
FROM gifts g
LEFT JOIN gift_category_mappings gcm ON g.id = gcm.gift_id
GROUP BY g.id;
