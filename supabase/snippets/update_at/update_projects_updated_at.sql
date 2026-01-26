create trigger update_projects_updated_at
before update on projects
for each row
execute function update_updated_at_column();
