import { Effect, pipe, Schema } from "effect";

import { MultiEnduranceProjectDtoSchema } from "@/domain/multi-endurances/dto/MultiEnduranceProjectDto";
import type { ProjectId } from "@/domain/projects/tables/Project";
import { supabase } from "@/lib/supabase";

export const fetchMultiEnduranceProject = (projectId: ProjectId) =>
    pipe(
        Effect.tryPromise({
            try: () =>
                supabase
                    .from("projects")
                    .select(
                        `
                            id,
                            type,
                            title,
                            status,
                            units:endurance_units (
                                id,
                                position,
                                label,
                                target_count,
                                current_count
                            )
                        `,
                    )
                    .eq("id", projectId)
                    .eq("type", "multi-endurance")
                    .order("position", {
                        referencedTable: "endurance_units",
                        ascending: true,
                    })
                    .single(),
            catch: (error) => error,
        }),
        Effect.flatMap(({ data, error }) =>
            error ? Effect.fail(error) : Effect.succeed(data),
        ),
        Effect.flatMap(Schema.decodeEither(MultiEnduranceProjectDtoSchema)),
    );
