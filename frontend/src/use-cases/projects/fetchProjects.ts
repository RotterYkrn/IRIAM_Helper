import { Effect } from "effect";

import { ProjectRepository } from "@/repositories/projects/project.repository";

/**
 * 企画群を取得します。
 *
 * @returns 企画群
 */
export const fetchProjects = () =>
    Effect.gen(function* () {
        const repository = yield* ProjectRepository;
        return yield* repository.getAll();
    });
