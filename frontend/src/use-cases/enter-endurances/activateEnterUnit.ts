import { Effect } from "effect";

import type { ActivateEnterUnitArgs } from "@/domain/enter_endurances/rpcs/ActivateEnterUnit";
import { EnterEnduranceRepository } from "@/repositories/enter-endurances/enter-endurance.repository";

export const activateEnterUnit = (args: ActivateEnterUnitArgs) =>
    Effect.gen(function* () {
        const repository = yield* EnterEnduranceRepository;
        return yield* repository.activateUnit(args);
    });
