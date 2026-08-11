DROP VIEW IF EXISTS gift_category_endurance_project_dto cascade;

drop type if exists dto_gift_category_endurance_unit;
-- 1. unit 用の型定義
CREATE TYPE dto_gift_category_endurance_unit AS (
    id UUID,
    position integer,
    gift_id text,
    target_count INT,
    current_count INT
);

CREATE VIEW gift_category_endurance_project_dto
WITH (security_invoker = true)
AS
SELECT 
    p.id,
    p.type,
    p.title,
    p.status,

    COALESCE(
        (
            SELECT array_agg(ROW(u.id, u.position, u.label, u.target_count, u.current_count)::dto_gift_category_endurance_unit ORDER BY u.position ASC)
            FROM endurance_units u
            WHERE u.project_id = p.id
        ),
        '{}'::dto_gift_category_endurance_unit[]
    ) AS units

FROM projects p
WHERE p.type = 'gift-category-endurance';
