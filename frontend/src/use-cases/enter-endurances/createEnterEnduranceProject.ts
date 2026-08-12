import { Effect } from "effect";

import { EnterEnduranceRepository } from "@/repositories/enter-endurances/enter-endurance.repository";

export const createEnterEnduranceProject = () =>
    Effect.gen(function* () {
        const repository = yield* EnterEnduranceRepository;
        return yield* repository.createProject();
    });
