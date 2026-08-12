import { Effect } from "effect";

import { type FinishEnterUnitArgs } from "@/domain/enter_endurances/rpcs/FinishEnterUnit";
import { EnterEnduranceRepository } from "@/repositories/enter-endurances/enter-endurance.repository";

export const finishEnterUnit = (args: FinishEnterUnitArgs) =>
    Effect.gen(function* () {
        const repository = yield* EnterEnduranceRepository;
        return yield* repository.finishUnit(args);
    });
