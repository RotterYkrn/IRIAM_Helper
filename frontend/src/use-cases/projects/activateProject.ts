import { Effect, pipe, Schema } from "effect";

import {
    ActivateProjectArgsSchema,
    ActivateProjectReturnsSchema,
    type ActivateProjectArgsEncoded,
} from "@/domain/projects/rpcs/ActivateProject";
import { supabase } from "@/lib/supabase";

export const activateProject = (args: ActivateProjectArgsEncoded) =>
    pipe(
        args,
        Schema.decodeEither(ActivateProjectArgsSchema),
        Effect.tryMapPromise({
            try: (args) =>
                supabase.rpc(
                    "activate_project",
                    Schema.encodeSync(ActivateProjectArgsSchema)(args),
                ),
            catch: (error) => error,
        }),
        Effect.flatMap(({ data, error }) =>
            error ? Effect.fail(error) : Effect.succeed(data),
        ),
        Effect.flatMap(
            Schema.decodeUnknownEither(ActivateProjectReturnsSchema),
        ),
    );
