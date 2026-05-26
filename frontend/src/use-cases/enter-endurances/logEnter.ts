import { Effect } from "effect";

import { type LogEnterArgs } from "@/domain/enter_endurances/rpcs/LogEnter";
import { EnterEnduranceRepository } from "@/repositories/enter-endurances/enter-endurance.repository";

export const logEnter = (args: LogEnterArgs) =>
    Effect.gen(function* () {
        const repository = yield* EnterEnduranceRepository;
        return yield* repository.logEnter(args);
    });
