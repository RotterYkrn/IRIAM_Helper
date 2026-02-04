import { Schema, pipe, Effect } from "effect";

import {
    FinishProjectArgsSchema,
    FinishProjectReturnsSchema,
    type FinishProjectArgsEncoded,
} from "@/domain/projects/rpcs/FinishProject";
import { supabase } from "@/lib/supabase";

export const finishProject = (args: FinishProjectArgsEncoded) =>
    pipe(
        args,
        Schema.decodeEither(FinishProjectArgsSchema),
        Effect.tryMapPromise({
            try: (args) =>
                supabase.rpc(
                    "finish_project",
                    Schema.encodeSync(FinishProjectArgsSchema)(args),
                ),
            catch: (error) => error,
        }),
        Effect.flatMap(({ data, error }) =>
            error ? Effect.fail(error) : Effect.succeed(data),
        ),
        Effect.flatMap(Schema.decodeUnknownEither(FinishProjectReturnsSchema)),
    );
