import { Effect, pipe, Schema } from "effect";

import { MultiEnduranceProjectDtoSchema } from "@/domain/multi-endurances/dto/MultiEnduranceProjectDto";
import type { ProjectId } from "@/domain/projects/tables/Project";
import { supabase } from "@/lib/supabase";

export const fetchMultiEnduranceProject = (projectId: ProjectId) =>
    pipe(
        Effect.tryPromise({
            try: () =>
                supabase
                    .from("multi_endurance_project_dto")
                    .select("*")
                    .eq("id", projectId)
                    .single(),
            catch: (error) => error,
        }),
        Effect.flatMap(({ data, error }) =>
            error ? Effect.fail(error) : Effect.succeed(data),
        ),
        Effect.flatMap(Schema.decodeEither(MultiEnduranceProjectDtoSchema)),
    );
