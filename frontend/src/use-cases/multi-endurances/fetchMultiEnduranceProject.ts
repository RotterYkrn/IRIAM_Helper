import { Effect } from "effect";

import type { ProjectId } from "@/domain/projects/tables/Project";
import { MultiEnduranceRepository } from "@/repositories/multi-endurances/multi-endurance.repository";

export const fetchMultiEnduranceProject = (projectId: ProjectId) =>
    Effect.gen(function* () {
        const repository = yield* MultiEnduranceRepository;
        return yield* repository.getById(projectId);
    });
