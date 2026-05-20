alter table "public"."endurance_units" drop constraint "endurance_units_target_count_check";

alter table "public"."endurance_units" add constraint "endurance_units_target_count_check" CHECK ((target_count >= (0)::numeric)) not valid;

alter table "public"."endurance_units" validate constraint "endurance_units_target_count_check";


