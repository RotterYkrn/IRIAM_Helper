create function increment_multi_endurance(
    p_setting_id uuid
)
returns uuid
language plpgsql
SET search_path = public
as $$
begin
    update multi_endurance_progress
    set
        current_count = current_count + 1,
        updated_at = now()
    where setting_id = p_setting_id;

    return p_setting_id;
end;
$$;
