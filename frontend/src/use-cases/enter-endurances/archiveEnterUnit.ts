import { Effect } from "effect";

import { type ArchiveEnterUnitArgs } from "@/domain/enter_endurances/rpcs/ArchiveEnterUnit";
import { EnterEnduranceRepository } from "@/repositories/enter-endurances/enter-endurance.repository";

export const archiveEnterUnit = (args: ArchiveEnterUnitArgs) =>
    Effect.gen(function* () {
        const repository = yield* EnterEnduranceRepository;
        return yield* repository.archiveUnit(args);
    });
