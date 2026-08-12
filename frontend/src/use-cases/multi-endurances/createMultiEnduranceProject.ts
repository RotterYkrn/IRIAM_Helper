import { Effect } from "effect";

import { type CreateMultiEnduranceProjectArgs } from "@/domain/multi-endurances/rpcs/CreateMultiEnduranceProject";
import { MultiEnduranceRepository } from "@/repositories/multi-endurances/multi-endurance.repository";

export const createMultiEnduranceProject = (
    args: CreateMultiEnduranceProjectArgs,
) =>
    Effect.gen(function* () {
        const repository = yield* MultiEnduranceRepository;
        return yield* repository.create(args);
    });
