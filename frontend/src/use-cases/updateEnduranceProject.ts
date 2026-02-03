import { Schema, Effect, pipe } from "effect";

import {
    type UpdateEnduranceProjectArgsEncoded,
    UpdateEnduranceProjectArgsSchema,
    type UpdateEnduranceProjectReturns,
    UpdateEnduranceProjectReturnsSchema,
} from "@/domain/endurances/rpcs/UpdateEnduranceProject";
import { supabase } from "@/lib/supabase";

export const updateEnduranceProject = (
    args: UpdateEnduranceProjectArgsEncoded,
): Effect.Effect<UpdateEnduranceProjectReturns, unknown> =>
    pipe(
        args,
        Schema.decodeEither(UpdateEnduranceProjectArgsSchema),
        Effect.tryMapPromise({
            try: (args) =>
                supabase.rpc(
                    "update_endurance_project",
                    Schema.encodeSync(UpdateEnduranceProjectArgsSchema)(args),
                ),
            catch: (error) => error,
        }),
        Effect.flatMap(({ data, error }) =>
            error ? Effect.fail(error) : Effect.succeed(data),
        ),
        Effect.flatMap(
            Schema.decodeUnknownEither(UpdateEnduranceProjectReturnsSchema),
        ),
    );
