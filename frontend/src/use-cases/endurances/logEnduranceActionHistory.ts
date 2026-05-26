import { Effect } from "effect";

import type { LogEnduranceActionHistoryArgs } from "@/domain/endurances/rpcs/LogEnduranceActionHistory";
import { EnduranceRepository } from "@/repositories/endurances/endurance.repository";

/**
 * カウントの履歴を記録します。
 * @param args rpcに渡す引数
 * @returns 対応する企画のID
 */
export const logEnduranceActionHistory = (
    args: LogEnduranceActionHistoryArgs,
) =>
    Effect.gen(function* () {
        const repository = yield* EnduranceRepository;
        return yield* repository.logActionHistory(args);
    });
