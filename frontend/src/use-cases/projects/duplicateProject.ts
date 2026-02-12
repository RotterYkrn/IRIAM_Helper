import { Effect, pipe, Schema } from "effect";

import {
    ProjectIdSchema,
    type ProjectId,
} from "@/domain/projects/tables/Project";
import { supabase } from "@/lib/supabase";

export const duplicateProject = (projectId: ProjectId) =>
    pipe(
        Effect.tryPromise({
            try: async () =>
                await supabase.rpc("duplicate_project", {
                    p_project_id: Schema.encodeSync(ProjectIdSchema)(projectId),
                }),
            catch: (error) => error,
        }),
        Effect.flatMap(({ data, error }) =>
            error ? Effect.fail(error) : Effect.succeed(data),
        ),
        Effect.flatMap(Schema.decodeUnknownEither(ProjectIdSchema)),
    );
