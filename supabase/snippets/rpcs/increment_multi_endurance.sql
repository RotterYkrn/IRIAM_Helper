create function increment_multi_endurance(
    p_setting_id uuid,
    p_is_reversal boolean
)
returns uuid
language plpgsql
SET search_path = public
as $$
declare
    v_amount integer;
begin
    if p_is_reversal = true then
        v_amount = -1;
    else
        v_amount = 1;
    end if;

    update multi_endurance_progress
    set
        current_count = current_count + v_amount,
        updated_at = now()
    where setting_id = p_setting_id;

    return p_setting_id;
end;
$$;
