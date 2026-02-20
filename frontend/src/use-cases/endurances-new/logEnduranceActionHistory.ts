import { Effect, pipe, Schema } from "effect";

import {
    type LogEnduranceActionHistoryNewArgsEncoded,
    LogEnduranceActionHistoryNewArgsSchema,
    LogEnduranceActionHistoryNewReturnsSchema,
} from "@/domain/endurances-new/rpcs/LogEnduranceActionHistoryNew";
import { type ProjectId } from "@/domain/projects/tables/Project";
import { supabase } from "@/lib/supabase";

export const logEnduranceActionHistoryNew = (
    args: LogEnduranceActionHistoryNewArgsEncoded,
): Effect.Effect<ProjectId, unknown> =>
    pipe(
        args,
        Schema.decodeEither(LogEnduranceActionHistoryNewArgsSchema),
        Effect.tryMapPromise({
            try: (args) =>
                supabase.rpc(
                    "log_endurance_action_history_new",
                    Schema.encodeSync(LogEnduranceActionHistoryNewArgsSchema)(
                        args,
                    ),
                ),
            catch: (error) => error,
        }),
        Effect.flatMap(({ data, error }) =>
            error ? Effect.fail(error) : Effect.succeed(data),
        ),
        Effect.flatMap(
            Schema.decodeUnknownEither(
                LogEnduranceActionHistoryNewReturnsSchema,
            ),
        ),
    );
