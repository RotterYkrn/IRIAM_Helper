alter table projects
add constraint projects_title_not_empty
check (length(trim(title)) > 0);