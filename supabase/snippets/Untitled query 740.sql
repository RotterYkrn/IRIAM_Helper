SELECT * FROM create_endurance_project_new(
    'テスト', 
    100, 
    ARRAY[(1, '救済1', 10.0)::create_endurance_action_args], 
    ARRAY[]::create_endurance_action_args[] -- 👈 ここに「::型名[]」を明示する！
) LIMIT 100;