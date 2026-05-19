import { Effect, pipe, Schema } from "effect";

import {
    type LogEnduranceActionHistoryArgsEncoded,
    LogEnduranceActionHistoryArgsSchema,
    LogEnduranceActionHistoryReturnsSchema,
} from "@/domain/endurances/rpcs/LogEnduranceActionHistory";
import { type ProjectId } from "@/domain/projects/tables/Project";
import { supabase } from "@/lib/supabase";

/**
 * カウントの履歴を記録します。
 * @param args rpcに渡す引数
 * @returns 対応する企画のID
 */
export const logEnduranceActionHistory = (
    args: LogEnduranceActionHistoryArgsEncoded,
): Effect.Effect<ProjectId, unknown> =>
    pipe(
        args,
        Schema.decodeEither(LogEnduranceActionHistoryArgsSchema),
        Effect.tryMapPromise({
            try: (args) =>
                supabase.rpc(
                    "log_endurance_action_history_new",
                    Schema.encodeSync(LogEnduranceActionHistoryArgsSchema)(
                        args,
                    ),
                ),
            catch: (error) => error,
        }),
        Effect.flatMap(({ data, error }) =>
            error ? Effect.fail(error) : Effect.succeed(data),
        ),
        Effect.flatMap(
            Schema.decodeUnknownEither(LogEnduranceActionHistoryReturnsSchema),
        ),
    );
