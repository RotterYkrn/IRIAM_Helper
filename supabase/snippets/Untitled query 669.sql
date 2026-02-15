ALTER TABLE projects
    -- 一度削除
    DROP CONSTRAINT projects_type_check,
    -- 新しいリストで再作成
    ADD CONSTRAINT projects_type_check 
        CHECK (type IN ('endurance', 'multi_endurance', 'gacha', 'panel_open'));