revoke delete on table "public"."endurance_action_histories" from "anon";

revoke insert on table "public"."endurance_action_histories" from "anon";

revoke references on table "public"."endurance_action_histories" from "anon";

revoke select on table "public"."endurance_action_histories" from "anon";

revoke trigger on table "public"."endurance_action_histories" from "anon";

revoke truncate on table "public"."endurance_action_histories" from "anon";

revoke update on table "public"."endurance_action_histories" from "anon";

revoke delete on table "public"."endurance_action_histories" from "authenticated";

revoke insert on table "public"."endurance_action_histories" from "authenticated";

revoke references on table "public"."endurance_action_histories" from "authenticated";

revoke select on table "public"."endurance_action_histories" from "authenticated";

revoke trigger on table "public"."endurance_action_histories" from "authenticated";

revoke truncate on table "public"."endurance_action_histories" from "authenticated";

revoke update on table "public"."endurance_action_histories" from "authenticated";

revoke delete on table "public"."endurance_action_histories" from "service_role";

revoke insert on table "public"."endurance_action_histories" from "service_role";

revoke references on table "public"."endurance_action_histories" from "service_role";

revoke select on table "public"."endurance_action_histories" from "service_role";

revoke trigger on table "public"."endurance_action_histories" from "service_role";

revoke truncate on table "public"."endurance_action_histories" from "service_role";

revoke update on table "public"."endurance_action_histories" from "service_role";

revoke delete on table "public"."endurance_actions" from "anon";

revoke insert on table "public"."endurance_actions" from "anon";

revoke references on table "public"."endurance_actions" from "anon";

revoke select on table "public"."endurance_actions" from "anon";

revoke trigger on table "public"."endurance_actions" from "anon";

revoke truncate on table "public"."endurance_actions" from "anon";

revoke update on table "public"."endurance_actions" from "anon";

revoke delete on table "public"."endurance_actions" from "authenticated";

revoke insert on table "public"."endurance_actions" from "authenticated";

revoke references on table "public"."endurance_actions" from "authenticated";

revoke select on table "public"."endurance_actions" from "authenticated";

revoke trigger on table "public"."endurance_actions" from "authenticated";

revoke truncate on table "public"."endurance_actions" from "authenticated";

revoke update on table "public"."endurance_actions" from "authenticated";

revoke delete on table "public"."endurance_actions" from "service_role";

revoke insert on table "public"."endurance_actions" from "service_role";

revoke references on table "public"."endurance_actions" from "service_role";

revoke select on table "public"."endurance_actions" from "service_role";

revoke trigger on table "public"."endurance_actions" from "service_role";

revoke truncate on table "public"."endurance_actions" from "service_role";

revoke update on table "public"."endurance_actions" from "service_role";

revoke delete on table "public"."endurance_progress" from "anon";

revoke insert on table "public"."endurance_progress" from "anon";

revoke references on table "public"."endurance_progress" from "anon";

revoke select on table "public"."endurance_progress" from "anon";

revoke trigger on table "public"."endurance_progress" from "anon";

revoke truncate on table "public"."endurance_progress" from "anon";

revoke update on table "public"."endurance_progress" from "anon";

revoke delete on table "public"."endurance_progress" from "authenticated";

revoke insert on table "public"."endurance_progress" from "authenticated";

revoke references on table "public"."endurance_progress" from "authenticated";

revoke select on table "public"."endurance_progress" from "authenticated";

revoke trigger on table "public"."endurance_progress" from "authenticated";

revoke truncate on table "public"."endurance_progress" from "authenticated";

revoke update on table "public"."endurance_progress" from "authenticated";

revoke delete on table "public"."endurance_progress" from "service_role";

revoke insert on table "public"."endurance_progress" from "service_role";

revoke references on table "public"."endurance_progress" from "service_role";

revoke select on table "public"."endurance_progress" from "service_role";

revoke trigger on table "public"."endurance_progress" from "service_role";

revoke truncate on table "public"."endurance_progress" from "service_role";

revoke update on table "public"."endurance_progress" from "service_role";

alter table "public"."endurance_action_histories" drop constraint "endurance_action_histories_action_amount_check";

alter table "public"."endurance_action_histories" drop constraint "endurance_action_histories_action_type_check";

alter table "public"."endurance_action_histories" drop constraint "fk_endurance_histories_actions";

alter table "public"."endurance_action_histories" drop constraint "fk_endurance_histories_project";

alter table "public"."endurance_actions" drop constraint "endurance_actions_amount_check";

alter table "public"."endurance_actions" drop constraint "endurance_actions_type_check";

alter table "public"."endurance_actions" drop constraint "fk_action_project";

alter table "public"."endurance_actions" drop constraint "unique_action_label_per_type_per_project";

alter table "public"."endurance_progress" drop constraint "endurance_progress_normal_count_check";

alter table "public"."endurance_progress" drop constraint "endurance_progress_rescue_count_check";

alter table "public"."endurance_progress" drop constraint "endurance_progress_sabotage_count_check";

alter table "public"."endurance_progress" drop constraint "fk_endurance_progress_project";

alter table "public"."endurance_progress" drop constraint "unique_endurance_progress_project";

drop function if exists "public"."duplicate_project"(p_project_id uuid);

drop function if exists "public"."log_endurance_action_history"(p_project_id uuid, p_action_history_type text, p_is_reversal boolean, p_action_id uuid);

alter table "public"."endurance_action_histories" drop constraint "endurance_action_histories_pkey";

alter table "public"."endurance_actions" drop constraint "endurance_actions_pkey";

alter table "public"."endurance_progress" drop constraint "endurance_progress_pkey";

drop index if exists "public"."endurance_action_histories_pkey";

drop index if exists "public"."endurance_actions_pkey";

drop index if exists "public"."endurance_progress_pkey";

drop index if exists "public"."idx_endurance_actions_project_type_position";

drop index if exists "public"."idx_endurance_histories_actions";

drop index if exists "public"."idx_endurance_histories_project_created";

drop index if exists "public"."idx_endurance_progress_project";

drop index if exists "public"."unique_action_label_per_type_per_project";

drop index if exists "public"."unique_endurance_progress_project";

drop table "public"."endurance_action_histories";

drop table "public"."endurance_actions";

drop table "public"."endurance_progress";

grant delete on table "public"."endurance_settings" to "postgres";

grant insert on table "public"."endurance_settings" to "postgres";

grant references on table "public"."endurance_settings" to "postgres";

grant select on table "public"."endurance_settings" to "postgres";

grant trigger on table "public"."endurance_settings" to "postgres";

grant truncate on table "public"."endurance_settings" to "postgres";

grant update on table "public"."endurance_settings" to "postgres";


