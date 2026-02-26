import { pipe, Effect, Schema } from "effect";

import {
    type DuplicateEnduranceProjectArgs,
    DuplicateEnduranceProjectArgsSchema,
    DuplicateEnduranceProjectReturnsSchema,
} from "@/domain/endurances-new/rpcs/DuplicateEnduranceProject";
import { supabase } from "@/lib/supabase";

export const duplicateEnduranceProject = (
    args: DuplicateEnduranceProjectArgs,
) =>
    pipe(
        Effect.tryPromise({
            try: () =>
                supabase.rpc(
                    "duplicate_endurance_project",
                    Schema.encodeSync(DuplicateEnduranceProjectArgsSchema)(
                        args,
                    ),
                ),
            catch: (error) => error,
        }),
        Effect.flatMap(({ data, error }) =>
            error ? Effect.fail(error) : Effect.succeed(data),
        ),
        Effect.flatMap(
            Schema.decodeUnknownEither(DuplicateEnduranceProjectReturnsSchema),
        ),
    );
