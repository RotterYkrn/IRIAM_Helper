import { Effect } from "effect";

import type { ProjectSchema } from "@/domain/projects/tables/Project";
import { EnterEnduranceRepository } from "@/repositories/enter-endurances/enter-endurance.repository";

export const fetchEnterEnduranceProject = (
    projectId: typeof ProjectSchema.Type.id,
) =>
    Effect.gen(function* () {
        const repository = yield* EnterEnduranceRepository;
        return yield* repository.getProjectById(projectId);
    });
