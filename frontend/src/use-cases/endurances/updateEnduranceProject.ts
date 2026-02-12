import { Schema, Effect, pipe } from "effect";

import {
    UpdateEnduranceProjectArgsSchema,
    type UpdateEnduranceProjectArgs,
} from "@/domain/endurances/rpcs/UpdateEnduranceProject";
import {
    ProjectIdSchema,
    type ProjectId,
} from "@/domain/projects/tables/Project";
import { supabase } from "@/lib/supabase";

export const updateEnduranceProject = (
    args: UpdateEnduranceProjectArgs,
): Effect.Effect<ProjectId, unknown> =>
    pipe(
        Effect.tryPromise({
            try: () =>
                supabase.rpc(
                    "update_endurance_project",
                    Schema.encodeSync(UpdateEnduranceProjectArgsSchema)(
                        args,
                    ) as any,
                ),
            catch: (error) => error,
        }),
        Effect.flatMap(({ data, error }) =>
            error ? Effect.fail(error) : Effect.succeed(data),
        ),
        Effect.flatMap(Schema.decodeUnknownEither(ProjectIdSchema)),
    );
