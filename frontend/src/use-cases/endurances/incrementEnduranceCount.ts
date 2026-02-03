import { Effect, pipe, Schema } from "effect";

import {
    IncrementEnduranceCountArgsSchema,
    IncrementEnduranceCountReturnsSchema,
    type IncrementEnduranceCountArgsEncoded,
} from "@/domain/endurances/rpcs/IncrementEnduranceCount";
import { supabase } from "@/lib/supabase";

export const incrementEnduranceCount = (
    args: IncrementEnduranceCountArgsEncoded,
) =>
    pipe(
        args,
        Schema.decodeEither(IncrementEnduranceCountArgsSchema),
        Effect.tryMapPromise({
            try: (args) =>
                supabase.rpc(
                    "increment_endurance_count",
                    Schema.encodeSync(IncrementEnduranceCountArgsSchema)(args),
                ),
            catch: (error) => error,
        }),
        Effect.flatMap(({ data, error }) =>
            error ? Effect.fail(error) : Effect.succeed(data),
        ),
        Effect.flatMap(
            Schema.decodeUnknownEither(IncrementEnduranceCountReturnsSchema),
        ),
    );
