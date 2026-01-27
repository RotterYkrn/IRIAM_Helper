create table projects (
  id uuid primary key default gen_random_uuid(),

  title text not null check (length(trim(title)) > 0),

  type text not null
    check (type in ('endurance','gacha','panel_open')),
  
  status text not null default 'scheduled'
    check (status in ('scheduled','active','finished')),
  
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
