import type { PostgrestSingleResponse } from "@supabase/supabase-js";
import { Effect, pipe, Schema } from "effect";

export const queryAndDecode = <A, I>(
    query: (signal: AbortSignal) => PromiseLike<PostgrestSingleResponse<I>>,
    schema: Schema.Schema<A, I, never>,
    errorMessage = "Failed to execute Supabase query",
) =>
    pipe(
        Effect.tryPromise({
            try: query,
            catch: (error) => new Error(`${errorMessage}: ${String(error)}`),
        }),
        Effect.flatMap(({ data, error }) =>
            error ? Effect.fail(error) : Effect.succeed(data),
        ),
        Effect.flatMap(Schema.decodeEither(schema)),
    );
