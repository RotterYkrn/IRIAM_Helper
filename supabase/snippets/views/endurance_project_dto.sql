DROP VIEW IF EXISTS endurance_project_dto cascade;

drop type if exists dto_endurance_unit;
-- 1. unit 用の型定義
CREATE TYPE dto_endurance_unit AS (
    id UUID,
    target_count INT,
    current_count INT
);

drop type if exists dto_endurance_action_count;
-- 2. action_count 用の型定義
CREATE TYPE dto_endurance_action_count AS (
    normal_count INT,
    rescue_count INT,
    sabotage_count INT
);

drop type if exists dto_endurance_action;
-- 3. アクション単体用の型定義
CREATE TYPE dto_endurance_action AS (
    id UUID,
    type TEXT,
    position INT,
    label TEXT,
    amount INT,
    count INT
);

CREATE VIEW endurance_project_dto
WITH (security_invoker = true)
AS
SELECT 
    p.id,
    p.type,
    p.title,
    p.status,

    ROW(eu.id, eu.target_count, eu.current_count)::dto_endurance_unit AS unit,
    
    ROW(eac.normal_count, eac.rescue_count, eac.sabotage_count)::dto_endurance_action_count AS action_count,

    COALESCE(
        (
            SELECT array_agg(ROW(a.id, a.type, a.position, a.label, a.amount, a.count)::dto_endurance_action ORDER BY a.position ASC)
            FROM endurance_actions_new a
            WHERE a.project_id = p.id AND a.type = 'rescue'
        ),
        '{}'::dto_endurance_action[]
    ) AS rescue_actions,

    COALESCE(
        (
            SELECT array_agg(ROW(a.id, a.type, a.position, a.label, a.amount, a.count)::dto_endurance_action ORDER BY a.position ASC)
            FROM endurance_actions_new a
            WHERE a.project_id = p.id AND a.type = 'sabotage'
        ),
        '{}'::dto_endurance_action[]
    ) AS sabotage_actions

FROM projects p
LEFT JOIN endurance_units eu ON eu.project_id = p.id
LEFT JOIN endurance_action_counts eac ON eac.project_id = p.id
WHERE p.type = 'endurance';
