import { Effect, pipe, Schema } from "effect";

import {
    LogMultiEnduranceActionHistoryArgsSchema,
    LogMultiEnduranceActionHistoryReturnsSchema,
    type LogMultiEnduranceActionHistoryArgs,
} from "@/domain/multi-endurances/rpcs/LogMultiEnduranceActionHistory";
import { supabase } from "@/lib/supabase";

export const logMultiEnduranceActionHistory = (
    args: LogMultiEnduranceActionHistoryArgs,
) =>
    pipe(
        Effect.tryPromise({
            try: () =>
                supabase.rpc(
                    "log_multi_endurance_action_history",
                    Schema.encodeSync(LogMultiEnduranceActionHistoryArgsSchema)(
                        args,
                    ),
                ),
            catch: (error) => error,
        }),
        Effect.flatMap(({ data, error }) =>
            error ? Effect.fail(error) : Effect.succeed(data),
        ),
        Effect.flatMap(
            Schema.decodeEither(LogMultiEnduranceActionHistoryReturnsSchema),
        ),
    );
