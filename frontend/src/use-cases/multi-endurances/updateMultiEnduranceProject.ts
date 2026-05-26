import { Effect } from "effect";

import { type UpdateMultiEnduranceProjectArgs } from "@/domain/multi-endurances/rpcs/UpdateMultiEnduranceProject";
import { MultiEnduranceRepository } from "@/repositories/multi-endurances/multi-endurance.repository";

export const updateMultiEnduranceProject = (
    args: UpdateMultiEnduranceProjectArgs,
) =>
    Effect.gen(function* () {
        const repository = yield* MultiEnduranceRepository;
        return yield* repository.update(args);
    });
