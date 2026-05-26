import { Effect } from "effect";

import type { EnterUnitSchema } from "@/domain/enter_endurances/tables/EnterUnit";
import { EnterEnduranceRepository } from "@/repositories/enter-endurances/enter-endurance.repository";

export const fetchEnterEnduranceUnit = (
    unitId: typeof EnterUnitSchema.Type.id,
) =>
    Effect.gen(function* () {
        const repository = yield* EnterEnduranceRepository;
        return yield* repository.getUnitById(unitId);
    });
