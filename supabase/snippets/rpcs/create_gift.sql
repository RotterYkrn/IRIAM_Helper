drop function if exists create_gift cascade;

create function create_gift (
    p_name text,
    p_point integer,
    p_category_ids integer[],
    p_nick_name text default null
)
returns uuid
language plpgsql
SET search_path = public
as $$
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
$$;