create trigger update_endurance_progress_updated_at
before update on endurance_progress
for each row
execute function update_updated_at_column();
