import { Effect } from "effect";

import { type LogMultiEnduranceActionHistoryArgs } from "@/domain/multi-endurances/rpcs/LogMultiEnduranceActionHistory";
import { MultiEnduranceRepository } from "@/repositories/multi-endurances/multi-endurance.repository";

export const logMultiEnduranceActionHistory = (
    args: LogMultiEnduranceActionHistoryArgs,
) =>
    Effect.gen(function* () {
        const repository = yield* MultiEnduranceRepository;
        return yield* repository.logActionHistory(args);
    });
