import { Effect } from "effect";

import { EnterEnduranceRepository } from "@/repositories/enter-endurances/enter-endurance.repository";

export const isExistEnterEnduranceProjects = () =>
    Effect.gen(function* () {
        const repository = yield* EnterEnduranceRepository;
        return yield* repository.isExistProject();
    });
