import { Effect, pipe, Schema } from "effect";

import { EnduranceProjectViewNewSchema } from "@/domain/endurances-new/views/EnduranceProjectViewNew";
import {
    ProjectIdSchema,
    type ProjectIdEncoded,
} from "@/domain/projects/tables/Project";
import { supabase } from "@/lib/supabase";

export const fetchEnduranceProjectNew = (projectId: ProjectIdEncoded) =>
    pipe(
        projectId,
        Schema.decodeEither(ProjectIdSchema),
        Effect.tryMapPromise({
            try: (id) =>
                supabase
                    .from("endurance_project_view_new")
                    .select("*")
                    .eq("id", id)
                    .single(),
            catch: (error) => error,
        }),
        Effect.flatMap(({ data, error }) =>
            error ? Effect.fail(error) : Effect.succeed(data),
        ),
        Effect.flatMap(
            Schema.decodeUnknownEither(EnduranceProjectViewNewSchema),
        ),
    );
