drop table if exists gift_category_mappings cascade;
drop table if exists gift_categories cascade;
drop table if exists gifts cascade;

-- 1. ギフトマスタ
CREATE TABLE gifts (
    id uuid not null primary key default gen_random_uuid(),
    name text not null unique check(length(trim(name)) > 0),
    nick_name text null unique check(length(trim(nick_name)) > 0),
    point integer not null check(point > 0)
    -- image_url text null check(length(trim(image_url)) > 0),
);

-- 2. カテゴリマスタ（タブの管理）
CREATE TABLE gift_categories (
    id integer not null GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name text not null unique check(length(trim(name)) > 0)
);

-- 3. 中間テーブル（ここが肝！複数カテゴリを紐付ける）
CREATE TABLE gift_category_mappings (
    gift_id uuid not null REFERENCES gifts(id) ON DELETE CASCADE,
    category_id integer not null REFERENCES gift_categories(id) ON DELETE CASCADE,
    PRIMARY KEY (gift_id, category_id) -- 重複登録を防ぐ複合主キー
);
