create or replace view "public"."multi_endurance_project_dto" as  SELECT id,
    type,
    title,
    status,
    COALESCE(( SELECT array_agg(ROW(u.id, u."position", u.label, (u.target_count)::integer, (u.current_count)::integer)::public.dto_multi_endurance_unit ORDER BY u."position") AS array_agg
           FROM public.endurance_units u
          WHERE (u.project_id = p.id)), '{}'::public.dto_multi_endurance_unit[]) AS units
   FROM public.projects p
  WHERE (type = 'multi-endurance'::text);



