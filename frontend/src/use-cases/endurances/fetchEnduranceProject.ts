import { Effect } from "effect";

import type { ProjectId } from "@/domain/projects/tables/Project";
import { EnduranceRepository } from "@/repositories/endurances/endurance.repository";

/**
 * 耐久企画（単体）の基本情報を取得する
 * @param projectId 企画ID
 * @returns 耐久企画（単体）の情報
 */
export const fetchEnduranceProject = (projectId: ProjectId) =>
    Effect.gen(function* () {
        const repository = yield* EnduranceRepository;
        return yield* repository.getById(projectId);
    });
