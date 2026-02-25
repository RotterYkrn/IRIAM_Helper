import { Effect, pipe, Schema } from "effect";

import {
    LogEnduranceActionHistoryArgsSchema,
    type LogEnduranceActionHistoryArgsEncoded,
} from "@/domain/endurances/rpcs/LogEnduranceActionHistory";
import {
    ProjectIdSchema,
    type ProjectId,
} from "@/domain/projects/tables/Project";
import { supabase } from "@/lib/supabase";

export const logEnduranceActionHistory = (
    args: LogEnduranceActionHistoryArgsEncoded,
): Effect.Effect<ProjectId, unknown> =>
    pipe(
        args,
        Schema.decodeEither(LogEnduranceActionHistoryArgsSchema),
        Effect.tryMapPromise({
            try: (args) =>
                supabase.rpc(
                    "log_endurance_action_history",
                    Schema.encodeSync(LogEnduranceActionHistoryArgsSchema)(
                        args,
                    ),
                ),
            catch: (error) => error,
        }),
        Effect.flatMap(({ data, error }) =>
            error ? Effect.fail(error) : Effect.succeed(data),
        ),
        Effect.flatMap(Schema.decodeUnknownEither(ProjectIdSchema)),
    );
