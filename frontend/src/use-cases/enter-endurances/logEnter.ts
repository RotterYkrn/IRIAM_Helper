import { pipe, Effect, Schema } from "effect";

import {
    type LogEnterArgs,
    LogEnterArgsSchema,
    LogEnterReturnsSchema,
} from "@/domain/enter_endurances/rpcs/LogEnter";
import { supabase } from "@/lib/supabase";

export const logEnter = (args: LogEnterArgs) =>
    pipe(
        Effect.tryPromise({
            try: () =>
                supabase.rpc(
                    "log_enter",
                    Schema.encodeSync(LogEnterArgsSchema)(args),
                ),
            catch: (error) => error,
        }),
        Effect.flatMap(({ data, error }) =>
            error ? Effect.fail(error) : Effect.succeed(data),
        ),
        Effect.flatMap(Schema.decodeEither(LogEnterReturnsSchema)),
    );
