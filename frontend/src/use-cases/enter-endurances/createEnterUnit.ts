import { Effect } from "effect";

import { type CreateEnterUnitArgs } from "@/domain/enter_endurances/rpcs/CreateEnterUnit";
import { EnterEnduranceRepository } from "@/repositories/enter-endurances/enter-endurance.repository";

export const createEnterUnit = (args: CreateEnterUnitArgs) =>
    Effect.gen(function* () {
        const repository = yield* EnterEnduranceRepository;
        return yield* repository.createUnit(args);
    });
