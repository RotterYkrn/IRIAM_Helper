import { pipe, Effect, Schema } from "effect";

import { EnterProjectDtoSchema } from "@/domain/enter_endurances/dto/EnterProjectDto";
import type { ProjectSchema } from "@/domain/projects/tables/Project";
import { supabase } from "@/lib/supabase";

export const fetchEnterEnduranceProject = (
    projectId: typeof ProjectSchema.Type.id,
) =>
    pipe(
        Effect.tryPromise({
            try: () =>
                supabase
                    .from("projects")
                    .select(
                        `
                            id,
                            title,
                            units:enter_units(
                                id,
                                status,
                                event_date,
                                started_at,
                                completed_at
                            )
                        `,
                    )
                    .eq("id", projectId)
                    .eq("type", "enter-endurance")
                    .order("event_date", {
                        referencedTable: "enter_units",
                        ascending: false,
                    })
                    .single(),
            catch: (error) => error,
        }),
        Effect.flatMap(({ data, error }) =>
            error ? Effect.fail(error) : Effect.succeed(data),
        ),
        Effect.flatMap(Schema.decodeEither(EnterProjectDtoSchema)),
    );
